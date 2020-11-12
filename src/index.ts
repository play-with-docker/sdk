import xterm from "xterm";
import { FitAddon } from "xterm-addon-fit";
import ReconnectingWebSocket from "reconnecting-websocket";
import "xterm/css/xterm.css";
import EventEmitter from "wolfy87-eventemitter";
import {
  verifyCallback,
  registerInputHandlers,
  registerPortHandlers,
  sendRequest,
} from "./utils";

const Terminal = xterm.Terminal;

class PWD extends EventEmitter {
  instances = {};
  instanceBuffer = {};
  sessionId = null;
  // TODO: Define opts as a type
  opts: any = {};
  socket = null;
  terms = [];
  setOpts(opts) {
    var opts = opts || {};
    this.opts = opts;
    this.opts.baseUrl =
      this.opts.baseUrl || "https://labs.play-with-docker.com";
    this.opts.ports = this.opts.ports || [];
    this.opts.ImageName = this.opts.ImageName || "";
    this.opts.Envs = this.opts.Envs || [];
    this.opts.Networks = this.opts.Networks || [];
    this.opts.oauthProvider = this.opts.oauthProvider || "docker";
  }
  login(cb) {
    var self = this;
    var width = screen.width * 0.6;
    var height = screen.height * 0.6;
    var x = screen.width / 2 - width / 2;
    var y = screen.height / 2 - height / 2;

    // display login btn in 1st terminal only
    var term = (window as any).pwd.terms[0];
    var els = document.querySelectorAll(term.selector);
    var loginBtn = document.createElement("input");
    loginBtn.type = "button";
    loginBtn.value = "Log-in to access";
    loginBtn.className = "btn btn-lg btn-primary";
    loginBtn.onclick = function () {
      window.open(
        self.opts.baseUrl +
          "/oauth/providers/" +
          self.opts.oauthProvider +
          "/login",
        "PWDLogin",
        "width=" + width + ",height=" + height + ",left=" + x + ",top=" + y
      );
      var eventMethod = window.addEventListener
        ? "addEventListener"
        : "attachEvent";
      var eventer = window[eventMethod];
      var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
      // Listen to message from child window
      eventer(
        messageEvent,
        function (e) {
          if (e.data === "done") {
            els[0].removeChild(loginBtn);
            cb();
          }
        },
        false
      );
    };
    els[0].appendChild(loginBtn);
  }
  createSession(cb) {
    sendRequest(
      {
        method: "POST",
        url: this.opts.baseUrl + "/",
        opts: {
          headers: { "Content-type": "application/x-www-form-urlencoded" },
        },
        data:
          encodeURIComponent("session-duration") +
          "=" +
          encodeURIComponent("90m"),
      },
      (err, resp) => {
        if (err) {
          cb(err);
          return
        }
        //TODO handle errors
        if (resp.status == 200) {
          this.emitEvent("init");
          var sessionData = JSON.parse(resp.responseText);
          // fetch current scheme from opts to use in the new session hostname
          this.opts.baseUrl =
          this.opts.baseUrl.split("/")[0] + "//" + sessionData.hostname;
          this.init(sessionData.session_id, this.opts, () => {
            this.terms.forEach((term) => {
              // Create terminals only for those elements that exist at least once in the DOM
              if (document.querySelector(term.selector)) {
                this.terminal(term);
              }
            });
            cb();
          });
        } else if (resp.status == 403) {
          this.emitEvent('unauthorized');
          //TODO login should return error and handle it
          this.login(function () {
            this.createSession(cb);
          });
        }
      }
    );
  }
  newSession(terms, opts, callback) {
    this.setOpts(opts);
    terms = terms || [];
    if (terms.length > 0) {
      this.terms = terms;
      this.createSession(function (err) {
        if (err) {
          console.warn("Could not create session", err);
          !callback || callback(err);
          return
        }
        !callback || callback();
      });
    } else {
      console.warn("No terms specified, nothing to do.");
    }
  }
  closeSession(callback) {
    if (this.sessionId) {
      sendRequest(
        {
          method: "DELETE",
          url: this.opts.baseUrl + "/sessions/" + this.sessionId,
          opts: { headers: { "Content-type": "application/json" } },
          sync: true,
        },
        function (err, response) {
          if (err) {
            callback(err);
            return
          }
          if (response.status == 200) {
            callback();
          } else {
            callback(new Error("Error deleting session"));
          }
        }
      );
    }
  }
  getUserInfo(callback) {
    sendRequest(
      {
        method: "GET",
        url: this.opts.baseUrl + "/users/me",
        opts: { headers: { "Content-type": "application/json" } },
      },
      function (err,response) {
        if (err) {
          callback(err);
          return
        }
        if (response.status == 200) {
          var u = JSON.parse(response.responseText);
          callback(u);
        } else {
          callback(undefined);
        }
      }
    );
  }
  init(sessionId, opts, callback) {
    var self = this;
    this.setOpts(opts);
    this.sessionId = sessionId;
    var l = document.createElement("a");
    l.href = this.opts.baseUrl;
    this.socket = new ReconnectingWebSocket(
      (l.protocol === "http:" ? "ws://" : "wss://") +
        l.host +
        "/sessions/" +
        sessionId +
        "/ws/"
    );
    this.socket.listeners = {};

    this.socket.on = function (name, cb) {
      if (!self.socket.listeners[name]) {
        self.socket.listeners[name] = [];
      }
      self.socket.listeners[name].push(cb);
    };
    this.socket.emit = function () {
      var name = arguments[0];
      var args = [];
      for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
      }
      self.socket.send(JSON.stringify({ name: name, args: args }));
    };

    this.socket.addEventListener("message", function (event) {
      var m = JSON.parse(event.data);
      var ls = self.socket.listeners[m.name];
      if (ls) {
        for (var i = 0; i < ls.length; i++) {
          var l = ls[i];
          l.apply(l, m.args);
        }
      }
    });
    
    this.socket.on("instance new", function(name: string) {
       // New instance has been created
       self.emitEvent("instanceNew", [name]);
    });

    this.socket.on("instance terminal out", function (name: string, data) {
      var instance = self.instances[name];
      if (instance && instance.terms) {
        instance.terms.forEach(function (term) {
          term.write(data);
        });
      } else {
        //Buffer the data if term is not ready
        if (self.instanceBuffer[name] == undefined)
          self.instanceBuffer[name] = "";
        self.instanceBuffer[name] += data;
      }
    });

    // Resize all terminals
    this.socket.on("instance viewport resize", function (cols, rows) {
      // Resize all terminals
      for (var name in self.instances) {
        self.instances[name].terms.forEach(function (term) {
          term.resize(cols, rows);
        });
      }
    });

    window.onresize = function () {
      self.resize();
    };

    sendRequest(
      {
        method: "GET",
        url: this.opts.baseUrl + "/sessions/" + sessionId,
      },
      function (err, response) {
        if (err) {
          callback(err);
          return
        }
        var session = JSON.parse(response.responseText);
        for (var name in session.instances) {
          var i = session.instances[name];
          // Setup empty terms
          i.terms = [];
          self.instances[name] = i;
        }
        !callback || callback();
      }
    );
  }
  resize() {
    const instances = this.getInstances();
    instances.forEach((i) => {
      i.terms.forEach((t) => {
        setTimeout(() => {
          const cols = t.fitAddon.proposeDimensions().cols;
          if (cols == Infinity) {
            t.resize(10, 10);
          }
          // is visible
          if (t.element.clientWidth) {
            t.fitAddon.fit();
          }
        }, 300);
      });
    });
  }
  createInstance = function (opts, callback) {
    var self = this;
    opts.ImageName = opts.ImageName || self.opts.ImageName;
    opts.Envs = opts.Envs || self.opts.Envs;
    opts.Networks = opts.Networks || self.opts.Networks;
    //TODO handle http connection errors
    sendRequest(
      {
        method: "POST",
        url: self.opts.baseUrl + "/sessions/" + this.sessionId + "/instances",
        opts: { headers: { "Content-type": "application/json" } },
        data: opts,
      },
      function (err, response) {
        if (err) {
          callback(err);
          return
        }
        if (response.status == 200) {
          var i = JSON.parse(response.responseText);
          i.terms = [];
          self.instances[i.name] = i;
          callback(undefined, i);
        } else if (response.status == 409) {
          var rerr = new Error();
          (rerr as any).max = true;
          callback(rerr);
        } else {
          callback(new Error());
        }
      }
    );
  };
  upload(name, opts, callback = (any) => {}) {
    var self = this;
    let { name:filename, data, path = "", url = "" } = opts;
    if (data && url) {
      callback(new Error(`Both data and url can't be set when uploading files`))
      return
    }
    const { baseUrl } = this.opts;
    const sessionId = this.sessionId;

    var params = new URLSearchParams({
      url,
      path,
    });

    const requestURL =
      baseUrl + "/sessions/" + sessionId + "/instances/" + name + "/uploads";

    self.emitEvent("uploadStart");
    sendRequest(
      {
        method: "POST",
        url: requestURL + "?" + params.toString(),
        data,
      },
      function (err, response) {
        if (err) {
          callback(err)
          return
        }
        let rerr = response.status == 200 ? undefined : new Error();
        self.emitEvent("uploadEnd", [rerr, path + "/" + filename , self.instances[name]]);
        callback(rerr);
      }
    );
  };
  setup(data, callback) {
    var self = this;
    sendRequest(
      {
        method: "POST",
        url: self.opts.baseUrl + "/sessions/" + this.sessionId + "/setup",
        opts: { headers: { "Content-type": "application/json" } },
        data: data,
      },
      function (err, response) {
        if (err) {
          callback(err);
          return
        }
        if (response.status == 200) {
          if (callback) {
            callback(undefined);
          }
        } else {
          if (callback) {
            callback(new Error());
          }
        }
      }
    );
  }
  exec(name, data, callback) {
    var self = this;
    sendRequest(
      {
        method: "POST",
        url:
          self.opts.baseUrl +
          "/sessions/" +
          this.sessionId +
          "/instances/" +
          name +
          "/exec",
        opts: { headers: { "Content-type": "application/json" } },
        data: { command: data },
      },
      function (err, response) {
        if (err) {
          callback(err);
          return
        }
        if (response.status == 200) {
          if (callback) {
            callback(undefined);
          }
        } else {
          if (callback) {
            callback(new Error());
          }
        }
      }
    );
  }
  getInstances() {
    return Object.keys(this.instances).map((k) => this.instances[k]);
  }
  createTerminal(term, name) {
    var self = this;
    var i = this.instances[name];
    term.name = term.name || term.selector;

    const elements = document.querySelectorAll(term.selector);
    for (var n = 0; n < elements.length; ++n) {
      var t: any = new Terminal({ cursorBlink: false });
      const fitAddon = new FitAddon();
      t.loadAddon(fitAddon);
      t.fitAddon = fitAddon;

      t.open(elements[n], { focus: true });
      t.onData((d) => {
        this.socket.emit("instance terminal in", i.name, d);
      });

      if (!i.terms) {
        i.terms = [];
      }
      i.terms.push(t);
      self.resize();
    }

    registerPortHandlers.call(self, term.selector, i);

    registerInputHandlers.call(self, term.selector, i);

    if (self.instanceBuffer[name]) {
      //Flush buffer and clear it
      i.terms.forEach(function (term) {
        term.write(self.instanceBuffer[name]);
      });
      self.instanceBuffer[name] = "";
    }

    // Emit event with instance + terms created
    self.emitEvent("instanceCreate", [i]);

    return i.terms;
  }
  terminal(term, callback?) {
    var self = this;
    var hostname = "node" + (this.terms.indexOf(term) + 1);
    this.createInstance({ type: term.type, Hostname: hostname, ImageName: term.ImageName, Envs: term.Envs, Networks: term.Networks }, function (
      err,
      instance
    ) {
      if (err && err.max) {
        !callback || callback(new Error("Max instances reached"));
        return;
      } else if (err) {
        !callback || callback(new Error("Error creating instance"));
        return;
      }

      self.createTerminal(term, instance.name);

      !callback || callback(undefined, instance);
    });
  }
}

export default PWD;
// register Recaptcha global onload callback
window.addEventListener("load", () => {
  verifyCallback.call((window as any).pwd);
});
