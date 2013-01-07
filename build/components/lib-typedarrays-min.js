/*
CryptoJS v3.1
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function(){if("function"==typeof ArrayBuffer){var b=CryptoJS.lib.WordArray,$superInit=b.init;b.init=function(a){a instanceof ArrayBuffer&&(a=new DataView(a));if(a instanceof Int8Array||a instanceof Uint8Array||a instanceof Uint8ClampedArray||a instanceof Int16Array||a instanceof Uint16Array||a instanceof Int32Array||a instanceof Uint32Array||a instanceof Float32Array||a instanceof Float64Array)a=new DataView(a.buffer);if(a instanceof DataView){for(var b=a.byteLength,d=[],c=0;c<b;c++)d[c>>>2]|=a.getUint8(c)<<
24-8*(c%4);$superInit.call(this,d,b)}else $superInit.apply(this,arguments)};b.init.prototype=b}})();
