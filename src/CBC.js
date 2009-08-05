Crypto.mode.CBC = {

	encrypt: function (cipher, M, IV) {

		var blockSizeInBytes = cipher._BlockSize * 4;

		// Pad
		M.push(0x80);

		// Encrypt each block
		for (var offset = 0; offset < M.length; offset += blockSizeInBytes) {

			if (offset == 0) {
				// XOR IV with first block
				for (var i = 0; i < blockSizeInBytes; i++)
					M[i] ^= IV[i];
			}
			else {
				// XOR this block with previous crypted block
				for (var i = 0; i < blockSizeInBytes; i++)
					M[offset + i] ^= M[offset + i - blockSizeInBytes];
			}

			// Encrypt block
			cipher._EncryptBlock(M, offset);

		}

	},

	decrypt: function (cipher, C, IV) {

		var blockSizeInBytes = cipher._BlockSize * 4;

		// Decrypt each block
		for (var offset = 0; offset < C.length; offset += blockSizeInBytes) {

			// Save this crypted block
			var thisCryptedBlock = C.slice(offset, offset + blockSizeInBytes);

			// Decrypt block
			cipher._DecryptBlock(C, offset);

			if (offset == 0) {
				// XOR IV with first block
				for (var i = 0; i < blockSizeInBytes; i++)
					C[i] ^= IV[i];
			}
			else {
				// XOR decrypted block with previous crypted block
				for (var i = 0; i < blockSizeInBytes; i++)
					C[offset + i] ^= prevCryptedBlock[i];
			}

			// This crypted block is the new previou crypted block
			var prevCryptedBlock = thisCryptedBlock;

		}

		// Strip padding
		while (C.pop() != 0x80) ;

	}

};
