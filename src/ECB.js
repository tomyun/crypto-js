Crypto.mode.ECB = {

	encrypt: function (cipher, M, IV) {

		var blockSize = cipher._BlockSize * 4;

		// Pad
		M.push(0x80);
		while (M.length % blockSize != 0)
			M.push(0);

		// Encrypt each block
		for (var offset = 0; offset < M.length; offset += blockSize)
			cipher._EncryptBlock(M, offset);

	},

	decrypt: function (cipher, C, IV) {

		// Decrypt each block
		for (var offset = 0; offset < C.length; offset += cipher._BlockSize * 4)
			cipher._DecryptBlock(C, offset);

		// Strip padding
		do { var popped = C.pop(); } while (popped != 0x80);

	}

};
