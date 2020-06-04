window.__require = function t(e, o, r) {
function n(c, i) {
if (!o[c]) {
if (!e[c]) {
var s = c.split("/");
s = s[s.length - 1];
if (!e[s]) {
var p = "function" == typeof __require && __require;
if (!i && p) return p(s, !0);
if (a) return a(s, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = s;
}
var u = o[c] = {
exports: {}
};
e[c][0].call(u.exports, function(t) {
return n(e[c][1][t] || t);
}, u, u.exports, t, e, o, r);
}
return o[c].exports;
}
for (var a = "function" == typeof __require && __require, c = 0; c < r.length; c++) n(r[c]);
return n;
}({
Http: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "42dd0NNJk5PrJXR3K0gMGJM", "Http");
Object.defineProperty(o, "__esModule", {
value: !0
});
var r = function() {
function t() {}
t.get = function(t, e) {
var o = cc.loader.getXMLHttpRequest();
o.onreadystatechange = function() {
if (4 === o.readyState && o.status >= 200 && o.status < 300) {
var t = o.responseText;
e(t);
}
};
o.open("GET", t, !0);
cc.sys.isNative && o.setRequestHeader("Accept-Encoding", "gzip,deflate");
o.timeout = 5e3;
o.send();
};
t.post = function(t, e, o) {
var r = cc.loader.getXMLHttpRequest();
r.onreadystatechange = function() {
cc.log("postRequest.readyState=" + r.readyState + "  postRequest.status=" + r.status);
if (4 === r.readyState && r.status >= 200 && r.status < 300) {
var t = r.responseText;
o(t);
} else o(-1);
};
r.open("POST", t, !0);
if (cc.sys.isNative) {
r.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
}
r.timeout = 2e4;
r.send(e);
};
return t;
}();
o.Http = r;
cc._RF.pop();
}, {} ],
Test: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "ad1f6mEiEZDUYlpnuQIt2VM", "Test");
var r = this && this.__extends || function() {
var t = function(e, o) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) e.hasOwnProperty(o) && (t[o] = e[o]);
})(e, o);
};
return function(e, o) {
t(e, o);
function r() {
this.constructor = e;
}
e.prototype = null === o ? Object.create(o) : (r.prototype = o.prototype, new r());
};
}(), n = this && this.__decorate || function(t, e, o, r) {
var n, a = arguments.length, c = a < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, o, r); else for (var i = t.length - 1; i >= 0; i--) (n = t[i]) && (c = (a < 3 ? n(c) : a > 3 ? n(e, o, c) : n(e, o)) || c);
return a > 3 && c && Object.defineProperty(e, o, c), c;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = t("./Http"), c = cc._decorator, i = c.ccclass, s = c.property, p = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.photo = null;
e.photo2 = null;
return e;
}
e.prototype.start = function() {
var t = this, e = jsb.fileUtils.getWritablePath();
cc.game.on("PhotoPath", function(o) {
console.log("path:", e + o + ".jpg");
cc.loader.release(e + o + ".jpg");
cc.loader.load(e + o + ".jpg", function(e, o) {
if (e) console.error("error", e.message || e); else {
console.log("aaaaaaaaaaaaaaaaa:", o instanceof cc.Texture2D);
var r = new cc.SpriteFrame();
r.setTexture(o);
console.log("width", o.width, "height", o.height);
t.photo.spriteFrame = r;
}
});
var r = jsb.fileUtils.getDataFromFile(e + "/" + o + ".jpg");
a.Http.post("http://192.168.124.13:8800/image?name=1.jpg", r, function(t) {
console.log(t);
});
});
};
e.prototype.openPhotoAlbum = function() {
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onOpenAlbum", "(I)V", 1);
};
e.prototype.onLoadPhoto = function() {
var t = this;
cc.loader.release("http://192.168.124.13:8800/download?name=1.jpg");
cc.loader.load("http://192.168.124.13:8800/download?name=1.jpg", function(e, o) {
if (e) console.error("error", e.message || e); else {
console.log("aaaaaaaaaaaaaaaaa:", o instanceof cc.Texture2D);
var r = new cc.SpriteFrame();
r.setTexture(o);
console.log("width", o.width, "height", o.height);
t.photo2.spriteFrame = r;
}
});
};
n([ s(cc.Sprite) ], e.prototype, "photo", void 0);
n([ s(cc.Sprite) ], e.prototype, "photo2", void 0);
return e = n([ i ], e);
}(cc.Component);
o.default = p;
cc._RF.pop();
}, {
"./Http": "Http"
} ]
}, {}, [ "Http", "Test" ]);