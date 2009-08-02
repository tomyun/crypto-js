Crypto.Rabbit = function () {

	// Shortcut
	var util = Crypto.util;

	// Inner state
	var X = [],
	    C = [],
	    b;

	return {

		/**
		 * Public API
		 */

		encrypt: function (message, key) {

			// Convert to bytes and words
			var M = util.string_bytes(message),
			    K = util.endian(util.string_words(key));

			// Generate random IV
			IV = [ Math.floor(Math.random() * 0x100000000),
			       Math.floor(Math.random() * 0x100000000) ];

			// Encrypt
			this._Rabbit(M, K, IV);

			// Return ciphertext
			return util.bytes_base64(util.words_bytes(IV).concat(M));

		},

		decrypt: function (ciphertext, key) {

			// Convert to bytes and words
			var C = util.base64_bytes(ciphertext),
			    K = util.endian(util.string_words(key));

			// Separate IV and message
			IV = util.bytes_words(C.splice(0, 8));

			// Decrypt
			this._Rabbit(C, K, IV);

			// Return plaintext
			return util.bytes_string(C);

		},


		/**
		 * Internal methods
		 */

		// Encryption/decryption scheme
		_Rabbit: function (M, K, IV) {

			this._KeySetup(K);
			if (IV) this._IVSetup(IV);

			for (var S = [], i = 0; i < M.length; i++) {

				if (i % 16 == 0) {

					// Iterate the system
					this._NextState();

					// Generate 16 bytes of pseudo-random data
					S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
					S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
					S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
					S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

					// Swap endian
					for (var j = 0; j < 4; j++) {
						S[j] = ((S[j] <<  8) | (S[j] >>> 24)) & 0x00FF00FF |
						       ((S[j] << 24) | (S[j] >>>  8)) & 0xFF00FF00;
					}

					// Convert words to bytes
					for (var b = 120; b >= 0; b -= 8)
						S[b / 8] = (S[b >>> 5] >>> (24 - b % 32)) & 0xFF;

				}

				M[i] ^= S[i % 16];

			}

		},

		// Key setup scheme
		_KeySetup: function (K) {

			// Generate initial state values
			X[0] = K[0];
			X[2] = K[1];
			X[4] = K[2];
			X[6] = K[3];
			X[1] = (K[3] << 16) | (K[2] >>> 16);
			X[3] = (K[0] << 16) | (K[3] >>> 16);
			X[5] = (K[1] << 16) | (K[0] >>> 16);
			X[7] = (K[2] << 16) | (K[1] >>> 16);

			// Generate initial counter values
			C[0] = util.rotl(K[2], 16);
			C[2] = util.rotl(K[3], 16);
			C[4] = util.rotl(K[0], 16);
			C[6] = util.rotl(K[1], 16);
			C[1] = (K[0] & 0xFFFF0000) | (K[1] & 0xFFFF);
			C[3] = (K[1] & 0xFFFF0000) | (K[2] & 0xFFFF);
			C[5] = (K[2] & 0xFFFF0000) | (K[3] & 0xFFFF);
			C[7] = (K[3] & 0xFFFF0000) | (K[0] & 0xFFFF);

			// Clear carry bit
			b = 0;

			// Iterate the system four times
			for (var i = 0; i < 4; i++) this._NextState();

			// Modify the counters
			for (var i = 0; i < 8; i++) C[i] ^= X[(i + 4) & 7];

		},

		// IV setup scheme
		_IVSetup: function (IV) {

			// Generate four subvectors
			var i0 = util.endian(IV[0]),
			    i2 = util.endian(IV[1]),
			    i1 = (i0 >>> 16) | (i2 & 0xFFFF0000),
			    i3 = (i2 <<  16) | (i0 & 0x0000FFFF);

			// Modify counter values
			C[0] ^= i0;
			C[1] ^= i1;
			C[2] ^= i2;
			C[3] ^= i3;
			C[4] ^= i0;
			C[5] ^= i1;
			C[6] ^= i2;
			C[7] ^= i3;

			// Iterate the system four times
			for (var i = 0; i < 4; i++) this._NextState();

		},

		// Next-state function
		_NextState: function () {

			// Save old counter values
			for (var C_old = [], i = 0; i < 8; i++) C_old[i] = C[i];

			// Calculate new counter values
			C[0] = (C[0] + 0x4D34D34D + b) >>> 0;
			C[1] = (C[1] + 0xD34D34D3 + ((C[0] >>> 0) < (C_old[0] >>> 0) ? 1 : 0)) >>> 0;
			C[2] = (C[2] + 0x34D34D34 + ((C[1] >>> 0) < (C_old[1] >>> 0) ? 1 : 0)) >>> 0;
			C[3] = (C[3] + 0x4D34D34D + ((C[2] >>> 0) < (C_old[2] >>> 0) ? 1 : 0)) >>> 0;
			C[4] = (C[4] + 0xD34D34D3 + ((C[3] >>> 0) < (C_old[3] >>> 0) ? 1 : 0)) >>> 0;
			C[5] = (C[5] + 0x34D34D34 + ((C[4] >>> 0) < (C_old[4] >>> 0) ? 1 : 0)) >>> 0;
			C[6] = (C[6] + 0x4D34D34D + ((C[5] >>> 0) < (C_old[5] >>> 0) ? 1 : 0)) >>> 0;
			C[7] = (C[7] + 0xD34D34D3 + ((C[6] >>> 0) < (C_old[6] >>> 0) ? 1 : 0)) >>> 0;
			b = (C[7] >>> 0) < (C_old[7] >>> 0) ? 1 : 0;

			// Calculate the g-values
			for (var g = [], i = 0; i < 8; i++) {

				var gx = (X[i] + C[i]) >>> 0;

				// Construct high and low argument for squaring
				var ga = gx & 0xFFFF,
				    gb = gx >>> 16;

				// Calculate high and low result of squaring
				var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb,
				    gl = (((gx & 0xFFFF0000) * gx) >>> 0) + (((gx & 0x0000FFFF) * gx) >>> 0) >>> 0;

				// High XOR low
				g[i] = gh ^ gl;

			}

			// Calculate new state values
			X[0] = g[0] + ((g[7] << 16) | (g[7] >>> 16)) + ((g[6] << 16) | (g[6] >>> 16));
			X[1] = g[1] + ((g[0] <<  8) | (g[0] >>> 24)) + g[7];
			X[2] = g[2] + ((g[1] << 16) | (g[1] >>> 16)) + ((g[0] << 16) | (g[0] >>> 16));
			X[3] = g[3] + ((g[2] <<  8) | (g[2] >>> 24)) + g[1];
			X[4] = g[4] + ((g[3] << 16) | (g[3] >>> 16)) + ((g[2] << 16) | (g[2] >>> 16));
			X[5] = g[5] + ((g[4] <<  8) | (g[4] >>> 24)) + g[3];
			X[6] = g[6] + ((g[5] << 16) | (g[5] >>> 16)) + ((g[4] << 16) | (g[4] >>> 16));
			X[7] = g[7] + ((g[6] <<  8) | (g[6] >>> 24)) + g[5];

		}

	};

}();
