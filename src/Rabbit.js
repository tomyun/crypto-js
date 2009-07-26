Crypto.Rabbit = function () {

	// Shortcut
	var util = Crypto.util;

	// Inner state
	var X = [],
	    C = [],
	    b;

	return {

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
			var C_old = [];
			for (var i = 0; i < 8; i++) C_old[i] = C[i];

			// Calculate new counter values
			C[0] = util.add(C[0], 0x4D34D34D, b);
			C[1] = util.add(C[1], 0xD34D34D3, util.lt(C[0], C_old[0]) ? 1 : 0);
			C[2] = util.add(C[2], 0x34D34D34, util.lt(C[1], C_old[1]) ? 1 : 0);
			C[3] = util.add(C[3], 0x4D34D34D, util.lt(C[2], C_old[2]) ? 1 : 0);
			C[4] = util.add(C[4], 0xD34D34D3, util.lt(C[3], C_old[3]) ? 1 : 0);
			C[5] = util.add(C[5], 0x34D34D34, util.lt(C[4], C_old[4]) ? 1 : 0);
			C[6] = util.add(C[6], 0x4D34D34D, util.lt(C[5], C_old[5]) ? 1 : 0);
			C[7] = util.add(C[7], 0xD34D34D3, util.lt(C[6], C_old[6]) ? 1 : 0);
			b = util.lt(C[7], C_old[7]) ? 1 : 0;

			// Calculate the g-values
			var g = [];
			for (var i = 0; i < 8; i++)
				g[i] = this._g(util.add(X[i], C[i]));

			// Calculate new state values
			X[0] = util.add(g[0] + util.rotl(g[7], 16) + util.rotl(g[6], 16));
			X[1] = util.add(g[1] + util.rotl(g[0],  8) + g[7]);
			X[2] = util.add(g[2] + util.rotl(g[1], 16) + util.rotl(g[0], 16));
			X[3] = util.add(g[3] + util.rotl(g[2],  8) + g[1]);
			X[4] = util.add(g[4] + util.rotl(g[3], 16) + util.rotl(g[2], 16));
			X[5] = util.add(g[5] + util.rotl(g[4],  8) + g[3]);
			X[6] = util.add(g[6] + util.rotl(g[5], 16) + util.rotl(g[4], 16));
			X[7] = util.add(g[7] + util.rotl(g[6],  8) + g[5]);

		},

		// Function g: Transform two 32-bit inputs into one 32-bit output
		_g: function (x) {

			// Construct high and low argument for squaring
			var a = x & 0xFFFF,
			    b = x >>> 16;

			// Calculate high and low result of squaring
			var h = ((((a * a) >>> 17) + a * b) >>> 15) + b * b,
			    l = util.mult(x, x);

			// Return high XOR low
			return h ^ l;

		},

		// Extraction scheme
		_GetOutputBlock: function () {

			// Iterate the system
			this._NextState();

			// Generate 16 bytes of pseudo-random data
			return util.words_bytes([
				util.endian(X[0] ^ (X[5] >>> 16) ^ (X[3] << 16)),
				util.endian(X[2] ^ (X[7] >>> 16) ^ (X[5] << 16)),
				util.endian(X[4] ^ (X[1] >>> 16) ^ (X[7] << 16)),
				util.endian(X[6] ^ (X[3] >>> 16) ^ (X[1] << 16))
			]);

		},

		// Encryption/decryption scheme
		_Rabbit: function (M, K, IV) {

			this._KeySetup(K);
			if (IV) this._IVSetup(IV);

			var S = this._GetOutputBlock();
			for (var i = 0; i < M.length; i++) {
				if (S.length == 0) S = this._GetOutputBlock();
				M[i] ^= S.shift();
			}

		},


		/**
		 * Public API
		 */

		encrypt: function (message, key, IV) {

			// Convert to bytes and words
			var M = util.string_bytes(message),
			    K = util.endian(util.string_words(key));

			// Generate random IV, or use given IV if testing
			if (!this.testMode) {
				IV = [
					Math.floor(Math.random() * 0x100000000),
					Math.floor(Math.random() * 0x100000000)
				];
			}

			// Encrypt
			this._Rabbit(M, K, IV);

			// Return ciphertext
			return util.bytes_base64(!this.testMode ? util.words_bytes(IV).concat(M) : M);

		},

		decrypt: function (ciphertext, key, IV) {

			// Convert to bytes and words
			var M = util.base64_bytes(ciphertext),
			    K = util.endian(util.string_words(key));

			// Separate IV and message, or use given IV if testing
			if (!this.testMode) {
				IV = util.bytes_words(M.slice(0,8));
				M = M.slice(8);
			}

			// Decrypt
			this._Rabbit(M, K, IV);

			// Return plaintext
			return util.bytes_string(M);

		},

		testMode: false

	};

}();
