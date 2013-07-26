var connectLeg = module.exports = function connectLeg(log) {
  return function connectLeg(req, res, next) {
    req._leg_requestId = [Date.now(), crypto.randomBytes(4).toString("hex")].join("-");
    req._leg_requestTime = Date.now();

    log.info("http request", {
      request: req._leg_requestId,
      method: req.method,
      host: req.host,
      path: req.url,
    });

    var _end = res.end;
    res.end = function() {
      var level;

      if (res.statusCode >= 400 && res.statusCode <= 499) {
        level = "warn";
      } else if (res.statusCode >= 500) {
        level = "error";
      } else {
        level = "info";
      }

      log[level]("response", {
        request: req._leg_requestId,
        method: req.method,
        host: req.host,
        path: req.url,
        status: res.statusCode,
        took: Date.now() - req._leg_requestTime,
      });

      return _end.apply(res, arguments);
    };

    return next();
  };
};
