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

			// Generate random IV and mix with key
			for (var IV = [], i = 0; i < 16; i++) {
				IV.push(Math.floor(Math.random() * 256));
				K[i] ^= IV[i];
			}

			// Encrypt
			this._MARC4(M, K, 1536);

			// Return ciphertext
			return util.bytes_base64(IV.concat(M));

		},

		decrypt: function (ciphertext, key) {

			// Convert to bytes
			var C = util.base64_bytes(ciphertext),
			    K = util.string_bytes(key);

			// Separate IV and message
			var IV = C.splice(0, 16);

			// Mix IV with key
			for (var i = 0; i < 16; i++) K[i] ^= IV[i];

			// Decrypt
			this._MARC4(C, K, 1536);

			// Return plaintext
			return util.bytes_string(C);

		},


		/**
		 * Internal methods
		 */

		// The core
		_MARC4: function (M, K, drop) {

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
			for (var k = 0 - drop; k < M.length; k++) {

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
