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
		for (var blockOffset = 0; blockOffset < C.length; blockOffset += cipher._BlockSize * 4)
			cipher._DecryptBlock(C, blockOffset);

		// Strip padding
		do { var popped = C.pop(); } while (popped != 0x80);

	}

};
