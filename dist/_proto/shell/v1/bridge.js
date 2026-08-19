/* Proto anchor bridge, runs inside the untrusted raw-prototype realm.
   Talks to its paired plain shell over postMessage. Every outbound
   message targets the exact paired shell origin, derived once at load from
   document.referrer / location.ancestorOrigins and validated to look like
   https://{base}.{suffix}; it never posts to the wildcard target "*". Inbound
   messages from the shell are accepted only when event.origin equals that
   same expected shell origin. No inbound value is ever written into an
   executing sink (no eval, no innerHTML): route/navigate values are treated
   as data, assigned to the in-realm router or location.

   Outbound shapes:
     {type:"geometry", x, y, scroll, vw, vh}
     {type:"anchor", x, y, scroll, vw, vh, handle}   (handle is shell-minted)
     {type:"text-anchor", x, y, scroll, vw, vh, handle, status, rects, score, strategy}
     {type:"selection-capture", x, y, scroll, vw, vh, handle, capture, rects}
     {type:"selection-state", active}
     {type:"route", route}
     {type:"prime-request"}
     {type:"open-comments"}   (window.protoOpenComments(), below)
     {type:"show-toolbar"}    (window.protoShowToolbar(), below)
     {type:"open-prototype", slug}  (window.protoOpen(slug), below)
     {type:"reserved-key", id}  (see "reserved keystroke forwarding" below)
     {type:"frame-error", kind:"error"|"unhandledrejection", message,
      source?, line?, col?, stack?}  (see "frame-error forwarding" below)

   Inbound shapes accepted (only after an origin check):
     {type:"resolveAnchor", x, y}
     {type:"resolve-text-anchor", handle, kind, normalizer, selectors}
     {type:"describe-selection", handle}
     {type:"watch-selection", on}   (boolean; arms the selection-state signal)
     {type:"navigate", route}
     {type:"color-scheme", value}   (value: "system" | "light" | "dark")
     {type:"scroll-by", dx, dy}     (finite numbers; applied via scrollBy)
     {type:"scroll-to", x, y}       (finite, non-negative; applied via scrollTo)
     {type:"panel-context", route}  (non-empty string)

   PUBLIC API (08.03): window.protoOpenComments() / window.protoShowToolbar()
   are the ONE intentional public surface this file exposes to the
   prototype's OWN code -- for a prototype whose nav.json opts its comments
   or settings entry into "custom" (suppressing the shell's own floating
   button for that affordance), these let its in-app UI trigger the same
   shell action the suppressed button would have. Both just call `post()`
   with the fixed shapes above -- no new origin logic, reusing the exact
   `shellOrigin` derivation and same-origin-only discipline the rest of this
   file already enforces. window.protoOpen(slug) extends the same public
   surface for cross-prototype launch: it carries a target slug that the
   shell independently re-validates before opening it. A no-op (posts
   nothing) if no valid shell origin was derived at load, same as every
   other `post()` call. */
(function () {
  "use strict";

  function deriveShellOrigin() {
    var candidates = [];
    try {
      if (window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0) {
        candidates.push(window.location.ancestorOrigins[0]);
      }
    } catch (e) {
      /* ancestorOrigins not available in this browser, fall through */
    }
    if (document.referrer) {
      try {
        candidates.push(new URL(document.referrer).origin);
      } catch (e) {
        /* malformed referrer, ignore */
      }
    }
    for (var i = 0; i < candidates.length; i++) {
      if (isValidShellOrigin(candidates[i])) {
        return candidates[i];
      }
    }
    return null;
  }

  function isValidShellOrigin(origin) {
    if (typeof origin !== "string") {
      return false;
    }
    var parsed;
    try {
      parsed = new URL(origin);
    } catch (e) {
      return false;
    }
    if (parsed.protocol !== "https:") {
      return false;
    }
    if (parsed.username || parsed.password) {
      return false;
    }
    if (parsed.origin !== origin) {
      return false;
    }
    var host = parsed.hostname;
    if (!host || host.indexOf(".") === -1) {
      return false;
    }
    var labels = host.split(".");
    for (var i = 0; i < labels.length; i++) {
      if (labels[i].length === 0) {
        return false;
      }
    }
    return true;
  }

  var shellOrigin = deriveShellOrigin();

  function post(msg) {
    if (!shellOrigin) {
      return;
    }
    window.parent.postMessage(msg, shellOrigin);
  }

  function reportGeometry() {
    post({
      type: "geometry",
      x: window.scrollX || 0,
      y: window.scrollY || 0,
      scroll: document.documentElement ? document.documentElement.scrollHeight : 0,
      vw: window.innerWidth || 0,
      vh: window.innerHeight || 0
    });
  }

  function reportAnchor(handle) {
    post({
      type: "anchor",
      x: window.scrollX || 0,
      y: window.scrollY || 0,
      scroll: document.documentElement ? document.documentElement.scrollHeight : 0,
      vw: window.innerWidth || 0,
      vh: window.innerHeight || 0,
      handle: handle
    });
  }

  var resolverPath = "/_proto/shell/v1/text-anchor-resolver.js";

  var resolverState = "idle";
  var resolverQueue = [];
  var RESOLVER_QUEUE_MAX = 32;

  function loadResolver() {
    resolverState = "loading";
    var el = document.createElement("script");
    el.src = resolverPath;
    el.async = true;
    el.addEventListener("load", function () {
      resolverState = typeof window.__protoResolveTextAnchor === "function"
        ? "ready"
        : "failed";
      drainResolverQueue();
    });
    el.addEventListener("error", function () {
      resolverState = "failed";
      drainResolverQueue();
    });
    (document.head || document.documentElement).appendChild(el);
  }

  function drainResolverQueue() {
    var queued = resolverQueue;
    resolverQueue = [];
    for (var i = 0; i < queued.length; i++) {
      answerQueued(queued[i]);
    }
  }

  function answerQueued(request) {
    if (request.op === "describe") {
      answerDescribeSelection(request);
      return;
    }
    if (request.op === "describe-node") {
      answerDescribeNodeAtPoint(request);
      return;
    }
    answerTextAnchor(request);
  }

  function unanchoredResult(strategy) {
    return { status: "unanchored", rects: [], score: 0, strategy: strategy };
  }

  function answerTextAnchor(request) {
    var result;
    if (resolverState !== "ready") {
      result = unanchoredResult("resolver-unavailable");
    } else {
      try {
        result = window.__protoResolveTextAnchor(request.payload);
      } catch (e) {
        result = unanchoredResult("resolver-error");
      }
    }
    reportTextAnchor(request.handle, result);
  }

  function reportTextAnchor(handle, result) {
    post({
      type: "text-anchor",
      x: window.scrollX || 0,
      y: window.scrollY || 0,
      scroll: document.documentElement ? document.documentElement.scrollHeight : 0,
      vw: window.innerWidth || 0,
      vh: window.innerHeight || 0,
      handle: handle,
      status: validStatus(result) ? result.status : "unanchored",
      rects: boundedRects(result && result.rects),
      score: typeof result.score === "number" && isFinite(result.score) ? result.score : 0,
      strategy: typeof result.strategy === "string" ? result.strategy.slice(0, 64) : "none"
    });
  }

  function validStatus(result) {
    if (!result || typeof result.status !== "string") {
      return false;
    }
    return result.status === "anchored" || result.status === "approximate" || result.status === "unanchored";
  }

  var TEXT_ANCHOR_RECTS_MAX = 64;

  function boundedRects(rects) {
    if (!rects || typeof rects.length !== "number") {
      return [];
    }
    var out = [];
    for (var i = 0; i < rects.length && out.length < TEXT_ANCHOR_RECTS_MAX; i++) {
      var r = rects[i];
      if (!r || typeof r !== "object") {
        continue;
      }
      if (!isFiniteNumber(r.x) || !isFiniteNumber(r.y) || !isFiniteNumber(r.w) || !isFiniteNumber(r.h)) {
        continue;
      }
      out.push({ x: r.x, y: r.y, w: r.w, h: r.h });
    }
    return out;
  }

  function isFiniteNumber(value) {
    return typeof value === "number" && isFinite(value);
  }

  var TEXT_ANCHOR_SELECTORS_MAX = 12;
  var TEXT_ANCHOR_HANDLE_MAX = 128;
  var TEXT_ANCHOR_VALUE_MAX = 512;
  var TEXT_ANCHOR_CONTEXT_MAX = 256;
  var TEXT_ANCHOR_NORMALIZER_MAX = 32;

  function handleResolveTextAnchor(data) {
    var handle = data.handle;
    if (typeof handle !== "string" || handle.length === 0 || handle.length > TEXT_ANCHOR_HANDLE_MAX) {
      return;
    }
    if (!data.selectors || typeof data.selectors.length !== "number") {
      return;
    }
    if (data.selectors.length === 0 || data.selectors.length > TEXT_ANCHOR_SELECTORS_MAX) {
      return;
    }
    var request = {
      handle: handle,
      payload: {
        kind: data.kind === "block" ? "block" : "text",
        normalizer: typeof data.normalizer === "string" ? data.normalizer.slice(0, 32) : "",
        selectors: Array.prototype.slice.call(data.selectors, 0, TEXT_ANCHOR_SELECTORS_MAX),
        maxRects: TEXT_ANCHOR_RECTS_MAX
      }
    };
    if (resolverState === "ready" || resolverState === "failed") {
      answerTextAnchor(request);
      return;
    }
    if (resolverQueue.length >= RESOLVER_QUEUE_MAX) {
      reportTextAnchor(handle, unanchoredResult("resolver-busy"));
      return;
    }
    resolverQueue.push(request);
    if (resolverState === "idle") {
      loadResolver();
    }
  }

  var selectionWatch = false;
  var selectionWatchListener = null;
  var lastSelectionActive = null;

  var SELECTION_STATE_THROTTLE_MS = 150;
  var selectionStateTimer = null;

  function selectionIsActive() {
    var sel = window.getSelection ? window.getSelection() : null;
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      return false;
    }
    var text = sel.toString();
    return typeof text === "string" && text.replace(/\s+/g, "").length > 0;
  }

  function reportSelectionState() {
    if (!selectionWatch) {
      return;
    }
    var active = selectionIsActive();
    if (active === lastSelectionActive) {
      return;
    }
    lastSelectionActive = active;
    post({ type: "selection-state", active: active });
  }

  function scheduleSelectionState() {
    if (selectionStateTimer !== null) {
      return;
    }
    selectionStateTimer = window.setTimeout(function () {
      selectionStateTimer = null;
      reportSelectionState();
    }, SELECTION_STATE_THROTTLE_MS);
  }

  function applyWatchSelection(on) {
    if (typeof on !== "boolean") {
      return;
    }
    if (on === selectionWatch) {
      return;
    }
    selectionWatch = on;
    if (on) {
      selectionWatchListener = scheduleSelectionState;
      document.addEventListener("selectionchange", selectionWatchListener);
      reportSelectionState();
      return;
    }
    if (selectionWatchListener) {
      document.removeEventListener("selectionchange", selectionWatchListener);
      selectionWatchListener = null;
    }
    if (selectionStateTimer !== null) {
      window.clearTimeout(selectionStateTimer);
      selectionStateTimer = null;
    }
    lastSelectionActive = null;
  }

  function answerDescribeSelection(request) {
    var capture = null;
    if (resolverState === "ready") {
      try {
        capture = window.__protoDescribeSelection({ maxRects: TEXT_ANCHOR_RECTS_MAX });
      } catch (e) {
        capture = null;
      }
    }
    reportSelectionCapture(request.handle, capture);
  }

  function reportSelectionCapture(handle, capture) {
    var bounded = boundedCapture(capture);
    post({
      type: "selection-capture",
      x: window.scrollX || 0,
      y: window.scrollY || 0,
      scroll: document.documentElement ? document.documentElement.scrollHeight : 0,
      vw: window.innerWidth || 0,
      vh: window.innerHeight || 0,
      handle: handle,
      capture: bounded,
      rects: bounded === null ? [] : boundedRects(capture.rects)
    });
  }

  function boundedCapture(capture) {
    if (!capture || typeof capture !== "object") {
      return null;
    }
    if (capture.kind !== "text" && capture.kind !== "block") {
      return null;
    }
    if (typeof capture.normalizer !== "string" || capture.normalizer.length > TEXT_ANCHOR_NORMALIZER_MAX) {
      return null;
    }
    if (!capture.selectors || typeof capture.selectors.length !== "number") {
      return null;
    }
    if (capture.selectors.length === 0 || capture.selectors.length > TEXT_ANCHOR_SELECTORS_MAX) {
      return null;
    }
    var out = [];
    for (var i = 0; i < capture.selectors.length; i++) {
      var sel = boundedSelector(capture.selectors[i]);
      if (sel === null) {
        return null;
      }
      out.push(sel);
    }
    var hasVeto = false;
    for (var j = 0; j < out.length; j++) {
      if (out[j].type === "TextQuoteSelector" || out[j].type === "MediaSelector") {
        hasVeto = true;
      }
    }
    if (!hasVeto) {
      return null;
    }
    return { kind: capture.kind, normalizer: capture.normalizer, selectors: out };
  }

  function boundedSelector(sel) {
    if (!sel || typeof sel !== "object" || typeof sel.type !== "string") {
      return null;
    }
    if (
      sel.type === "optInId" ||
      sel.type === "cssPathFromId" ||
      sel.type === "cssPathFull" ||
      sel.type === "tagClassPath"
    ) {
      if (!boundedString(sel.value, TEXT_ANCHOR_VALUE_MAX)) {
        return null;
      }
      return { type: sel.type, value: sel.value };
    }
    if (sel.type === "TextQuoteSelector") {
      if (!boundedString(sel.exact, TEXT_ANCHOR_VALUE_MAX)) {
        return null;
      }
      if (!boundedString(sel.prefix, TEXT_ANCHOR_CONTEXT_MAX) || !boundedString(sel.suffix, TEXT_ANCHOR_CONTEXT_MAX)) {
        return null;
      }
      return { type: "TextQuoteSelector", exact: sel.exact, prefix: sel.prefix, suffix: sel.suffix };
    }
    if (sel.type === "TextPositionSelector") {
      if (!isFiniteNumber(sel.start) || sel.start < 0) {
        return null;
      }
      return { type: "TextPositionSelector", start: sel.start };
    }
    if (sel.type === "MediaSelector") {
      if (!boundedString(sel.fingerprint, TEXT_ANCHOR_VALUE_MAX)) {
        return null;
      }
      return { type: "MediaSelector", fingerprint: sel.fingerprint };
    }
    return null;
  }

  function boundedString(value, max) {
    return typeof value === "string" && value.length <= max;
  }

  function handleDescribeSelection(data) {
    var handle = data.handle;
    if (typeof handle !== "string" || handle.length === 0 || handle.length > TEXT_ANCHOR_HANDLE_MAX) {
      return;
    }
    var request = { op: "describe", handle: handle };
    if (resolverState === "ready" || resolverState === "failed") {
      answerDescribeSelection(request);
      return;
    }
    if (resolverQueue.length >= RESOLVER_QUEUE_MAX) {
      reportSelectionCapture(handle, null);
      return;
    }
    resolverQueue.push(request);
    if (resolverState === "idle") {
      loadResolver();
    }
  }

  function handleDescribeNode(data) {
    var handle = data.handle;
    if (typeof handle !== "string" || handle.length === 0 || handle.length > TEXT_ANCHOR_HANDLE_MAX) {
      return;
    }
    if (typeof data.x !== "number" || !isFinite(data.x) || typeof data.y !== "number" || !isFinite(data.y)) {
      return;
    }
    var request = { op: "describe-node", handle: handle, x: data.x, y: data.y };
    if (resolverState === "ready" || resolverState === "failed") {
      answerDescribeNodeAtPoint(request);
      return;
    }
    if (resolverQueue.length >= RESOLVER_QUEUE_MAX) {
      reportSelectionCapture(handle, null);
      return;
    }
    resolverQueue.push(request);
    if (resolverState === "idle") {
      loadResolver();
    }
  }

  function answerDescribeNodeAtPoint(request) {
    var capture = null;
    if (resolverState === "ready") {
      try {
        capture = window.__protoDescribeNodeAtPoint({ x: request.x, y: request.y, maxRects: TEXT_ANCHOR_RECTS_MAX });
      } catch (e) {
        capture = null;
      }
    }
    reportSelectionCapture(request.handle, capture);
  }

  var lastReportedRoute = null;

  function reportRoute(route) {
    if (route === lastReportedRoute) {
      return;
    }
    lastReportedRoute = route;
    post({ type: "route", route: route });
  }

  function observeSpaRoutes() {
    var report = function () {
      reportRoute(currentRoute());
    };
    ["pushState", "replaceState"].forEach(function (name) {
      var original = window.history[name];
      if (typeof original !== "function") {
        return;
      }
      window.history[name] = function () {
        var result = original.apply(this, arguments);
        try {
          report();
        } catch (e) {
          /* reporting must never break the prototype's navigation */
        }
        return result;
      };
    });
    window.addEventListener("popstate", report);
    window.addEventListener("hashchange", report);
  }

  function requestPrime() {
    post({ type: "prime-request" });
  }

  function openComments() {
    post({ type: "open-comments" });
  }

  function showToolbar() {
    post({ type: "show-toolbar" });
  }

  window.protoOpenComments = openComments;
  window.protoShowToolbar = showToolbar;

  function openPrototype(slug) {
    if (typeof slug !== "string" || slug.length === 0 || slug.length > 63) {
      return;
    }
    post({ type: "open-prototype", slug: slug });
  }

  window.protoOpen = openPrototype;

  var RESERVED_KEY_BINDINGS = [
    { id: "core.bar-toggle", key: "u", metaOrCtrl: true },
    { id: "core.cycle", key: "c", metaOrCtrl: false },
    { id: "core.spotlight", key: "s", metaOrCtrl: false },
    { id: "core.toolbar-toggle", key: "v", metaOrCtrl: false },
    { id: "core.escape", key: "escape", metaOrCtrl: false }
  ];

  var TEXT_INPUT_TAGS = { INPUT: true, TEXTAREA: true };

  function focusIsInTextInput() {
    var active = document.activeElement;
    if (!active || active.nodeType !== 1) {
      return false;
    }
    if (TEXT_INPUT_TAGS[active.tagName]) {
      return true;
    }
    if (active.isContentEditable) {
      return true;
    }
    return (
      typeof active.closest === "function" &&
      active.closest('[contenteditable]:not([contenteditable="false"])') !== null
    );
  }

  function isExemptFromInputGuard(binding) {
    return !binding.metaOrCtrl && binding.key === "escape";
  }

  function matchesReservedBinding(event, binding) {
    if (event.repeat) {
      return false;
    }
    if (focusIsInTextInput() && !isExemptFromInputGuard(binding)) {
      return false;
    }
    var modifierHeld = !!(event.metaKey || event.ctrlKey);
    return (
      modifierHeld === binding.metaOrCtrl &&
      typeof event.key === "string" &&
      event.key.toLowerCase() === binding.key
    );
  }

  function handleReservedKeyDown(event) {
    for (var i = 0; i < RESERVED_KEY_BINDINGS.length; i++) {
      var binding = RESERVED_KEY_BINDINGS[i];
      if (matchesReservedBinding(event, binding)) {
        event.preventDefault();
        post({ type: "reserved-key", id: binding.id });
        return;
      }
    }
  }

  window.addEventListener("keydown", handleReservedKeyDown);

  var primeRequested = false;

  function notePrimeCandidate() {
    if (primeRequested) {
      return;
    }
    primeRequested = true;
    requestPrime();
  }

  function installFetchObserver() {
    if (typeof window.fetch !== "function") {
      return;
    }
    var originalFetch = window.fetch;
    window.fetch = function () {
      var args = arguments;
      return originalFetch.apply(this, args).then(function (response) {
        if (response && response.status === 401) {
          notePrimeCandidate();
        }
        return response;
      });
    };
  }

  function currentRoute() {
    return window.location.pathname + window.location.search + window.location.hash;
  }

  function applyRoute(route) {
    if (typeof route !== "string" || route.length === 0) {
      return;
    }
    if (route.charAt(0) !== "/" || route.charAt(1) === "/" || route.indexOf("\\") !== -1) {
      return;
    }
    window.location.href = route;
  }

  function applyColorScheme(value) {
    if (value !== "system" && value !== "light" && value !== "dark") {
      return;
    }
    var root = document.documentElement;
    root.style.colorScheme = value === "system" ? "" : value;
    root.setAttribute("data-proto-color-scheme", value);
    try {
      window.dispatchEvent(new CustomEvent("proto:color-scheme", { detail: { value: value } }));
    } catch (e) {
      /* CustomEvent unavailable in this realm: attribute + style already applied */
    }
  }

  function applyScrollBy(dx, dy) {
    if (typeof dx !== "number" || typeof dy !== "number") {
      return;
    }
    if (!isFinite(dx) || !isFinite(dy)) {
      return;
    }
    var maxX = Math.max(window.innerWidth, 1) * 4;
    var maxY = Math.max(window.innerHeight, 1) * 4;
    if (Math.abs(dx) > maxX || Math.abs(dy) > maxY) {
      return;
    }
    window.scrollBy(dx, dy);
  }

  function applyScrollTo(x, y) {
    if (typeof x !== "number" || typeof y !== "number") {
      return;
    }
    if (!isFinite(x) || !isFinite(y)) {
      return;
    }
    if (x < 0 || y < 0) {
      return;
    }
    var reduce = false;
    try {
      reduce =
        !!window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (err) {
      reduce = false;
    }
    try {
      window.scrollTo({
        left: x,
        top: y,
        behavior: reduce ? "auto" : "smooth",
      });
    } catch (err) {
      window.scrollTo(x, y);
    }
  }

  function applyPanelContext(route) {
    if (typeof route !== "string" || route.length === 0) {
      return;
    }
    try {
      window.dispatchEvent(new CustomEvent("proto:panel-context", { detail: { route: route } }));
    } catch (e) {
      /* CustomEvent unavailable in this realm: nothing to apply */
    }
  }

  function handleMessage(event) {
    if (!shellOrigin || event.origin !== shellOrigin) {
      return;
    }
    var data = event.data;
    if (!data || typeof data !== "object") {
      return;
    }
    switch (data.type) {
      case "resolveAnchor":
        if (typeof data.x === "number" && typeof data.y === "number") {
          reportAnchor(data.handle);
        }
        break;
      case "resolve-text-anchor":
        handleResolveTextAnchor(data);
        break;
      case "describe-selection":
        handleDescribeSelection(data);
        break;
      case "describe-node":
        handleDescribeNode(data);
        break;
      case "watch-selection":
        applyWatchSelection(data.on);
        break;
      case "navigate":
        applyRoute(data.route);
        break;
      case "color-scheme":
        applyColorScheme(data.value);
        break;
      case "panel-context":
        applyPanelContext(data.route);
        break;
      case "scroll-by":
        applyScrollBy(data.dx, data.dy);
        break;
      case "scroll-to":
        applyScrollTo(data.x, data.y);
        break;
      default:
        break;
    }
  }

  var FRAME_ERROR_MESSAGE_MAX = 2048;
  var FRAME_ERROR_STACK_MAX = 2048;
  var FRAME_ERROR_LIFETIME_MAX = 3;

  var frameErrorCount = 0;
  var frameErrorSeen = {};

  function capString(value, max) {
    var s = String(value);
    return s.length > max ? s.slice(0, max) : s;
  }

  function mkFrameError(kind, message, source, line, col, stack) {
    var e = { kind: kind, message: capString(message, FRAME_ERROR_MESSAGE_MAX) };
    if (source !== undefined) {
      e.source = source;
    }
    if (typeof line === "number") {
      e.line = line;
    }
    if (typeof col === "number") {
      e.col = col;
    }
    if (stack !== undefined) {
      e.stack = capString(stack, FRAME_ERROR_STACK_MAX);
    }
    return e;
  }

  function postFrameError(entry) {
    if (frameErrorCount >= FRAME_ERROR_LIFETIME_MAX) {
      return;
    }
    var key = entry.message + "\n" + (typeof entry.line === "number" ? entry.line : "");
    if (frameErrorSeen[key]) {
      return;
    }
    frameErrorSeen[key] = true;
    frameErrorCount++;
    entry.type = "frame-error";
    post(entry);
  }

  function drainEarlyFrameErrors() {
    try {
      var buffered = window.__protoFrameErrors;
      if (!buffered || typeof buffered.length !== "number") {
        return;
      }
      for (var i = 0; i < buffered.length; i++) {
        var entry = buffered[i];
        if (!entry || typeof entry !== "object") {
          continue;
        }
        postFrameError(mkFrameError(
          entry.kind === "unhandledrejection" ? "unhandledrejection" : "error",
          entry.message,
          entry.source,
          entry.line,
          entry.col,
          entry.stack
        ));
      }
    } catch (e) {
      /* a clobbered/malformed __protoFrameErrors must never throw here */
    }
  }

  window.addEventListener("error", function (event) {
    try {
      postFrameError(mkFrameError(
        "error",
        event && event.message != null ? event.message : "",
        event && event.filename ? String(event.filename) : undefined,
        event && typeof event.lineno === "number" ? event.lineno : undefined,
        event && typeof event.colno === "number" ? event.colno : undefined,
        event && event.error && event.error.stack ? String(event.error.stack) : undefined
      ));
    } catch (e) {
      /* forwarding a frame error must never itself throw into the document */
    }
  });

  window.addEventListener("unhandledrejection", function (event) {
    try {
      var reason = event && event.reason;
      var isErr = !!reason && typeof reason === "object" && typeof reason.message === "string";
      postFrameError(mkFrameError(
        "unhandledrejection",
        isErr ? reason.message : String(reason),
        undefined,
        undefined,
        undefined,
        isErr && reason.stack ? String(reason.stack) : undefined
      ));
    } catch (e) {
      /* same discipline as the error listener above */
    }
  });

  window.addEventListener("message", handleMessage);

  drainEarlyFrameErrors();

  installFetchObserver();

  observeSpaRoutes();

  window.addEventListener("load", function () {
    reportGeometry();
    reportRoute(currentRoute());
  });

  window.addEventListener("resize", reportGeometry);
  window.addEventListener("scroll", reportGeometry, { passive: true });
})();
