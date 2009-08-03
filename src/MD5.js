Crypto.MD5 = function () {

	// Shortcut
	var util = Crypto.util;

	// Public API
	var MD5 = function (message, options) {
		var digestBytes = util.words_bytes(MD5._MD5(message));
		return options && options.asBytes ? digestBytes : util.bytes_hex(digestBytes);
	};

	// The core
	MD5._MD5 = function (message) {

		var m = util.string_words(message),
		    l = message.length * 8,
		    a =  1732584193,
		    b = -271733879,
		    c = -1732584194,
		    d =  271733878;

		// Swap endian
		for (var i = 0; i < m.length; i++) {
			m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
			       ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
		}

		// Padding
		m[l >>> 5] |= 0x80 << (l % 32);
		m[(((l + 64) >>> 9) << 4) + 14] = l;

		for (var i = 0; i < m.length; i += 16) {

			var aa = a,
			    bb = b,
			    cc = c,
			    dd = d;

			a = this._FF(a, b, c, d, m[i+ 0],  7, -680876936);
			d = this._FF(d, a, b, c, m[i+ 1], 12, -389564586);
			c = this._FF(c, d, a, b, m[i+ 2], 17,  606105819);
			b = this._FF(b, c, d, a, m[i+ 3], 22, -1044525330);
			a = this._FF(a, b, c, d, m[i+ 4],  7, -176418897);
			d = this._FF(d, a, b, c, m[i+ 5], 12,  1200080426);
			c = this._FF(c, d, a, b, m[i+ 6], 17, -1473231341);
			b = this._FF(b, c, d, a, m[i+ 7], 22, -45705983);
			a = this._FF(a, b, c, d, m[i+ 8],  7,  1770035416);
			d = this._FF(d, a, b, c, m[i+ 9], 12, -1958414417);
			c = this._FF(c, d, a, b, m[i+10], 17, -42063);
			b = this._FF(b, c, d, a, m[i+11], 22, -1990404162);
			a = this._FF(a, b, c, d, m[i+12],  7,  1804603682);
			d = this._FF(d, a, b, c, m[i+13], 12, -40341101);
			c = this._FF(c, d, a, b, m[i+14], 17, -1502002290);
			b = this._FF(b, c, d, a, m[i+15], 22,  1236535329);

			a = this._GG(a, b, c, d, m[i+ 1],  5, -165796510);
			d = this._GG(d, a, b, c, m[i+ 6],  9, -1069501632);
			c = this._GG(c, d, a, b, m[i+11], 14,  643717713);
			b = this._GG(b, c, d, a, m[i+ 0], 20, -373897302);
			a = this._GG(a, b, c, d, m[i+ 5],  5, -701558691);
			d = this._GG(d, a, b, c, m[i+10],  9,  38016083);
			c = this._GG(c, d, a, b, m[i+15], 14, -660478335);
			b = this._GG(b, c, d, a, m[i+ 4], 20, -405537848);
			a = this._GG(a, b, c, d, m[i+ 9],  5,  568446438);
			d = this._GG(d, a, b, c, m[i+14],  9, -1019803690);
			c = this._GG(c, d, a, b, m[i+ 3], 14, -187363961);
			b = this._GG(b, c, d, a, m[i+ 8], 20,  1163531501);
			a = this._GG(a, b, c, d, m[i+13],  5, -1444681467);
			d = this._GG(d, a, b, c, m[i+ 2],  9, -51403784);
			c = this._GG(c, d, a, b, m[i+ 7], 14,  1735328473);
			b = this._GG(b, c, d, a, m[i+12], 20, -1926607734);

			a = this._HH(a, b, c, d, m[i+ 5],  4, -378558);
			d = this._HH(d, a, b, c, m[i+ 8], 11, -2022574463);
			c = this._HH(c, d, a, b, m[i+11], 16,  1839030562);
			b = this._HH(b, c, d, a, m[i+14], 23, -35309556);
			a = this._HH(a, b, c, d, m[i+ 1],  4, -1530992060);
			d = this._HH(d, a, b, c, m[i+ 4], 11,  1272893353);
			c = this._HH(c, d, a, b, m[i+ 7], 16, -155497632);
			b = this._HH(b, c, d, a, m[i+10], 23, -1094730640);
			a = this._HH(a, b, c, d, m[i+13],  4,  681279174);
			d = this._HH(d, a, b, c, m[i+ 0], 11, -358537222);
			c = this._HH(c, d, a, b, m[i+ 3], 16, -722521979);
			b = this._HH(b, c, d, a, m[i+ 6], 23,  76029189);
			a = this._HH(a, b, c, d, m[i+ 9],  4, -640364487);
			d = this._HH(d, a, b, c, m[i+12], 11, -421815835);
			c = this._HH(c, d, a, b, m[i+15], 16,  530742520);
			b = this._HH(b, c, d, a, m[i+ 2], 23, -995338651);

			a = this._II(a, b, c, d, m[i+ 0],  6, -198630844);
			d = this._II(d, a, b, c, m[i+ 7], 10,  1126891415);
			c = this._II(c, d, a, b, m[i+14], 15, -1416354905);
			b = this._II(b, c, d, a, m[i+ 5], 21, -57434055);
			a = this._II(a, b, c, d, m[i+12],  6,  1700485571);
			d = this._II(d, a, b, c, m[i+ 3], 10, -1894986606);
			c = this._II(c, d, a, b, m[i+10], 15, -1051523);
			b = this._II(b, c, d, a, m[i+ 1], 21, -2054922799);
			a = this._II(a, b, c, d, m[i+ 8],  6,  1873313359);
			d = this._II(d, a, b, c, m[i+15], 10, -30611744);
			c = this._II(c, d, a, b, m[i+ 6], 15, -1560198380);
			b = this._II(b, c, d, a, m[i+13], 21,  1309151649);
			a = this._II(a, b, c, d, m[i+ 4],  6, -145523070);
			d = this._II(d, a, b, c, m[i+11], 10, -1120210379);
			c = this._II(c, d, a, b, m[i+ 2], 15,  718787259);
			b = this._II(b, c, d, a, m[i+ 9], 21, -343485551);

			a += aa;
			b += bb;
			c += cc;
			d += dd;

		}

		return util.endian([a, b, c, d]);

	};

	// Auxiliary functions
	MD5._FF  = function (a, b, c, d, x, s, t) {
		var n = a + (b & c | ~b & d) + (x >>> 0) + t;
		return ((n << s) | (n >>> (32 - s))) + b;
	};
	MD5._GG  = function (a, b, c, d, x, s, t) {
		var n = a + (b & d | c & ~d) + (x >>> 0) + t;
		return ((n << s) | (n >>> (32 - s))) + b;
	};
	MD5._HH  = function (a, b, c, d, x, s, t) {
		var n = a + (b ^ c ^ d) + (x >>> 0) + t;
		return ((n << s) | (n >>> (32 - s))) + b;
	};
	MD5._II  = function (a, b, c, d, x, s, t) {
		var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
		return ((n << s) | (n >>> (32 - s))) + b;
	};

	return MD5;

}();
