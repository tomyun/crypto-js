(function(){

// Shortcut
var util = Crypto.util;

var MARC4 = Crypto.MARC4 = {

	/**
	 * Public API
	 */

	encrypt: function (message, key) {

		// Convert to bytes
		var m = util.stringToBytes(message),
		    k = util.stringToBytes(key);

		// Generate random IV
		var iv = util.randomBytes(16);

		// Attach IV to key
		k = k.concat(iv);

		// Encrypt
		MARC4._marc4(m, k, 1536);

		// Return ciphertext
		return util.bytesToBase64(iv.concat(m));

	},

	decrypt: function (ciphertext, key) {

		// Convert to bytes
		var c = util.base64ToBytes(ciphertext),
		    k = util.stringToBytes(key);

		// Separate IV and message
		var iv = c.splice(0, 16);

		// Attach IV to key
		k = k.concat(iv);

		// Decrypt
		MARC4._marc4(c, k, 1536);

		// Return plaintext
		return util.bytesToString(c);

	},


	/**
	 * Internal methods
	 */

	// The core
	_marc4: function (m, k, drop) {

		// State variables
		var i, j, s, temp;

		// Key setup
		for (i = 0, s = []; i < 256; i++) s[i] = i;
		for (i = 0, j = 0;  i < 256; i++) {

			j = (j + s[i] + k[i % k.length]) % 256;

			// Swap
			temp = s[i];
			s[i] = s[j];
			s[j] = temp;

		}

		// Clear counters
		i = j = 0;

		// Encryption
		for (var k = 0 - drop; k < m.length; k++) {

			i = (i + 1) % 256;
			j = (j + s[i]) % 256;

			// Swap
			temp = s[i];
			s[i] = s[j];
			s[j] = temp;

			// Stop here if we're still dropping keystream
			if (k < 0) continue;

			// Encrypt
			m[k] ^= s[(s[i] + s[j]) % 256];

		}

	}

};

})();
