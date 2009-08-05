(function(){

// Public API
Crypto.mode.OFB = {
	encrypt: OFB,
	decrypt: OFB
};

// The mode function
function OFB(cipher, M, IV) {

	var blockSizeInBytes = cipher._BlockSize * 4,
	    keystream = IV.slice(0);

	// Encrypt each byte
	for (var i = 0; i < M.length; i++) {

		// Generate keystream
		if (i % blockSizeInBytes == 0)
			cipher._EncryptBlock(keystream, 0);

		// Encrypt byte
		M[i] ^= keystream[i % blockSizeInBytes];

	}

}

})();
