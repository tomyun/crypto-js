(function(){

// Shortcuts
var C = Crypto,
    enc = C.enc,
    UTF8 = enc.UTF8,
    Words = enc.Words,
    WordArray = C.type.WordArray;

C.PBKDF2 = function(password, salt, keyLength, options) {

	// Defaults
	var hasher = options && options.hasher || C.SHA1,
	    iterations = options && options.iterations || 1,
	    output = options && options.output || enc.Hex;

	// Convert to words, else assume words already
	var p = password.constructor == String ? UTF8.decode(password) : password,
	    s = salt.constructor == String ? UTF8.decode(salt) : salt;

	// Generate key
	var derivedKeyWords = [],
	    blockIndex = 1;

	while (derivedKeyWords.length * 4 < keyLength) {

		var block = PRF(hasher, p, WordArray.concat(s, [blockIndex]));

		// Iterations
		for (var u = block, i = 1; i < iterations; i++) {
			u = PRF(hasher, p, u);
			for (var j = 0; j < block.length; j++) block[j] ^= u[j];
		}

		derivedKeyWords = derivedKeyWords.concat(block);
		blockIndex++;

	}

	// Ignore excess bytes
	WordArray.setSigBytes(derivedKeyWords, keyLength);

	return output.encode(derivedKeyWords);

};

// Pseudo-random function
function PRF(hasher, password, salt) {
	return C.HMAC(hasher, salt, password, { output: Words });
}

})();
