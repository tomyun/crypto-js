(function(){

// Shortcut
var util = Crypto.util;

Crypto.PBKDF2 = function (password, salt, keylen, options) {

	// Defaults
	var hasher = options && options.hasher || Crypto.SHA256,
	    iterations = options && options.iterations || 1;

	// Pseudo-random function
	var prf = function (password, salt) {
		return Crypto.HMAC(hasher, password, salt, { asBytes: true });
	};

	var derivedkey = "",
	    blockindex = 1;
	while (derivedkey.length < keylen) {

		var block = prf(password, salt + util.bytesToString(
		                                 util.wordsToBytes([blockindex])));
		for (var i = 1; i < iterations; i++) {
			var t = prf(password, util.bytesToString(block));
			for (var j = 0; j < block.length; j++) block[j] ^= t[j];
		}

		derivedkey += util.bytesToString(block);
		blockindex++;

	}

	return derivedkey.substr(0, keylen);

};

})();
