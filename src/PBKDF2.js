(function(){

// Shortcut
var util = Crypto.util;

Crypto.PBKDF2 = function (password, salt, keylen, options) {

	// Defaults
	var hasher = options && options.hasher || Crypto.SHA1,
	    iterations = options && options.iterations || 1;

	// Pseudo-random function
	function prf(password, salt) {
		return Crypto.HMAC(hasher, password, salt, { asBytes: true });
	}

	// Generate key
	var derivedKeyBytes = [],
	    blockindex = 1;
	while (derivedKeyBytes.length < keylen) {

		var block = prf(password, salt + util.bytesToString(
		                          util.wordsToBytes([blockindex]))),
		    u = block;
		for (var i = 1; i < iterations; i++) {
			u = prf(password, util.bytesToString(u));
			for (var j = 0; j < block.length; j++) block[j] ^= u[j];
		}

		derivedKeyBytes = derivedKeyBytes.concat(block);
		blockindex++;

	}

	// Truncate excess bytes
	derivedKeyBytes.splice(keylen);

	return options && options.asBytes ? derivedKeyBytes :
	       options && options.asString ? util.bytesToString(derivedKeyBytes) :
	       util.bytesToHex(derivedKeyBytes);

};

})();
