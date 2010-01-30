(function(){

/* Crypto namespaces
----------------------------------------------------------------------------- */
var C = window.Crypto = {
	enc:  {},
	type: {},
	mode: {}
};

// Shortcuts
var enc = C.enc,
    type = C.type;

/* Word array
----------------------------------------------------------------------------- */
var WordArray = type.WordArray = {

	// Get significant bytes
	getSigBytes: function(words) {
		return words._Crypto && words._Crypto.sigBytes != undefined ?
		       words._Crypto.sigBytes : words.length * 4;
	},

	// Set significant bytes
	setSigBytes: function(words, n) {
		words._Crypto = { sigBytes: n };
	},

	// Concatenate word arrays
	concat: function(w1, w2) {
		return ByteStr.decode(ByteStr.encode(w1) + ByteStr.encode(w2));
	}

};

/* Byte string
----------------------------------------------------------------------------- */
var ByteStr = enc.ByteStr = {

	encode: function(words) {
		for (var sigBytes = WordArray.getSigBytes(words), str = [], i = 0; i < sigBytes; i++) {
			str.push(String.fromCharCode((words[i >>> 2] >>> 24 - i % 4 * 8) & 0xFF));
		}
		return str.join("");
	},

	decode: function(str) {
		for (var words = [], i = 0; i < str.length; i++) {
			words[i >>> 2] |= str.charCodeAt(i) << 24 - i % 4 * 8;
		}
		WordArray.setSigBytes(words, str.length);
		return words;
	}

};

/* UTF8 byte string
----------------------------------------------------------------------------- */
enc.UTF8 = {

	encode: function(words) {
		return decodeURIComponent(escape(ByteStr.encode(words)));
	},

	decode: function(str) {
		return ByteStr.decode(unescape(encodeURIComponent(str)));
	}

};

/* Words
----------------------------------------------------------------------------- */
enc.Words = {
	encode: function(words) { return words; },
	decode: function(words) { return words; }
};

})();
