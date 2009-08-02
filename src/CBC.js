Crypto.mode.CBC = {

	encrypt: function (cipher, M, IV) {

		var blockSize = cipher._BlockSize * 4;

		// Pad
		M.push(0x80);
		while (M.length % blockSize != 0)
			M.push(0);

		// Encrypt each block
		for (var offset = 0; offset < M.length; offset += blockSize) {

			if (offset == 0) {
				// XOR IV with first block
				for (var i = 0; i < blockSize; i++)
					M[i] ^= IV[i];
			}
			else {
				// XOR this block with previous crypted block
				for (var i = 0; i < blockSize; i++)
					M[offset + i] ^= M[offset + i - blockSize];
			}

			// Encrypt block
			cipher._EncryptBlock(M, offset);

		}

	},

	decrypt: function (cipher, C, IV) {

		var blockSize = cipher._BlockSize * 4;

		// Decrypt each block
		for (var offset = 0; offset < C.length; offset += blockSize) {

			// Save this crypted block
			var thisCryptedBlock = C.slice(offset, offset + blockSize);

			// Decrypt block
			cipher._DecryptBlock(C, offset);

			if (offset == 0) {
				// XOR IV with first block
				for (var i = 0; i < blockSize; i++)
					C[i] ^= IV[i];
			}
			else {
				// XOR decrypted block with previous crypted block
				for (var i = 0; i < blockSize; i++)
					C[offset + i] ^= prevCryptedBlock[i];
			}

			// This crypted block is the new previou crypted block
			var prevCryptedBlock = thisCryptedBlock;

		}

		// Strip padding
		do { var popped = C.pop(); } while (popped != 0x80);

	}

};
