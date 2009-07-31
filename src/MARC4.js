Crypto.MARC4 = function () {

	// Shortcut
	var util = Crypto.util;

	// IV length in bytes
	var ivLen = 16;

	// Drop n keystream bytes
	var drop = 1536;

	return {

		/**
		 * Public API
		 */

		encrypt: function (message, key) {

			// Convert to bytes
			var M = util.string_bytes(message),
			    K = util.string_bytes(key);

			// Attach random IV
			for (var IV = [], i = 0; i < ivLen; i++)
				IV.push(Math.floor(Math.random() * 256));
			K = K.concat(IV);

			// Encrypt
			this._MARC4(M, K, drop);

			// Return ciphertext
			return util.bytes_base64(IV.concat(M));

		},

		decrypt: function (ciphertext, key) {

			// Convert to bytes
			var C = util.base64_bytes(ciphertext),
			    K = util.string_bytes(key);

			// Separate IV and message
			var IV = C.splice(0, ivLen);

			// Attach IV
			K = K.concat(IV);

			// Decrypt
			this._MARC4(C, K, drop);

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
