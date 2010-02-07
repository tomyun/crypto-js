(function () {

/* Global crypto object
 ---------------------------------------------------------------------------- */
var C = Crypto = {};

/* Types
 ---------------------------------------------------------------------------- */
var types = C.types = {};

/* Word arrays
 ------------------------------------------------------------- */
var WordArray = types.WordArray = {

	// Get significant bytes
	getSigBytes: function (words) {
		if (words["_Crypto"] && words["_Crypto"].sigBytes != undefined) {
			return words["_Crypto"].sigBytes;
		} else {
			return words.length * 4;
		}
	},

	// Set significant bytes
	setSigBytes: function (words, n) {
		words["_Crypto"] = { sigBytes: n };
	},

	// Concatenate word arrays
	cat: function (w1, w2) {
		return ByteStr.decode(ByteStr.encode(w1) + ByteStr.encode(w2));
	}

};

/* Encodings
 ---------------------------------------------------------------------------- */
var enc = C.enc = {};

/* Byte strings
 ------------------------------------------------------------- */
var ByteStr = enc.ByteStr = {

	encode: function (words) {

		var sigBytes = WordArray.getSigBytes(words);
		var str = [];

		for (var i = 0; i < sigBytes; i++) {
			str.push(String.fromCharCode((words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xFF));
		}

		return str.join("");

	},

	decode: function (str) {

		var words = [];

		for (var i = 0; i < str.length; i++) {
			words[i >>> 2] |= str.charCodeAt(i) << (24 - (i % 4) * 8);
		}
		WordArray.setSigBytes(words, str.length);

		return words;

	}

};

/* UTF8 strings
 ------------------------------------------------------------- */
enc.UTF8 = {

	encode: function (words) {
		return decodeURIComponent(escape(ByteStr.encode(words)));
	},

	decode: function (str) {
		return ByteStr.decode(unescape(encodeURIComponent(str)));
	}

};

/* Word arrays
 ------------------------------------------------------------- */
enc.Words = {
	encode: function (words) { return words; },
	decode: function (words) { return words; }
};

})();
