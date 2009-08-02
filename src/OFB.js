Crypto.mode.OFB = function () {

	function OFB(cipher, M, IV) {

		var blockSize = cipher._BlockSize * 4,
		    keystream = IV.slice(0);

		// Encrypt each byte
		for (var i = 0; i < M.length; i++) {

			// Generate keystream
			if (i % blockSize == 0) cipher._EncryptBlock(keystream, 0);

			// Encrypt byte
			M[i] ^= keystream[i % blockSize];

		}

	}

	return {
		encrypt: OFB,
		decrypt: OFB
	};

}();
