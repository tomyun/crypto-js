(function(){

// Shortcuts
var C = Crypto,
    util = C.util,
    charenc = C.charenc,
    UTF8 = charenc.UTF8,
    Binary = charenc.Binary;

Crypto.HMAC = function (hasher, message, key, options) {

	// Allow arbitrary length keys
	var keybytes = UTF8.stringToBytes(key);
	if (keybytes.length > hasher._blocksize * 4)
		keybytes = hasher(key, { asBytes: true });

	// XOR keys with pad constants
	var okey = keybytes,
	    ikey = keybytes.slice(0);
	for (var i = 0; i < hasher._blocksize * 4; i++) {
		okey[i] ^= 0x5C;
		ikey[i] ^= 0x36;
	}

	var hmacbytes =
		hasher(
			Binary.bytesToString(okey) +
			hasher(
				Binary.bytesToString(ikey) + message,
				{ asString: true }
			),
			{ asBytes: true }
		);

	return options && options.asBytes ? hmacbytes :
	       options && options.asString ? Binary.bytesToString(hmacbytes) :
	       util.bytesToHex(hmacbytes);

};

})();
