// Generated by IcedCoffeeScript 108.0.9
(function() {
  var Proxy, ProxyManager, connect, http, httpProxy, https, iced, log, logger, _, __iced_k, __iced_k_noop,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  iced = {
    Deferrals: (function() {
      function _Class(_arg) {
        this.continuation = _arg;
        this.count = 1;
        this.ret = null;
      }

      _Class.prototype._fulfill = function() {
        if (!--this.count) {
          return this.continuation(this.ret);
        }
      };

      _Class.prototype.defer = function(defer_params) {
        ++this.count;
        return (function(_this) {
          return function() {
            var inner_params, _ref;
            inner_params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            if (defer_params != null) {
              if ((_ref = defer_params.assign_fn) != null) {
                _ref.apply(null, inner_params);
              }
            }
            return _this._fulfill();
          };
        })(this);
      };

      return _Class;

    })(),
    findDeferral: function() {
      return null;
    },
    trampoline: function(_fn) {
      return _fn();
    }
  };
  __iced_k = __iced_k_noop = function() {};

  log = function() {
    var x;
    x = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    try {
      return console.log.apply(console, x);
    } catch (_error) {}
  };

  logger = require('./logger');

  _ = require('wegweg')({
    globals: false,
    shelljs: false
  });

  http = require('http');

  connect = require('connect');

  httpProxy = require('http-proxy');

  Proxy = require('./proxy');

  https = require('https');

  module.exports = ProxyManager = (function(_super) {
    __extends(ProxyManager, _super);

    ProxyManager.prototype.hosts = {};

    ProxyManager.prototype.servers = {};

    function ProxyManager(opt) {
      var _base, _base1, _base2, _base3, _ref;
      this.opt = opt != null ? opt : {};
      this.hosts = (_ref = this.opt.hosts) != null ? _ref : {};
      if ((_base = this.opt).middleware == null) {
        _base.middleware = [];
      }
      if ((_base1 = this.opt).globals == null) {
        _base1.globals = true;
      }
      if ((_base2 = this.opt).ascii == null) {
        _base2.ascii = true;
      }
      if (this.opt.globals) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
        require('http').globalAgent.maxSockets = 99999;
        require('https').globalAgent.maxSockets = 99999;
        this.setMaxListeners(9999);
        process.on('uncaughtException', (function(_this) {
          return function(e) {
            var ignore, x, _i, _len;
            _this.emit('error', e);
            ignore = ['ECONNRESET', 'hang up'];
            for (_i = 0, _len = ignore.length; _i < _len; _i++) {
              x = ignore[_i];
              if (e.toString().includes(x)) {
                return false;
              }
            }
            return logger.error(e);
          };
        })(this));
      }
      if ((_base3 = this.opt).silent == null) {
        _base3.silent = false;
      }
      if (!this.opt.silent) {
        this.setup_loggers();
      }
    }

    ProxyManager.prototype.setup_loggers = function() {
      var request_events, spawn_events, x, _fn, _i, _j, _len, _len1, _results;
      this.on('error', function(e) {
        return logger.error(e);
      });
      request_events = ['request', 'request_ignored', 'request_delivered'];
      _fn = (function(_this) {
        return function(x) {
          return _this.on(x, function(req) {
            var verb;
            verb = 'info';
            if (x === 'request_ignored') {
              verb = 'warn';
            }
            return logger[verb](x, {
              url: req.url,
              method: req.method,
              proxy_host: req.proxy_host
            });
          });
        };
      })(this);
      for (_i = 0, _len = request_events.length; _i < _len; _i++) {
        x = request_events[_i];
        _fn(x);
      }
      spawn_events = ['proxy_manager_listening', 'proxy_spawned'];
      _results = [];
      for (_j = 0, _len1 = spawn_events.length; _j < _len1; _j++) {
        x = spawn_events[_j];
        _results.push((function(_this) {
          return function(x) {
            return _this.on(x, function(data) {
              return logger.info(x, data);
            });
          };
        })(this)(x));
      }
      return _results;
    };

    ProxyManager.prototype.setup = function(cb) {
      var app, host, host_item, x, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      (function(_this) {
        return (function(__iced_k) {
          if (_.size(_this.hosts)) {
            (function(__iced_k) {
              var _i, _k, _keys, _ref, _results, _while;
              _ref = _this.hosts;
              _keys = (function() {
                var _results1;
                _results1 = [];
                for (_k in _ref) {
                  _results1.push(_k);
                }
                return _results1;
              })();
              _i = 0;
              _while = function(__iced_k) {
                var _break, _continue, _next;
                _break = __iced_k;
                _continue = function() {
                  return iced.trampoline(function() {
                    ++_i;
                    return _while(__iced_k);
                  });
                };
                _next = _continue;
                if (!(_i < _keys.length)) {
                  return _break();
                } else {
                  host = _keys[_i];
                  host_item = _ref[host];
                  (function(__iced_k) {
                    __iced_deferrals = new iced.Deferrals(__iced_k, {
                      parent: ___iced_passed_deferral,
                      filename: "/Users/nick/Desktop/mirror-mirror/src/lib/proxy_manager.iced",
                      funcname: "ProxyManager.setup"
                    });
                    _this.setup_proxy(host, host_item, __iced_deferrals.defer({
                      lineno: 85
                    }));
                    __iced_deferrals._fulfill();
                  })(_next);
                }
              };
              _while(__iced_k);
            })(__iced_k);
          } else {
            return __iced_k();
          }
        });
      })(this)((function(_this) {
        return function() {
          var _i, _len, _ref, _ref1;
          _this.http_proxy = httpProxy.createProxyServer({
            ws: true,
            xfwd: true,
            autoRewrite: true,
            hostRewrite: true,
            protocolRewrite: 'http'
          });
          _this.http_proxy.on('error', function(e) {
            return _this.emit('error', e);
          });
          app = connect();
          if ((_ref = _this.opt.middleware) != null ? _ref.length : void 0) {
            _ref1 = _this.opt.middleware;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              x = _ref1[_i];
              app.use(x);
            }
          }
          app.use((function(req, res, next) {
            var host, host_item, request_opts, ___iced_passed_deferral1, __iced_deferrals, __iced_k, _ref2, _ref3, _ref4, _ref5;
            __iced_k = __iced_k_noop;
            ___iced_passed_deferral1 = iced.findDeferral(arguments);
            host = (_ref2 = (_ref3 = (_ref4 = req.hostname) != null ? _ref4 : (_ref5 = req.headers) != null ? _ref5.host : void 0) != null ? _ref3 : req.host) != null ? _ref2 : false;
            if (!host) {
              return next(new Error('`host` unparsable'));
            }
            if (host.includes(':')) {
              host = host.split(':').shift();
            }
            req.proxy_host = host;
            _this.emit('request', req);
            if (!(host_item = _this.hosts[host])) {
              _this.emit('request_ignored', req);
              req._code = 403;
              return next(new Error('Forbidden'));
            }
            (function(__iced_k) {
              if (!_this.servers[host]) {
                (function(__iced_k) {
                  __iced_deferrals = new iced.Deferrals(__iced_k, {
                    parent: ___iced_passed_deferral1,
                    filename: "/Users/nick/Desktop/mirror-mirror/src/lib/proxy_manager.iced"
                  });
                  _this.setup_proxy(host, host_item, __iced_deferrals.defer({
                    lineno: 122
                  }));
                  __iced_deferrals._fulfill();
                })(__iced_k);
              } else {
                return __iced_k();
              }
            })(function() {
              request_opts = {
                target: 'http://127.0.0.1:' + _this.servers[host].port
              };
              _this.emit('request_delivered', req);
              return _this.http_proxy.web(req, res, request_opts, function(e) {
                return next(e);
              });
            });
          }));
          app.use(function(err, req, res) {
            var _ref2;
            _this.emit('error', err);
            return res.end(err.toString(), (_ref2 = req._code) != null ? _ref2 : 500);
          });
          _this.http = http.createServer(app);
          return cb(null, true);
        };
      })(this));
    };

    ProxyManager.prototype.setup_proxy = function(host, opt, cb) {
      var p, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      if (opt.silent == null) {
        opt.silent = true;
      }
      this.servers[host] = p = new Proxy(opt);
      (function(_this) {
        return (function(__iced_k) {
          __iced_deferrals = new iced.Deferrals(__iced_k, {
            parent: ___iced_passed_deferral,
            filename: "/Users/nick/Desktop/mirror-mirror/src/lib/proxy_manager.iced",
            funcname: "ProxyManager.setup_proxy"
          });
          p.setup(__iced_deferrals.defer({
            lineno: 146
          }));
          __iced_deferrals._fulfill();
        });
      })(this)((function(_this) {
        return function() {
          p.listen();
          p.on('error', function(e) {
            return _this.emit('error', e);
          });
          _this.emit('child_spawned', {
            host: host,
            port: p.port,
            options: opt
          });
          return cb(null, p.port);
        };
      })(this));
    };

    ProxyManager.prototype.listen = function(port) {
      var _base;
      if ((_base = this.opt).port == null) {
        _base.port = port != null ? port : 7777;
      }
      this.http.listen(this.opt.port);
      return this.emit('proxy_manager_listening', this.opt);
    };

    return ProxyManager;

  })((require('events').EventEmitter));


  /*
  if !module.parent
    proxy_man = new ProxyManager({
  
       * middleware at the proxy manager level
      middleware: [((req,res,next) ->
        console.log "ProxyManager request: #{req.method} #{req.url}"
        next()
      )]
  
      hosts: {
  
         * local host to serve from
        'localhost': {
  
           * remote host to mirror
          host: 'stackoverflow.com'
  
           * middleware at the proxy instance level
          middleware: [((req,res,next) ->
            console.log "ProxyInstance request: #{req.method} #{req.url}"
            next()
          )]
  
           * synchronous source modifiers for text/html
          html_modifiers: [
            ((x) -> return x.replace('<title>','<title>(mirror-mirror) '))
          ]
  
           * html blob to append before `</head>` tags
          append_head: """
            <script>console.log('mirror-stackoverflow')</script>
          """
        }
  
        'proxy.com': {
          host: 'greatist.com'
          html_modifiers: [
            ((x) -> return x.replace('<title>','<title>(mirror-mirror) '))
          ]
          append_head: """
            <script>console.log('mirror-greatist.com')</script>
          """
        }
  
      }
    })
  
    await proxy_man.setup defer()
  
    proxy_man.listen 7777
    console.log ":7777"
   */

}).call(this);
