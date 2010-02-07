(function () {

// Shortcuts
var C = Crypto;
var UTF8 = C.enc.UTF8;
var Words = C.enc.Words;
var WordArray = C.types.WordArray;

C["PBKDF2"] = function (password, salt, keyLength, options) {

	// Defaults
	var hasher = options && options["hasher"] || C["SHA1"];
	var iterations = options && options["iterations"] || 1;

	// Convert to words, else assume words already
	var p = password.constructor == String ? UTF8.decode(password) : password;
	var s = salt.constructor == String ? UTF8.decode(salt) : salt;

	// Generate key
	var derivedKeyWords = [];
	var blockIndex = 1;
	while (derivedKeyWords.length * 4 < keyLength) {

		var block = C["HMAC"](hasher, WordArray.cat(s, [blockIndex]), p, { "output": Words });

		// Iterations
		var u = block;
		for (var i = 1; i < iterations; i++) {
			u = C["HMAC"](hasher, u, p, { "output": Words });
			for (var j = 0; j < block.length; j++) {
				block[j] ^= u[j];
			}
		}

		derivedKeyWords = derivedKeyWords.concat(block);
		blockIndex++;

	}

	// Ignore excess bytes
	WordArray.setSigBytes(derivedKeyWords, keyLength);

	// Set default output
	var output = options && options["output"] || C.enc.Hex;

	return output.encode(derivedKeyWords);

};

})();
