'use strict';

/**
 * Request logging middleware: logs method, path, final status code, and
 * response duration in milliseconds.
 *
 * The key detail is that status and duration can only be known once the
 * response has actually finished sending, so this hooks into res's 'finish'
 * event rather than logging immediately after next() (which only hands off
 * control — it returns long before any downstream handler has responded).
 */
function requestLogger({ logFn = console.log } = {}) {
  return function (req, res, next) {
    const startedAt = process.hrtime.bigint();
    let logged = false;

    const logOnce = (statusOverride) => {
      if (logged) return;
      logged = true;
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
      const path = req.originalUrl || req.url;
      const status = statusOverride ?? res.statusCode;
      logFn(`${req.method} ${path} ${status} ${durationMs.toFixed(1)}ms`);
    };

    res.on('finish', () => logOnce());
    // If the client disconnects before the response finishes, 'finish' never
    // fires — 'close' does. We still want exactly one log line per request.
    res.on('close', () => logOnce(res.statusCode || 'ABORTED'));

    next();
  };
}

module.exports = { requestLogger };
