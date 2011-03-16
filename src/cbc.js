Crypto.mode.CBC = {

	encrypt: function (cipher, m, iv) {

		// Pad
		m.push(0x80);

		var blocksize = cipher._blocksize,
		    mWords = Crypto.util.bytesToWords(m);

		iv = Crypto.util.bytesToWords(iv);

		// Encrypt each block
		for (var offset = 0; offset < mWords.length; offset += blocksize) {

			if (offset == 0) {
				// XOR first block using IV
				for (var i = 0; i < blocksize; i++)
					mWords[i] ^= iv[i];
			}
			else {
				// XOR this block using previous crypted block
				for (var i = 0; i < blocksize; i++)
					mWords[offset + i] ^= mWords[offset + i - blocksize];
			}

			// Encrypt block
			cipher._encryptblock(mWords, offset);

		}

		return Crypto.util.wordsToBytes(mWords);

	},

	decrypt: function (cipher, c, iv) {

		var blocksize = cipher._blocksize,
		    cWords = Crypto.util.bytesToWords(c);

		iv = Crypto.util.bytesToWords(iv);

		// Decrypt each block
		for (var offset = 0; offset < cWords.length; offset += blocksize) {

			// Save this crypted block
			var thisCryptedBlock = cWords.slice(offset, offset + blocksize);

			// Decrypt block
			cipher._decryptblock(cWords, offset);

			if (offset == 0) {
				// XOR first block using IV
				for (var i = 0; i < blocksize; i++)
					cWords[i] ^= iv[i];
			}
			else {
				// XOR decrypted block using previous crypted block
				for (var i = 0; i < blocksize; i++)
					cWords[offset + i] ^= prevCryptedBlock[i];
			}

			// This crypted block is the new previous crypted block
			var prevCryptedBlock = thisCryptedBlock;

		}

		var m = Crypto.util.wordsToBytes(cWords)

		// Strip padding
		while (m.pop() != 0x80) ;

		return m;

	}

};
