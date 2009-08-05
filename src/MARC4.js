(function(){

// Shortcut
var util = Crypto.util;

var MARC4 = Crypto.MARC4 = {

	/**
	 * Public API
	 */

	encrypt: function (message, key) {

		// Convert to bytes
		var M = util.stringToBytes(message),
		    K = util.stringToBytes(key);

		// Generate random IV
		for (var IV = [], i = 0; i < 16; i++)
			IV.push(Math.floor(Math.random() * 256));

		// Attach IV to key
		K = K.concat(IV);

		// Encrypt
		MARC4._MARC4(M, K, 1536);

		// Return ciphertext
		return util.bytesToBase64(IV.concat(M));

	},

	decrypt: function (ciphertext, key) {

		// Convert to bytes
		var C = util.base64ToBytes(ciphertext),
		    K = util.stringToBytes(key);

		// Separate IV and message
		var IV = C.splice(0, 16);

		// Attach IV to key
		K = K.concat(IV);

		// Decrypt
		MARC4._MARC4(C, K, 1536);

		// Return plaintext
		return util.bytesToString(C);

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

})();
