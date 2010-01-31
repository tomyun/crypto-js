(function(){

// Shortcuts
var C = Crypto,
    enc = C.enc,
    UTF8 = enc.UTF8,
    Words = enc.Words,
    WordArray = C.type.WordArray;

C.HMAC = function(hasher, message, key, options) {

	// Convert to words, else assume words already
	var m = message.constructor == String ? UTF8.decode(message) : message,
	    k = key.constructor == String ? UTF8.decode(key) : key;

	// Allow arbitrary length keys
	if (k.length > hasher._blockSize) {
		k = hasher(k, { output: Words });
	}

	// XOR keys with pad constants
	for (var oKey = k.slice(0), iKey = k.slice(0), i = 0; i < hasher._blockSize; i++) {
		oKey[i] ^= 0x5C5C5C5C;
		iKey[i] ^= 0x36363636;
	}

	// Hash
	var hmacWords = hasher(WordArray.concat(oKey, hasher(WordArray.concat(iKey, m), { output: Words })), { output: Words });

	// Set default output
	var output = options && options.output || enc.Hex;

	// Return encoded output
	return output.encode(hmacWords);

};

})();
