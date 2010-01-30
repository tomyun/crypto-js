(function(){

// Shortcuts
var C = Crypto,
    WordArray = C.type.WordArray;

C.enc.Hex = {

	encode: function(words) {
		for (var sigBytes = WordArray.getSigBytes(words), hex = [], i = 0; i < sigBytes; i++) {
			var bite = (words[i >>> 2] >>> 24 - i % 4 * 8) & 0xFF;
			hex.push((bite >>> 4).toString(16));
			hex.push((bite & 0xF).toString(16));
		}
		return hex.join("");
	},

	decode: function(hex) {
		for (var words = [], i = 0; i < hex.length; i += 2) {
			words[i >>> 3] |= parseInt(hex.substr(i, 2), 16) << 24 - i % 8 * 4;
		}
		WordArray.setSigBytes(words, hex.length / 2);
		return words;
	}

};

})();
