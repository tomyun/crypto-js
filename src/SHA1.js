(function () {

// Shortcuts
var C = Crypto;
var UTF8 = C.enc.UTF8;
var WordArray = C.types.WordArray;

// Public API
var SHA1 = C.SHA1 = function (message, options) {

	// Digest
	var digestWords = SHA1.digest(message);

	// Set default output
	var output = options && options.output || C.enc.Hex;

	// Return encoded output
	return output.encode(digestWords);

};

// The core
SHA1.digest = function (message) {

	// Convert to words, else assume words already
	var m = message.constructor == String ? UTF8.decode(message) : message;

	// Add padding
	var l = WordArray.getSigBytes(m) * 8;
	m[l >>> 5] |= 0x80 << (24 - l % 32);
	m[(((l + 64) >>> 9) << 4) + 15] = l;

	// Initial values
	var w  = [];
	var H0 = 0x67452301;
	var H1 = 0xEFCDAB89;
	var H2 = 0x98BADCFE;
	var H3 = 0x10325476;
	var H4 = 0xC3D2E1F0;

	for (var i = 0; i < m.length; i += 16) {

		var a = H0;
		var b = H1;
		var c = H2;
		var d = H3;
		var e = H4;

		for (var j = 0; j < 80; j++) {

			if (j < 16) w[j] = m[i + j];
			else {
				var n = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
				w[j] = (n << 1) | (n >>> 31);
			}

			var t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0) + (
			         j < 20 ? ((H1 & H2) | (~H1 & H3))            + 0x5A827999 :
			         j < 40 ?  (H1 ^ H2 ^ H3)                     + 0x6ED9EBA1 :
			         j < 60 ? ((H1 & H2) | (H1 & H3) | (H2 & H3)) - 0x70E44324 :
			                   (H1 ^ H2 ^ H3)                     - 0x359D3E2A);

			H4 = H3;
			H3 = H2;
			H2 = (H1 << 30) | (H1 >>> 2);
			H1 = H0;
			H0 = t;

		}

		H0 += a;
		H1 += b;
		H2 += c;
		H3 += d;
		H4 += e;

	}

	return [H0, H1, H2, H3, H4];

};

// Block size
SHA1.blockSize = 16;

})();
