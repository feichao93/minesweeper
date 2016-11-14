!function(t){function e(n){if(r[n])return r[n].exports;var i=r[n]={exports:{},id:n,loaded:!1};return t[n].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var r={};return e.m=t,e.c=r,e.p="",e(0)}([function(t,e,r){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}function i(t){postMessage(JSON.stringify({type:"mine",value:Array.from(t)}))}function o(t){postMessage(JSON.stringify({type:"safe",value:Array.from(t)}))}function a(t){postMessage(JSON.stringify({type:"danger",value:Array.from(t)}))}var u=r(7),f=r(26),c=n(f);onmessage=function(t){var e=JSON.parse(t.data);if("hint"!==e.type)throw new Error("Invalid message type:"+e.type);var r=new c.default(e.state,e.ROWS,e.COLS),n=r.findExplicitMines();r.apply(n,u.MINE),i(n);var f=r.findExplicitSafes();r.apply(f,u.SAFE),o(f);var s=f,l=null;t:for(;;){if(s){var h=r.explicitIterationFromSafe(s),y=h.foundMines,p=h.foundSafes;i(y),o(p),s=null}if(l){var v=r.explicitIterationFromMine(l),d=v.foundMines,w=v.foundSafes;i(d),o(w),l=null}if(0===r.countStatus(u.SAFE)){var g=!0,m=!1,_=void 0;try{for(var b,x=r.splitUnknownParts()[Symbol.iterator]();!(g=(b=x.next()).done);g=!0){var S=b.value;S.sort(r.sortByNearbyNumbers.bind(r));var E=!0,O=!1,k=void 0;try{for(var N,L=S[Symbol.iterator]();!(E=(N=L.next()).done);E=!0){var A=N.value;if(!r.canBeResolve(A))break;a([A]);var T=r.resolve(A);if(T!==u.UNKNOWN){if(T===u.SAFE){r.apply([A],u.SAFE),o([A]),s=[A];continue t}if(T===u.MINE){r.apply([A],u.MINE),i([A]),l=[A];continue t}}}}catch(t){O=!0,k=t}finally{try{!E&&L.return&&L.return()}finally{if(O)throw k}}}}catch(t){m=!0,_=t}finally{try{!g&&x.return&&x.return()}finally{if(m)throw _}}}break}};(function(){"undefined"!=typeof __REACT_HOT_LOADER__&&(__REACT_HOT_LOADER__.register(i,"postMines","D:/minesweeper/app/ai/worker.js"),__REACT_HOT_LOADER__.register(o,"postSafes","D:/minesweeper/app/ai/worker.js"),__REACT_HOT_LOADER__.register(a,"postDangers","D:/minesweeper/app/ai/worker.js"))})()},function(t,e,r){t.exports=!r(4)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e){var r=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=r)},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e){var r=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=r)},function(t,e,r){var n=r(13),i=r(18),o=r(20),a=Object.defineProperty;e.f=r(1)?Object.defineProperty:function(t,e,r){if(n(t),e=o(e,!0),n(r),i)try{return a(t,e,r)}catch(t){}if("get"in r||"set"in r)throw TypeError("Accessors not supported!");return"value"in r&&(t[e]=r.value),t}},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=e.MINE=-1,n=e.SAFE=-2,i=e.UNKNOWN=-3;(function(){"undefined"!=typeof __REACT_HOT_LOADER__&&(__REACT_HOT_LOADER__.register(r,"MINE","D:/minesweeper/app/ai/constants.js"),__REACT_HOT_LOADER__.register(n,"SAFE","D:/minesweeper/app/ai/constants.js"),__REACT_HOT_LOADER__.register(i,"UNKNOWN","D:/minesweeper/app/ai/constants.js"))})()},function(t,e){function r(){throw new Error("setTimeout has not been defined")}function n(){throw new Error("clearTimeout has not been defined")}function i(t){if(s===setTimeout)return setTimeout(t,0);if((s===r||!s)&&setTimeout)return s=setTimeout,setTimeout(t,0);try{return s(t,0)}catch(e){try{return s.call(null,t,0)}catch(e){return s.call(this,t,0)}}}function o(t){if(l===clearTimeout)return clearTimeout(t);if((l===n||!l)&&clearTimeout)return l=clearTimeout,clearTimeout(t);try{return l(t)}catch(e){try{return l.call(null,t)}catch(e){return l.call(this,t)}}}function a(){v&&y&&(v=!1,y.length?p=y.concat(p):d=-1,p.length&&u())}function u(){if(!v){var t=i(a);v=!0;for(var e=p.length;e;){for(y=p,p=[];++d<e;)y&&y[d].run();d=-1,e=p.length}y=null,v=!1,o(t)}}function f(t,e){this.fun=t,this.array=e}function c(){}var s,l,h=t.exports={};!function(){try{s="function"==typeof setTimeout?setTimeout:r}catch(t){s=r}try{l="function"==typeof clearTimeout?clearTimeout:n}catch(t){l=n}}();var y,p=[],v=!1,d=-1;h.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)e[r-1]=arguments[r];p.push(new f(t,e)),1!==p.length||v||i(u)},f.prototype.run=function(){this.fun.apply(null,this.array)},h.title="browser",h.browser=!0,h.env={},h.argv=[],h.version="",h.versions={},h.on=c,h.addListener=c,h.once=c,h.off=c,h.removeListener=c,h.removeAllListeners=c,h.emit=c,h.binding=function(t){throw new Error("process.binding is not supported")},h.cwd=function(){return"/"},h.chdir=function(t){throw new Error("process.chdir is not supported")},h.umask=function(){return 0}},function(t,e,r){(function(e){var n="object"==typeof e?e:"object"==typeof window?window:"object"==typeof self?self:this,i=n.regeneratorRuntime&&Object.getOwnPropertyNames(n).indexOf("regeneratorRuntime")>=0,o=i&&n.regeneratorRuntime;if(n.regeneratorRuntime=void 0,t.exports=r(10),i)n.regeneratorRuntime=o;else try{delete n.regeneratorRuntime}catch(t){n.regeneratorRuntime=void 0}}).call(e,function(){return this}())},function(t,e,r){(function(e,r){!function(e){"use strict";function n(t,e,r,n){var i=e&&e.prototype instanceof o?e:o,a=Object.create(i.prototype),u=new p(n||[]);return a._invoke=l(t,r,u),a}function i(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}function o(){}function a(){}function u(){}function f(t){["next","throw","return"].forEach(function(e){t[e]=function(t){return this._invoke(e,t)}})}function c(t){this.arg=t}function s(t){function e(r,n,o,a){var u=i(t[r],t,n);if("throw"!==u.type){var f=u.arg,s=f.value;return s instanceof c?Promise.resolve(s.arg).then(function(t){e("next",t,o,a)},function(t){e("throw",t,o,a)}):Promise.resolve(s).then(function(t){f.value=t,o(f)},a)}a(u.arg)}function n(t,r){function n(){return new Promise(function(n,i){e(t,r,n,i)})}return o=o?o.then(n,n):n()}"object"==typeof r&&r.domain&&(e=r.domain.bind(e));var o;this._invoke=n}function l(t,e,r){var n=E;return function(o,a){if(n===k)throw new Error("Generator is already running");if(n===N){if("throw"===o)throw a;return d()}for(;;){var u=r.delegate;if(u){if("return"===o||"throw"===o&&u.iterator[o]===w){r.delegate=null;var f=u.iterator.return;if(f){var c=i(f,u.iterator,a);if("throw"===c.type){o="throw",a=c.arg;continue}}if("return"===o)continue}var c=i(u.iterator[o],u.iterator,a);if("throw"===c.type){r.delegate=null,o="throw",a=c.arg;continue}o="next",a=w;var s=c.arg;if(!s.done)return n=O,s;r[u.resultName]=s.value,r.next=u.nextLoc,r.delegate=null}if("next"===o)r.sent=r._sent=a;else if("throw"===o){if(n===E)throw n=N,a;r.dispatchException(a)&&(o="next",a=w)}else"return"===o&&r.abrupt("return",a);n=k;var c=i(t,e,r);if("normal"===c.type){n=r.done?N:O;var s={value:c.arg,done:r.done};if(c.arg!==L)return s;r.delegate&&"next"===o&&(a=w)}else"throw"===c.type&&(n=N,o="throw",a=c.arg)}}}function h(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function y(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function p(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(h,this),this.reset(!0)}function v(t){if(t){var e=t[_];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,n=function e(){for(;++r<t.length;)if(g.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=w,e.done=!0,e};return n.next=n}}return{next:d}}function d(){return{value:w,done:!0}}var w,g=Object.prototype.hasOwnProperty,m="function"==typeof Symbol?Symbol:{},_=m.iterator||"@@iterator",b=m.toStringTag||"@@toStringTag",x="object"==typeof t,S=e.regeneratorRuntime;if(S)return void(x&&(t.exports=S));S=e.regeneratorRuntime=x?t.exports:{},S.wrap=n;var E="suspendedStart",O="suspendedYield",k="executing",N="completed",L={},A=u.prototype=o.prototype;a.prototype=A.constructor=u,u.constructor=a,u[b]=a.displayName="GeneratorFunction",S.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===a||"GeneratorFunction"===(e.displayName||e.name))},S.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,u):(t.__proto__=u,b in t||(t[b]="GeneratorFunction")),t.prototype=Object.create(A),t},S.awrap=function(t){return new c(t)},f(s.prototype),S.async=function(t,e,r,i){var o=new s(n(t,e,r,i));return S.isGeneratorFunction(e)?o:o.next().then(function(t){return t.done?t.value:o.next()})},f(A),A[_]=function(){return this},A[b]="Generator",A.toString=function(){return"[object Generator]"},S.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},S.values=v,p.prototype={constructor:p,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=w,this.done=!1,this.delegate=null,this.tryEntries.forEach(y),!t)for(var e in this)"t"===e.charAt(0)&&g.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=w)},stop:function(){this.done=!0;var t=this.tryEntries[0],e=t.completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(t){function e(e,n){return o.type="throw",o.arg=t,r.next=e,!!n}if(this.done)throw t;for(var r=this,n=this.tryEntries.length-1;n>=0;--n){var i=this.tryEntries[n],o=i.completion;if("root"===i.tryLoc)return e("end");if(i.tryLoc<=this.prev){var a=g.call(i,"catchLoc"),u=g.call(i,"finallyLoc");if(a&&u){if(this.prev<i.catchLoc)return e(i.catchLoc,!0);if(this.prev<i.finallyLoc)return e(i.finallyLoc)}else if(a){if(this.prev<i.catchLoc)return e(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return e(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&g.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var i=n;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var o=i?i.completion:{};return o.type=t,o.arg=e,i?this.next=i.finallyLoc:this.complete(o),L},complete:function(t,e){if("throw"===t.type)throw t.arg;"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=t.arg,this.next="end"):"normal"===t.type&&e&&(this.next=e)},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),y(r),L}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var i=n.arg;y(r)}return i}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:v(t),resultName:e,nextLoc:r},L}}}("object"==typeof e?e:"object"==typeof window?window:"object"==typeof self?self:this)}).call(e,function(){return this}(),r(8))},function(t,e,r){r(21);var n=r(3).Object;t.exports=function(t,e,r){return n.defineProperty(t,e,r)}},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e,r){var n=r(2);t.exports=function(t){if(!n(t))throw TypeError(t+" is not an object!");return t}},function(t,e,r){var n=r(12);t.exports=function(t,e,r){if(n(t),void 0===e)return t;switch(r){case 1:return function(r){return t.call(e,r)};case 2:return function(r,n){return t.call(e,r,n)};case 3:return function(r,n,i){return t.call(e,r,n,i)}}return function(){return t.apply(e,arguments)}}},function(t,e,r){var n=r(2),i=r(5).document,o=n(i)&&n(i.createElement);t.exports=function(t){return o?i.createElement(t):{}}},function(t,e,r){var n=r(5),i=r(3),o=r(14),a=r(17),u="prototype",f=function(t,e,r){var c,s,l,h=t&f.F,y=t&f.G,p=t&f.S,v=t&f.P,d=t&f.B,w=t&f.W,g=y?i:i[e]||(i[e]={}),m=g[u],_=y?n:p?n[e]:(n[e]||{})[u];y&&(r=e);for(c in r)s=!h&&_&&void 0!==_[c],s&&c in g||(l=s?_[c]:r[c],g[c]=y&&"function"!=typeof _[c]?r[c]:d&&s?o(l,n):w&&_[c]==l?function(t){var e=function(e,r,n){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,r)}return new t(e,r,n)}return t.apply(this,arguments)};return e[u]=t[u],e}(l):v&&"function"==typeof l?o(Function.call,l):l,v&&((g.virtual||(g.virtual={}))[c]=l,t&f.R&&m&&!m[c]&&a(m,c,l)))};f.F=1,f.G=2,f.S=4,f.P=8,f.B=16,f.W=32,f.U=64,f.R=128,t.exports=f},function(t,e,r){var n=r(6),i=r(19);t.exports=r(1)?function(t,e,r){return n.f(t,e,i(1,r))}:function(t,e,r){return t[e]=r,t}},function(t,e,r){t.exports=!r(1)&&!r(4)(function(){return 7!=Object.defineProperty(r(15)("div"),"a",{get:function(){return 7}}).a})},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e,r){var n=r(2);t.exports=function(t,e){if(!n(t))return t;var r,i;if(e&&"function"==typeof(r=t.toString)&&!n(i=r.call(t)))return i;if("function"==typeof(r=t.valueOf)&&!n(i=r.call(t)))return i;if(!e&&"function"==typeof(r=t.toString)&&!n(i=r.call(t)))return i;throw TypeError("Can't convert object to primitive value")}},function(t,e,r){var n=r(16);n(n.S+n.F*!r(1),"Object",{defineProperty:r(6).f})},function(t,e,r){t.exports={default:r(11),__esModule:!0}},function(t,e){"use strict";e.__esModule=!0,e.default=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},function(t,e,r){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var i=r(22),o=n(i);e.default=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),(0,o.default)(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}()},function(t,e,r){t.exports=r(9)},function(t,e,r){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}function i(t,e){var r;return s.default.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:r=t;case 1:if(!(r<e)){n.next=7;break}return n.next=4,r;case 4:r+=1,n.next=1;break;case 7:case"end":return n.stop()}},h[0],this)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=r(23),a=n(o),u=r(24),f=n(u),c=r(25),s=n(c),l=r(7),h=[i].map(s.default.mark);Set.prototype.addAll=function(t){var e=!0,r=!1,n=void 0;try{for(var i,o=t[Symbol.iterator]();!(e=(i=o.next()).done);e=!0){var a=i.value;this.add(a)}}catch(t){r=!0,n=t}finally{try{!e&&o.return&&o.return()}finally{if(r)throw n}}};var y=function(){function t(e,r,n){(0,a.default)(this,t),this.array=e,this.ROWS=r,this.COLS=n,this.T=r*n}return(0,f.default)(t,[{key:"getRow",value:function(t){return Math.floor(t/this.COLS)}},{key:"getCol",value:function(t){return t%this.COLS}},{key:"countStatus",value:function(t){var e=0,r=!0,n=!1,i=void 0;try{for(var o,a=this.array[Symbol.iterator]();!(r=(o=a.next()).done);r=!0){var u=o.value;u===t&&(e+=1)}}catch(t){n=!0,i=t}finally{try{!r&&a.return&&a.return()}finally{if(n)throw i}}return e}},{key:"splitUnknownParts",value:function(){function t(e){return o[e]<0?e:o[e]=t(o[e])}function e(e,r){var n=t(e),i=t(r);n!==i&&(o[n]<o[i]?(o[n]+=o[i],o[i]=n):(o[i]+=o[n],o[n]=i))}function r(t,e){return(t>=0||t===l.SAFE)&&(e>=0||e===l.SAFE)||t===e}var n=this,o=new Array(this.array.length);o.fill(-1);var a=function(t,i){r(n.array[t],n.array[i])&&e(t,i)},u=!0,f=!1,c=void 0;try{for(var s,h=i(0,this.ROWS)[Symbol.iterator]();!(u=(s=h.next()).done);u=!0){var y=s.value,p=!0,v=!1,d=void 0;try{for(var w,g=i(0,this.COLS)[Symbol.iterator]();!(p=(w=g.next()).done);p=!0){var m=w.value,_=y*this.COLS+m,b=_-this.COLS,x=_-1,S=_-this.COLS-1;m>=1&&a(_,x),y>=1&&a(_,b),y>=1&&m>=1&&a(_,S)}}catch(t){v=!0,d=t}finally{try{!p&&g.return&&g.return()}finally{if(v)throw d}}}}catch(t){f=!0,c=t}finally{try{!u&&h.return&&h.return()}finally{if(f)throw c}}var E=new Map,O=!0,k=!1,N=void 0;try{for(var L,A=i(0,this.T)[Symbol.iterator]();!(O=(L=A.next()).done);O=!0){var T=L.value,R=t(T);this.array[R]===l.UNKNOWN&&(E.has(R)?E.get(R).push(T):E.set(R,[T]))}}catch(t){k=!0,N=t}finally{try{!O&&A.return&&A.return()}finally{if(k)throw N}}return E.values()}},{key:"neighbors",value:s.default.mark(function t(e){var r,n,i,o,a,u,f,c,l,h;return s.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:r=this.getRow(e),n=this.getCol(e),i=[-1,0,1],o=0;case 4:if(!(o<i.length)){t.next=21;break}a=i[o],u=[-1,0,1],f=0;case 8:if(!(f<u.length)){t.next=18;break}if(c=u[f],l=r+a,h=n+c,!(l>=0&&l<this.ROWS&&h>=0&&h<this.COLS)){t.next=15;break}return t.next=15,l*this.COLS+h;case 15:f++,t.next=8;break;case 18:o++,t.next=4;break;case 21:case"end":return t.stop()}},t,this)})},{key:"group",value:function(t){var e=[],r=[],n=[],i=[],o=!0,a=!1,u=void 0;try{for(var f,c=t[Symbol.iterator]();!(o=(f=c.next()).done);o=!0){var s=f.value;switch(this.array[s]){case l.MINE:e.push(s);break;case l.SAFE:n.push(s);break;case l.UNKNOWN:r.push(s);break;default:i.push(s)}}}catch(t){a=!0,u=t}finally{try{!o&&c.return&&c.return()}finally{if(a)throw u}}return{mines:e,unknowns:r,safes:n,normals:i}}},{key:"apply",value:function(t,e){var r=!0,n=!1,i=void 0;try{for(var o,a=t[Symbol.iterator]();!(r=(o=a.next()).done);r=!0){var u=o.value;this.array[u]=e}}catch(t){n=!0,i=t}finally{try{!r&&a.return&&a.return()}finally{if(n)throw i}}}},{key:"revert",value:function(t){this.apply(t,l.UNKNOWN)}},{key:"check",value:function(t){var e=!0,r=!1,n=void 0;try{for(var i,o=t[Symbol.iterator]();!(e=(i=o.next()).done);e=!0){var a=i.value,u=this.group(this.neighbors(a)),f=u.mines,c=u.unknowns,s=f.length,l=f.length+c.length;if(!(s<=this.array[a]&&this.array[a]<=l))return!1}}catch(t){r=!0,n=t}finally{try{!e&&o.return&&o.return()}finally{if(r)throw n}}return!0}},{key:"findRelated",value:function(t){var e=new Set,r=!0,n=!1,i=void 0;try{for(var o,a=t[Symbol.iterator]();!(r=(o=a.next()).done);r=!0){var u=o.value,f=!0,c=!1,s=void 0;try{for(var l,h=this.neighbors(u)[Symbol.iterator]();!(f=(l=h.next()).done);f=!0){var y=l.value;this.array[y]>0&&e.add(y)}}catch(t){c=!0,s=t}finally{try{!f&&h.return&&h.return()}finally{if(c)throw s}}}}catch(t){n=!0,i=t}finally{try{!r&&a.return&&a.return()}finally{if(n)throw i}}return e}},{key:"findExplicitMines",value:function(t){var e=this,r=new Set,n=void 0;n=t?this.findRelated(t):Array.from(i(0,this.T)).filter(function(t){return e.array[t]>0});var o=!0,a=!1,u=void 0;try{for(var f,c=n[Symbol.iterator]();!(o=(f=c.next()).done);o=!0){var s=f.value,l=this.group(this.neighbors(s)),h=l.mines,y=l.unknowns;if(this.array[s]===y.length+h.length){var p=!0,v=!1,d=void 0;try{for(var w,g=y[Symbol.iterator]();!(p=(w=g.next()).done);p=!0){var m=w.value;r.add(m)}}catch(t){v=!0,d=t}finally{try{!p&&g.return&&g.return()}finally{if(v)throw d}}}}}catch(t){a=!0,u=t}finally{try{!o&&c.return&&c.return()}finally{if(a)throw u}}return r}},{key:"findExplicitSafes",value:function(t){var e=this,r=new Set,n=void 0;n=t?this.findRelated(t):Array.from(i(0,this.T)).filter(function(t){return e.array[t]>0});var o=!0,a=!1,u=void 0;try{for(var f,c=n[Symbol.iterator]();!(o=(f=c.next()).done);o=!0){var s=f.value,l=this.group(this.neighbors(s)),h=l.mines,y=l.unknowns;if(this.array[s]===h.length){var p=!0,v=!1,d=void 0;try{for(var w,g=y[Symbol.iterator]();!(p=(w=g.next()).done);p=!0){var m=w.value;r.add(m)}}catch(t){v=!0,d=t}finally{try{!p&&g.return&&g.return()}finally{if(v)throw d}}}}}catch(t){a=!0,u=t}finally{try{!o&&c.return&&c.return()}finally{if(a)throw u}}return r}},{key:"explicitIterationFromSafe",value:function(t){for(var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=new Set,n=new Set,i=!1,o=t;o.length>0;){var a=this.findExplicitMines(o);if(this.apply(a,l.MINE),r.addAll(a),e&&!this.check(this.findRelated(a))){i=!0;break}if(o=this.findExplicitSafes(a),this.apply(o,l.SAFE),n.addAll(o),e&&!this.check(this.findRelated(o))){i=!0;break}}return{foundMines:r,foundSafes:n,checkFailed:i}}},{key:"explicitIterationFromMine",value:function(t){for(var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=new Set,n=new Set,i=!1,o=t;o.length>0;){var a=this.findExplicitSafes(o);if(this.apply(a,l.SAFE),n.addAll(a),e&&!this.check(this.findRelated(a))){i=!0;break}if(o=this.findExplicitSafes(a),this.apply(o,l.MINE),r.addAll(o),e&&!this.check(this.findRelated(o))){i=!0;break}}return{foundMines:r,foundSafes:n,checkFailed:i}}},{key:"canBeMine",value:function(t){this.array[t]=l.MINE;var e=this.explicitIterationFromMine([t],!0),r=e.foundMines,n=e.foundSafes,i=e.checkFailed;return this.array[t]=l.UNKNOWN,this.revert(r),this.revert(n),!i}},{key:"canBeSafe",value:function(t){this.array[t]=l.SAFE;var e=this.explicitIterationFromSafe([t],!1),r=e.foundMines,n=e.foundSafes,i=e.checkFailed;return this.array[t]=l.UNKNOWN,this.revert(r),this.revert(n),!i}},{key:"canBeResolve",value:function(t){return this.group(this.neighbors(t)).normals.length>0}},{key:"sortByNearbyNumbers",value:function(t,e){var r=this,n=this.group(this.neighbors(t)).normals,i=this.group(this.neighbors(e)).normals;return n.reduce(function(t,e){return Math.min(t,r.array[e])},9)-i.reduce(function(t,e){return Math.min(t,r.array[e])},9)}},{key:"resolve",value:function(t){return this.canBeMine(t)?this.canBeSafe(t)?l.UNKNOWN:l.MINE:l.SAFE}}]),t}();e.default=y;(function(){"undefined"!=typeof __REACT_HOT_LOADER__&&(__REACT_HOT_LOADER__.register(i,"range","D:/minesweeper/app/ai/State.js"),__REACT_HOT_LOADER__.register(y,"State","D:/minesweeper/app/ai/State.js"))})()}]);