Crypto.mode = Crypto.mode || {};
Crypto.mode.ECB = {

	encrypt: function (cipher, M, IV) {

		// Pad
		M.push(0x80);
		while (M.length % (cipher._BlockSize * 4) != 0)
			M.push(0);

		// Encrypt each block
		for (var blockOffset = 0; blockOffset < M.length; blockOffset += cipher._BlockSize * 4)
			cipher._EncryptBlock(M, blockOffset);

	},

	decrypt: function (cipher, C, IV) {

		// Decrypt each block
		for (var i = 0; i < C.length; i += cipher._BlockSize * 4) {

			var block = C.slice(i, i + cipher._BlockSize * 4),
			    plain = cipher._DecryptBlock(block);

			// Copy plaintext bytes into ciphertext array
			for (var j = 0; j < cipher._BlockSize * 4; j++)
				C[i + j] = plain[j];

		}

		// Strip padding
		do { var popped = C.pop(); } while (popped != 0x80);

	}

};
