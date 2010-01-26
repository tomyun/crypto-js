(function(){

// Shortcuts
var C = Crypto,
    enc = C.enc,
    UTF8 = enc.UTF8,
    Hex = enc.Hex,
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
	for (var okey = k.slice(0), ikey = k.slice(0), i = 0; i < hasher._blockSize; i++) {
		okey[i] ^= 0x5C5C5C5C;
		ikey[i] ^= 0x36363636;
	}

	// Hash
	var hmacWords = hasher(okey.concat(hasher(WordArray.concat(ikey, m), { output: Words })), { output: Words });

	// Set default output
	var output = options && options.output || Hex;

	// Return encoded output
	return output.encode(hmacWords);

};

})();
