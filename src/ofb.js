(function(){

// Shortcuts
var C = Crypto,
    util = C.util;

// Public API
C.mode.OFB = {
	encrypt: OFB,
	decrypt: OFB
};

// The mode function
function OFB(cipher, m, iv) {

	var blocksize = cipher._blocksize,
	    mWords = util.bytesToWords(m),
	    keystream = util.bytesToWords(iv);

	// Encrypt each word
	for (var i = 0; i < mWords.length; i++) {

		// Generate keystream
		if (i % blocksize == 0)
			cipher._encryptblock(keystream, 0);

		// Encrypt word
		mWords[i] ^= keystream[i % blocksize];

	}

	var c = util.wordsToBytes(mWords);
	c.length = m.length;

	return c;

}

})();
