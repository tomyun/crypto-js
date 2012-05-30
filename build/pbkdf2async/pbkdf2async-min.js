/*
 * Crypto-JS v2.5.4
 * http://code.google.com/p/crypto-js/
 * (c) 2009-2012 by Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */
(function(){var a=Crypto,l=a.util,d=a.charenc,m=d.UTF8,t=d.Binary;if(!a.nextTick)if(typeof process!="undefined"&&typeof process.nextTick!=="undefined")a.nextTick=process.nextTick;else if(typeof setTimeout!=="undefined")a.nextTick=function(a){setTimeout(a,0)};a.PBKDF2Async=function(f,g,k,d,b){function n(a){if(o){var b=c.length/e._digestsize*h+a;setTimeout(function(){o(Math.round(b/u*100))},0)}}function p(b,c){return a.HMAC(e,c,b,{asBytes:!0})}f.constructor==String&&(f=m.stringToBytes(f));g.constructor==
String&&(g=m.stringToBytes(g));var e=b&&b.hasher||a.SHA1,h=b&&b.iterations||1,o=b&&b.onProgressChange,u=Math.ceil(k/e._digestsize)*h,i=a.nextTick,c=[],q=1,r,s;i(r=function(){if(c.length<k){var a=p(f,g.concat(l.wordsToBytes([q])));n(1);var e=a,j=1;i(s=function(){var b=new Date;if(j<h){for(;j<h&&(new Date).getTime()-b.getTime()<100;){e=p(f,e);for(var d=0;d<a.length;d++)a[d]^=e[d];j++}n(j);i(s)}else c=c.concat(a),q++,i(r)})}else c.length=k,d(b&&b.asBytes?c:b&&b.asString?t.bytesToString(c):l.bytesToHex(c))})}})();
