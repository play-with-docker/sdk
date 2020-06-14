import Terminal from 'xterm'
import fit from 'xterm/lib/addons/fit/fit.js'
import ReconnectingWebSocket from 'reconnecting-websocket'
import 'xterm/dist/xterm.css'
import EventEmitter from 'wolfy87-eventemitter'

(function (window) {

  'use strict';


  // Private functions

  function injectScript(src, cb) {
    var sj = document.createElement('script');
    sj.type = 'text/javascript';
    sj.async = true;
    sj.src = src;
    sj.addEventListener ? sj.addEventListener('load', cb, false) : sj.attachEvent('onload', cb);
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(sj, s);
  }


  // Process recaptcha input and inits SDK
  var verifyCallback = function(response) {
    var self = this;
    var data = encodeURIComponent('g-recaptcha-response') + '=' + encodeURIComponent(response);
    data += '&' + encodeURIComponent('session-duration') + '=' + encodeURIComponent('60m');
  };

  // register Recaptcha global onload callback
  window.onloadCallback = function() {
    //Register captcha only on the first term to avoid showing multiple times
    verifyCallback.call(window.pwd);
  }

  function registerInputHandlers(termName, instance) {
    var self = this;
    // Attach block actions
    var actions = document.querySelectorAll('code[class*="'+termName+'"]');
    for (var n=0; n < actions.length; ++n) {
      actions[n].onclick = function() {
	self.socket.emit('instance terminal in', instance.name, this.innerText);
        /* Prompt support
	var lines = this.innerText.split("\n");
        for (var i = 0; i < lines.length; i ++) {
          var line = lines[i];
          // if line starts with
          if (line.startsWith("$")) {
            self.socket.emit('instance terminal in', instance.name, line.replace('$','')+'\n');
          }
        }
	*/
      };
    }
  }

  function registerPortHandlers(termName, instance) {
    var self = this;
    // Attach block actions
    var actions = document.querySelectorAll('[data-term*="'+termName+'"]');
    for (var n=0; n < actions.length; ++n) {
      var anchor = actions[n];
      var port = anchor.getAttribute("data-port");
      var protocol = anchor.getAttribute("data-protocol") || 'http:';
      var hostPrefix = anchor.getAttribute("data-host-prefix") || '';
      var link;
      if (port) {
        link = protocol + '//'+ hostPrefix + instance.proxy_host + '-' + port + '.direct.' + self.opts.baseUrl.split('/')[2] + anchor.attributes.href.value;
      }
      var openFn = function(link) {
        return function(evt) {
          evt.preventDefault();
          if (link) {
            window.open(link, '_blank');
          }
        };
      }
      anchor.onclick = openFn(link);
      anchor.onauxclick = openFn(link);
      anchor.oncontextmenu = function(evt) {
        if (link) {
          this.setAttribute("href", link);
        }
      };
    }
  }


  // PWD instance
  var pwd = function () {
    this.instances = {};
    this.instanceBuffer = {};
    return;
  };


  pwd.prototype = Object.create(EventEmitter.prototype)
  pwd.prototype.constructor = pwd;


  function setOpts(opts) {
    var opts = opts || {};
    this.opts = opts;
    this.opts.baseUrl = this.opts.baseUrl || 'https://labs.play-with-docker.com';
    this.opts.ports = this.opts.ports || [];
    this.opts.ImageName = this.opts.ImageName || '';
    this.opts.oauthProvider = this.opts.oauthProvider || 'docker';
  }

  pwd.prototype.login = function(cb) {
    var self = this;
    var width = screen.width*0.6;
    var height = screen.height*0.6;
    var x = screen.width/2 - width/2;
    var y = screen.height/2 - height/2;

    // display login btn in 1st terminal only
    var term = window.pwd.terms[0];
    var els = document.querySelectorAll(term.selector);
    var loginBtn = document.createElement("input");
    loginBtn.type = 'button';
    loginBtn.value = 'Log-in to access';
    loginBtn.className = 'btn btn-lg btn-primary'
    loginBtn.onclick = function() {
      window.open(self.opts.baseUrl + '/oauth/providers/' + self.opts.oauthProvider + '/login', 'PWDLogin', 'width='+width+',height='+height+',left='+x+',top='+y);
      var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
      var eventer = window[eventMethod];
      var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
      // Listen to message from child window
      eventer(messageEvent,function(e) {
        if (e.data === 'done') {
          els[0].removeChild(loginBtn);
          cb();
        }
      }, false);
    };
    els[0].appendChild(loginBtn);
  }

  pwd.prototype.createSession = function(cb) {
    var self = this;
    sendRequest({
      method: 'POST',
      url: this.opts.baseUrl + '/',
      opts: {headers:{'Content-type':'application/x-www-form-urlencoded'}},
      data: encodeURIComponent('session-duration') + '=' + encodeURIComponent('90m')
    }, function(resp) {
      //TODO handle errors
      if (resp.status == 200) {
        self.emitEvent('init')
        var sessionData = JSON.parse(resp.responseText);
        // fetch current scheme from opts to use in the new session hostname
        self.opts.baseUrl = self.opts.baseUrl.split('/')[0] + '//' + sessionData.hostname;
        self.init(sessionData.session_id, self.opts, function() {
          self.terms.forEach(function(term) {

            // Create terminals only for those elements that exist at least once in the DOM
            if (document.querySelector(term.selector)) {
              self.terminal(term);
            }
          });
          cb();
        });
      } else if (resp.status == 403) {
        //TODO login should return error and handle it
        self.login(function() {
          self.createSession(cb)
        });
      };
    });
  }

  pwd.prototype.closeSession = function(callback) {
    if (this.sessionId) {
      sendRequest({
        method: 'DELETE',
        url: this.opts.baseUrl + '/sessions/' + this.sessionId,
        opts: {headers:{'Content-type':'application/json'}},
        sync: true
      }, function(response) {
        if (response.status == 200) {
          callback();
        } else {
          callback(new Error("Error deleting session"));
        }
      });
    }
  }

  pwd.prototype.getUserInfo = function(callback) {
    sendRequest({
      method: 'GET',
      url: this.opts.baseUrl + '/users/me',
      opts: {headers:{'Content-type':'application/json'}}
    }, function(response) {
      if (response.status == 200) {
        var u = JSON.parse(response.responseText);
        callback(u);
      } else {
        callback(undefined);
      }
    });
  }

  pwd.prototype.newSession = function(terms, opts, callback) {
    var self = this;
    setOpts.call(this, opts);
    terms = terms || [];
    if (terms.length > 0) {
      this.terms = terms;
      this.createSession(function(err) {
          if (err) {
            console.warn('Could not create session');
          }
          !callback || callback();
      });
    } else {
      console.warn('No terms specified, nothing to do.');
    }
  };

  // your sdk init function
  pwd.prototype.init = function (sessionId, opts, callback) {
    var self = this;
    setOpts.call(this, opts);
    this.sessionId = sessionId;
    var l = document.createElement("a");
    l.href = this.opts.baseUrl;
		this.socket = new ReconnectingWebSocket((l.protocol === 'http:' ? 'ws://' : 'wss://') + l.host + '/sessions/' + sessionId + '/ws/' );
		this.socket.listeners = {};

		this.socket.on = function(name, cb) {
			if (!self.socket.listeners[name]) {
				self.socket.listeners[name] = [];
			}
			self.socket.listeners[name].push(cb);
		}
	  this.socket.emit = function() {
			var name = arguments[0]
			var args = [];
			for (var i = 1; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
			self.socket.send(JSON.stringify({name: name, args: args}));
		}

		this.socket.addEventListener('message', function (event) {
			var m = JSON.parse(event.data);
			var ls = self.socket.listeners[m.name];
			if (ls) {
				for (var i=0; i<ls.length; i++) {
					var l = ls[i];
					l.apply(l, m.args);
				}
			}
		});

    this.socket.on('instance terminal out', function(name ,data) {
      var instance = self.instances[name];
      if (instance && instance.terms) {
        instance.terms.forEach(function(term) {term.write(data)});
      } else {
        //Buffer the data if term is not ready
        if (self.instanceBuffer[name] == undefined) self.instanceBuffer[name] = '';
        self.instanceBuffer[name] += data;
      }
    });

    // Resize all terminals
    this.socket.on('instance viewport resize', function(cols, rows) {
      // Resize all terminals
      for (var name in self.instances) {
        self.instances[name].terms.forEach(function(term){
          term.resize(cols,rows);
        });
      };
    });

    // Handle window resizing
    window.onresize = function() {
      self.resize();
    };

    sendRequest({
      method: 'GET',
      url: this.opts.baseUrl + '/sessions/' + sessionId,
    }, function(response) {
      var session = JSON.parse(response.responseText);
      for (var name in session.instances) {
        var i = session.instances[name];
        // Setup empty terms
        i.terms = [];
        self.instances[name] = i;
      }
      !callback || callback();
    });
  };


  pwd.prototype.resize = function() {
    var name = Object.keys(this.instances)[0]
    for (var n in this.instances) {
      // there might be some instances without terminals
      if (this.instances[n].terms) {
        for (var i = 0; i < this.instances[n].terms.length; i ++) {
          var term = this.instances[n].terms[i];
          var size = term.proposeGeometry();
          if (size.cols && size.rows) {
            return this.socket.emit('instance viewport resize', size.cols, size.rows);
          }
        }
      }
    }
  };


  // I know, opts and data can be ommited. I'm not a JS developer =(
  // Data needs to be sent encoded appropriately
  function sendRequest(req, callback) {
    var request = new XMLHttpRequest();
    var asyncReq = !req.sync
    request.open(req.method, req.url, asyncReq);

    if (req.opts && req.opts.headers) {
      for (var key in req.opts.headers) {
        request.setRequestHeader(key, req.opts.headers[key]);
      }
    }
    request.withCredentials = true;
    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    request.onload = function() {
      callback(request);
    };
    if (typeof(req.data) === 'object' && req.data.constructor.name != 'FormData') {
      request.send(JSON.stringify(req.data));
    } else {
      request.send(req.data);
    }
  };

  pwd.prototype.createInstance = function(opts, callback) {
    var self = this;
    opts.ImageName = opts.ImageName || self.opts.ImageName;
    //TODO handle http connection errors
    sendRequest({
      method: 'POST',
      url: self.opts.baseUrl + '/sessions/' + this.sessionId + '/instances',
      opts: {headers:{'Content-type':'application/json'}},
      data: opts
    }, function(response) {
      if (response.status == 200) {
        var i = JSON.parse(response.responseText);
        i.terms = [];
        self.instances[i.name] = i;
        callback(undefined, i);
      } else if (response.status == 409) {
        var err = new Error();
        err.max = true;
        callback(err);
      } else {
        callback(new Error());
      }
    });
  }

  pwd.prototype.upload = function(name, data, callback) {
    var self = this;
    sendRequest({
      method: 'POST',
      url: self.opts.baseUrl + '/sessions/' + this.sessionId + '/instances/' + name + '/uploads',
      opts: {},
      data: data
    }, function(response) {
      if (response.status == 200) {
        if (callback) {
            callback(undefined);
        }
      } else {
        if (callback) {
            callback(new Error());
        }
      }
    });
  }


  pwd.prototype.setup = function(data, callback) {
    var self = this;
    sendRequest({
      method: 'POST',
      url: self.opts.baseUrl + '/sessions/' + this.sessionId + '/setup',
      opts: {headers:{'Content-type':'application/json'}},
      data: data
    }, function(response) {
      if (response.status == 200) {
        if (callback) {
            callback(undefined);
        }
      } else {
        if (callback) {
            callback(new Error());
        }
      }
    });
  }

  pwd.prototype.exec = function(name, data, callback) {
    var self = this;
    sendRequest({
      method: 'POST',
      url: self.opts.baseUrl + '/sessions/' + this.sessionId + '/instances/' + name + '/exec',
      opts: {headers:{'Content-type':'application/json'}},
      data: {command: data}
    }, function(response) {
      if (response.status == 200) {
        if (callback) {
            callback(undefined);
        }
      } else {
        if (callback) {
            callback(new Error());
        }
      }
    });
  }

  pwd.prototype.createTerminal = function(term, name) {
    var self = this;
    var i = this.instances[name];
    term.name = term.name || term.selector;

    var elements = document.querySelectorAll(term.selector);
    for (var n=0; n < elements.length; ++n) {
      var t = new Terminal({cursorBlink: false});
      t.open(elements[n], {focus: true});
      t.on('data', function(d) {
        self.socket.emit('instance terminal in', i.name, d);
      });

      if (!i.terms) {
        i.terms = [];
      }
      i.terms.push(t);
      self.resize();
    }


    registerPortHandlers.call(self, term.selector, i)

    registerInputHandlers.call(self, term.selector, i);

    if (self.instanceBuffer[name]) {
      //Flush buffer and clear it
      i.terms.forEach(function(term){
        term.write(self.instanceBuffer[name]);
      });
      self.instanceBuffer[name] = '';
    }

    return i.terms;
  }

  pwd.prototype.terminal = function(term, callback) {
    var self = this;
    var hostname = "node" + (this.terms.indexOf(term) + 1);
    this.createInstance({type: term.type, Hostname: hostname}, function(err, instance) {
      if (err && err.max) {
        !callback || callback(new Error("Max instances reached"))
        return
      } else if (err) {
        !callback || callback(new Error("Error creating instance"))
        return
      }

      self.createTerminal(term, instance.name);


      !callback || callback(undefined, instance);

    });
  }



  // define your namespace myApp
  window.pwd = new pwd();

})(window, undefined);
