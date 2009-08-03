Crypto.SHA256 = function () {

	// Shortcut
	var util = Crypto.util;

	// Public API
	var SHA256 = function (message, options) {
		var digestBytes = util.words_bytes(SHA256._SHA256(message));
		return options && options.asBytes ? digestBytes : util.bytes_hex(digestBytes);
	};

	// Constants
	var K = [0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
	         0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
	         0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
	         0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
	         0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
	         0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
	         0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
	         0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
	         0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
	         0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
	         0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
	         0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
	         0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
	         0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
	         0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
	         0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2];

	// The core
	SHA256._SHA256 = function (message) {

		var m  = util.string_words(message),
		    l  = message.length * 8,
		    H0 = 0x6A09E667,
		    H1 = 0xBB67AE85,
		    H2 = 0x3C6EF372,
		    H3 = 0xA54FF53A,
		    H4 = 0x510E527F,
		    H5 = 0x9B05688C,
		    H6 = 0x1F83D9AB,
		    H7 = 0x5BE0CD19,
		    W  = [],
		    a, b, c, d, e, f, g, h, i, j,
		    T1, T2;

		// Padding
		m[l >> 5] |= 0x80 << (24 - l % 32);
		m[((l + 64 >> 9) << 4) + 15] = l;

		for (var i = 0; i < m.length; i += 16) {

			a = H0;
			b = H1;
			c = H2;
			d = H3;
			e = H4;
			f = H5;
			g = H6;
			h = H7;

			for (var j = 0; j < 64; j++) {

				if (j < 16) W[j] = m[j + i];
				else {

					var gamma0x = W[j - 15],
					    gamma1x = W[j - 2],
					    gamma0  = ((gamma0x << 25) | (gamma0x >>>  7)) ^
					              ((gamma0x << 14) | (gamma0x >>> 18)) ^
					               (gamma0x >>> 3),
					    gamma1  = ((gamma1x <<  15) | (gamma1x >>> 17)) ^
					              ((gamma1x <<  13) | (gamma1x >>> 19)) ^
					               (gamma1x >>> 10);

					W[j] = gamma0 + (W[j - 7] >>> 0) +
					       gamma1 + (W[j - 16] >>> 0);

				}

				var ch  = e & f ^ ~e & g,
				    maj = a & b ^ a & c ^ b & c,
				    sigma0 = ((a << 30) | (a >>>  2)) ^
				             ((a << 19) | (a >>> 13)) ^
				             ((a << 10) | (a >>> 22)),
				    sigma1 = ((e << 26) | (e >>>  6)) ^
				             ((e << 21) | (e >>> 11)) ^
				             ((e <<  7) | (e >>> 25));


				T1 = (h >>> 0) + sigma1 + ch + (K[j]) + (W[j] >>> 0);
				T2 = sigma0 + maj;

				h = g;
				g = f;
				f = e;
				e = d + T1;
				d = c;
				c = b;
				b = a;
				a = T1 + T2;

			}

			H0 += a;
			H1 += b;
			H2 += c;
			H3 += d;
			H4 += e;
			H5 += f;
			H6 += g;
			H7 += h;

		}

		return [H0, H1, H2, H3, H4, H5, H6, H7];

	};

	return SHA256;

}();
