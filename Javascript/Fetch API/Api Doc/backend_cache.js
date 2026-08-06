const NodeCache = require('node-cache');
const cache = new NodeCache();

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      res.send(cachedResponse);
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        cache.set(key, body, duration);
        res.sendResponse(body);
      };
      next();
    }
  };
};

module.exports = { cacheMiddleware };

