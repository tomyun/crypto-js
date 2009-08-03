Crypto.SHA1 = function () {

	// Shortcut
	var util = Crypto.util;

	// Public API
	var SHA1 = function (message, options) {
		var digestBytes = util.words_bytes(SHA1._SHA1(message));
		return options && options.asBytes ? digestBytes : util.bytes_hex(digestBytes);
	};

	// The core
	SHA1._SHA1 = function (message) {

		var M  = util.string_words(message),
		    l  = message.length * 8,
		    W  =  [],
		    H0 =  1732584193,
		    H1 = -271733879,
		    H2 = -1732584194,
		    H3 =  271733878,
		    H4 = -1009589776;

		// Padding
		M[l >> 5] |= 0x80 << (24 - l % 32);
		M[((l + 64 >>> 9) << 4) + 15] = l;

		for (var i = 0; i < M.length; i += 16) {

			var A = H0,
			    B = H1,
			    C = H2,
			    D = H3,
			    E = H4;

			for (var j = 0; j < 80; j++) {

				if (j < 16) W[j] = M[i + j];
				else W[j] = util.rotl(W[j-3] ^ W[j-8] ^ W[j-14] ^ W[j-16], 1);

				var temp = util.add(util.rotl(H0, 5), this._f(j, H1, H2, H3), H4, W[j], this._K(j));
				H4 = H3;
				H3 = H2;
				H2 = util.rotl(H1, 30);
				H1 = H0;
				H0 = temp;

			}

			H0 = util.add(H0, A);
			H1 = util.add(H1, B);
			H2 = util.add(H2, C);
			H3 = util.add(H3, D);
			H4 = util.add(H4, E);

		}

		return [H0, H1, H2, H3, H4];

	};

	SHA1._f = function (t, b, c, d) {
		if (t < 20) return (b & c) | ((~b) & d);
		if (t < 40) return  b ^ c ^ d;
		if (t < 60) return (b & c) | (b & d) | (c & d);
		return b ^ c ^ d;
	};

	SHA1._K = function (t) {
		if (t < 20) return  1518500249;
		if (t < 40) return  1859775393;
		if (t < 60) return -1894007588;
		return -899497514
	};

	return SHA1;

}();
