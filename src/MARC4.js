Crypto.MARC4 = function () {

	// Shortcut
	var util = Crypto.util;

	return {

		/**
		 * Public API
		 */

		encrypt: function (message, key) {

			// Convert to bytes
			var M = util.string_bytes(message),
			    K = util.string_bytes(key);

			// Attach random IV
			if (!this.testMode) {
				for (var i = 0; i < 8; i++)
					K.unshift(Math.floor(Math.random() * 256));
			}

			// Encrypt
			this._MARC4(M, K);

			// Return ciphertext
			return util.bytes_base64(!this.testMode ? K.slice(0,8).concat(M) : M);

		},

		decrypt: function (ciphertext, key) {

			// Convert to bytes
			var C = util.base64_bytes(ciphertext),
			    K = util.string_bytes(key);

			// Retrieve IV
			if (!this.testMode) {

				// Separate IV and message
				var IV = C.splice(0,8);

				// Attach IV
				K = IV.concat(K);

			}

			// Decrypt
			this._MARC4(C, K);

			// Return plaintext
			return util.bytes_string(C);

		},

		testMode: false,


		/**
		 * Internal methods
		 */

		// The core
		_MARC4: function (M, K) {

			// State variables
			var i, j, S;

			// Key setup
			for (i = 0, S = []; i < 256; i++) S[i] = i;
			for (i = 0, j = 0;  i < 256; i++) {

				j = (j + S[i] + K[i % K.length]) % 256;

				// Swap
				S[i] ^= S[j];
				S[j] ^= S[i];
				S[i] ^= S[j];

			}

			// Clear counters
			i = j = 0;

			// Encryption
			for (var k = !this.testMode ? -1536 : 0; k < M.length; k++) {

				i = (i + 1) % 256;
				j = (j + S[i]) % 256;

				// Swap
				S[i] ^= S[j];
				S[j] ^= S[i];
				S[i] ^= S[j];

				// Stop here if we're still dropping keystream
				if (k < 0) continue;

				// Encrypt
				M[k] ^= S[(S[i] + S[j]) % 256];

			}

		}

	};

}();
