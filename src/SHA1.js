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
				else {
					var n = W[j-3] ^ W[j-8] ^ W[j-14] ^ W[j-16];
					W[j] = (n << 1) | (n >>> 31);
				}

				var f = j < 20 ? H1 & H2 | ~H1 & H3 :
				        j < 40 ? H1 ^ H2 ^ H3 :
				        j < 60 ? H1 & H2 | H1 & H3 | H2 & H3 :
				                 H1 ^ H2 ^ H3,
				    K = j < 20 ?  1518500249 :
				        j < 40 ?  1859775393 :
				        j < 60 ? -1894007588 :
				                 -899497514,
				    t = ((H0 << 5) | (H0 >>> 27)) +
				        f + H4 + (W[j] >>> 0) + K;

				H4 =  H3;
				H3 =  H2;
				H2 = (H1 << 30) | (H1 >>> 2);
				H1 =  H0;
				H0 =  t;

			}

			H0 += A;
			H1 += B;
			H2 += C;
			H3 += D;
			H4 += E;

		}

		return [H0, H1, H2, H3, H4];

	};

	return SHA1;

}();
