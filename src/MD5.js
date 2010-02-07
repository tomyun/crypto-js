(function () {

// Shortcuts
var C = Crypto;
var UTF8 = C.enc.UTF8;
var WordArray = C.types.WordArray;

// Public API
var MD5 = C["MD5"] = function (message, options) {

	// Digest
	var digestWords = MD5.digest(message);

	// Set default output
	var output = options && options["output"] || C.enc.Hex;

	// Return encoded output
	return output.encode(digestWords);

};

// The core
MD5.digest = function (message) {

	// Convert to words, else assume words already
	var m = message.constructor == String ? UTF8.decode(message) : message;

	// Swap endian
	for (var i = 0; i < m.length; i++) {
		m[i] = (((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF) |
		       (((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00);
	}

	// Add padding
	var l = WordArray.getSigBytes(m) * 8;
	m[l >>> 5] |= 0x80 << (l % 32);
	m[(((l + 64) >>> 9) << 4) + 14] = l;

	// Initial values
	var a = 0x67452301;
	var b = 0xEFCDAB89;
	var c = 0x98BADCFE;
	var d = 0x10325476;

	for (var i = 0; i < m.length; i += 16) {

		var aa = a;
		var bb = b;
		var cc = c;
		var dd = d;

		a = MD5.ff(a, b, c, d, m[i +  0],  7, 0xD76AA478);
		d = MD5.ff(d, a, b, c, m[i +  1], 12, 0xE8C7B756);
		c = MD5.ff(c, d, a, b, m[i +  2], 17, 0x242070DB);
		b = MD5.ff(b, c, d, a, m[i +  3], 22, 0xC1BDCEEE);
		a = MD5.ff(a, b, c, d, m[i +  4],  7, 0xF57C0FAF);
		d = MD5.ff(d, a, b, c, m[i +  5], 12, 0x4787C62A);
		c = MD5.ff(c, d, a, b, m[i +  6], 17, 0xA8304613);
		b = MD5.ff(b, c, d, a, m[i +  7], 22, 0xFD469501);
		a = MD5.ff(a, b, c, d, m[i +  8],  7, 0x698098D8);
		d = MD5.ff(d, a, b, c, m[i +  9], 12, 0x8B44F7AF);
		c = MD5.ff(c, d, a, b, m[i + 10], 17, 0xFFFF5BB1);
		b = MD5.ff(b, c, d, a, m[i + 11], 22, 0x895CD7BE);
		a = MD5.ff(a, b, c, d, m[i + 12],  7, 0x6B901122);
		d = MD5.ff(d, a, b, c, m[i + 13], 12, 0xFD987193);
		c = MD5.ff(c, d, a, b, m[i + 14], 17, 0xA679438E);
		b = MD5.ff(b, c, d, a, m[i + 15], 22, 0x49B40821);

		a = MD5.gg(a, b, c, d, m[i +  1],  5, 0xF61E2562);
		d = MD5.gg(d, a, b, c, m[i +  6],  9, 0xC040B340);
		c = MD5.gg(c, d, a, b, m[i + 11], 14, 0x265E5A51);
		b = MD5.gg(b, c, d, a, m[i +  0], 20, 0xE9B6C7AA);
		a = MD5.gg(a, b, c, d, m[i +  5],  5, 0xD62F105D);
		d = MD5.gg(d, a, b, c, m[i + 10],  9, 0x02441453);
		c = MD5.gg(c, d, a, b, m[i + 15], 14, 0xD8A1E681);
		b = MD5.gg(b, c, d, a, m[i +  4], 20, 0xE7D3FBC8);
		a = MD5.gg(a, b, c, d, m[i +  9],  5, 0x21E1CDE6);
		d = MD5.gg(d, a, b, c, m[i + 14],  9, 0xC33707D6);
		c = MD5.gg(c, d, a, b, m[i +  3], 14, 0xF4D50D87);
		b = MD5.gg(b, c, d, a, m[i +  8], 20, 0x455A14ED);
		a = MD5.gg(a, b, c, d, m[i + 13],  5, 0xA9E3E905);
		d = MD5.gg(d, a, b, c, m[i +  2],  9, 0xFCEFA3F8);
		c = MD5.gg(c, d, a, b, m[i +  7], 14, 0x676F02D9);
		b = MD5.gg(b, c, d, a, m[i + 12], 20, 0x8D2A4C8A);

		a = MD5.hh(a, b, c, d, m[i +  5],  4, 0xFFFA3942);
		d = MD5.hh(d, a, b, c, m[i +  8], 11, 0x8771F681);
		c = MD5.hh(c, d, a, b, m[i + 11], 16, 0x6D9D6122);
		b = MD5.hh(b, c, d, a, m[i + 14], 23, 0xFDE5380C);
		a = MD5.hh(a, b, c, d, m[i +  1],  4, 0xA4BEEA44);
		d = MD5.hh(d, a, b, c, m[i +  4], 11, 0x4BDECFA9);
		c = MD5.hh(c, d, a, b, m[i +  7], 16, 0xF6BB4B60);
		b = MD5.hh(b, c, d, a, m[i + 10], 23, 0xBEBFBC70);
		a = MD5.hh(a, b, c, d, m[i + 13],  4, 0x289B7EC6);
		d = MD5.hh(d, a, b, c, m[i +  0], 11, 0xEAA127FA);
		c = MD5.hh(c, d, a, b, m[i +  3], 16, 0xD4EF3085);
		b = MD5.hh(b, c, d, a, m[i +  6], 23, 0x04881D05);
		a = MD5.hh(a, b, c, d, m[i +  9],  4, 0xD9D4D039);
		d = MD5.hh(d, a, b, c, m[i + 12], 11, 0xE6DB99E5);
		c = MD5.hh(c, d, a, b, m[i + 15], 16, 0x1FA27CF8);
		b = MD5.hh(b, c, d, a, m[i +  2], 23, 0xC4AC5665);

		a = MD5.ii(a, b, c, d, m[i +  0],  6, 0xF4292244);
		d = MD5.ii(d, a, b, c, m[i +  7], 10, 0x432AFF97);
		c = MD5.ii(c, d, a, b, m[i + 14], 15, 0xAB9423A7);
		b = MD5.ii(b, c, d, a, m[i +  5], 21, 0xFC93A039);
		a = MD5.ii(a, b, c, d, m[i + 12],  6, 0x655B59C3);
		d = MD5.ii(d, a, b, c, m[i +  3], 10, 0x8F0CCC92);
		c = MD5.ii(c, d, a, b, m[i + 10], 15, 0xFFEFF47D);
		b = MD5.ii(b, c, d, a, m[i +  1], 21, 0x85845DD1);
		a = MD5.ii(a, b, c, d, m[i +  8],  6, 0x6FA87E4F);
		d = MD5.ii(d, a, b, c, m[i + 15], 10, 0xFE2CE6E0);
		c = MD5.ii(c, d, a, b, m[i +  6], 15, 0xA3014314);
		b = MD5.ii(b, c, d, a, m[i + 13], 21, 0x4E0811A1);
		a = MD5.ii(a, b, c, d, m[i +  4],  6, 0xF7537E82);
		d = MD5.ii(d, a, b, c, m[i + 11], 10, 0xBD3AF235);
		c = MD5.ii(c, d, a, b, m[i +  2], 15, 0x2AD7D2BB);
		b = MD5.ii(b, c, d, a, m[i +  9], 21, 0xEB86D391);

		a = (a + aa) >>> 0;
		b = (b + bb) >>> 0;
		c = (c + cc) >>> 0;
		d = (d + dd) >>> 0;

	}

	// Swap endian
	a = (((a << 8) | (a >>> 24)) & 0x00FF00FF) | (((a << 24) | (a >>> 8)) & 0xFF00FF00);
	b = (((b << 8) | (b >>> 24)) & 0x00FF00FF) | (((b << 24) | (b >>> 8)) & 0xFF00FF00);
	c = (((c << 8) | (c >>> 24)) & 0x00FF00FF) | (((c << 24) | (c >>> 8)) & 0xFF00FF00);
	d = (((d << 8) | (d >>> 24)) & 0x00FF00FF) | (((d << 24) | (d >>> 8)) & 0xFF00FF00);

	return [a, b, c, d];

};

// Auxiliary functions
MD5.ff  = function(a, b, c, d, x, s, t) {
	x = a + ((b & c) | (~b & d)) + (x >>> 0) + t;
	return ((x << s) | (x >>> (32 - s))) + b;
};
MD5.gg  = function(a, b, c, d, x, s, t) {
	x = a + ((b & d) | (c & ~d)) + (x >>> 0) + t;
	return ((x << s) | (x >>> (32 - s))) + b;
};
MD5.hh  = function(a, b, c, d, x, s, t) {
	x = a + (b ^ c ^ d) + (x >>> 0) + t;
	return ((x << s) | (x >>> (32 - s))) + b;
};
MD5.ii  = function(a, b, c, d, x, s, t) {
	x = a + (c ^ (b | ~d)) + (x >>> 0) + t;
	return ((x << s) | (x >>> (32 - s))) + b;
};

// Package private blocksize
MD5.blockSize = 16;

})();
