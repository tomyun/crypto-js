(function(){

/* Crypto namespaces
----------------------------------------------------------------------------- */
var C = window.Crypto = {
	enc:   {},
	mode:  {},
	type: {}
};

/* Word array
----------------------------------------------------------------------------- */
var WordArray = C.type.WordArray = {

	// Get significant bytes
	getSigBytes: function(words) {
		return words._Crypto && words._Crypto.sigBytes != undefined ?
		       words._Crypto.sigBytes : words.length * 4;
	},

	// Set significant bytes
	setSigBytes: function(words, n) {
		words._Crypto = { sigBytes: n };
	}

};

/* Byte string
----------------------------------------------------------------------------- */
var ByteStr = C.enc.ByteStr = {

	encode: function(words) {
		for (var str = [], b = WordArray.getSigBytes(words), i = 0; i < b; i++) {
			str.push(String.fromCharCode((words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xFF));
		}
		return str.join("");
	},

	decode: function(str) {
		for (var words = [], i = 0; i < str.length; i++) {
			words[i >>> 2] |= str.charCodeAt(i) << (24 - (i % 4) * 8);
		}
		WordArray.setSigBytes(words, str.length);
		return words;
	}

};

/* UTF8 byte string
----------------------------------------------------------------------------- */
var UTF8 = C.enc.UTF8 = {

	encode: function(words) {
		return decodeURIComponent(escape(ByteStr.encode(words)));
	},

	decode: function(str) {
		return ByteStr.decode(unescape(encodeURIComponent(str)));
	}

};

})();
