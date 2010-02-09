(function () {

// Shortcuts
var C = Crypto;
var UTF8 = C.enc.UTF8;
var Words = C.enc.Words;
var WordArray = C.types.WordArray;

C.HMAC = function (hasher, message, key, options) {

	// Convert to words, else assume words already
	var m = message.constructor == String ? UTF8.decode(message) : message;
	var k = key.constructor == String ? UTF8.decode(key) : key;

	// Allow arbitrary length keys
	if (k.length > hasher.blockSize) {
		k = hasher(k, { output: Words });
	}

	// XOR keys with pad constants
	var oKey = k.slice(0);
	var iKey = k.slice(0);
	for (var i = 0; i < hasher.blockSize; i++) {
		oKey[i] ^= 0x5C5C5C5C;
		iKey[i] ^= 0x36363636;
	}

	// Hash
	var hmacWords = hasher(WordArray.cat(oKey, hasher(WordArray.cat(iKey, m), { output: Words })), { output: Words });

	// Set default output
	var output = options && options.output || C.enc.Hex;

	// Return encoded output
	return output.encode(hmacWords);

};

})();
