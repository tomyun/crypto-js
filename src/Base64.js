(function () {

// Shortcuts
var C = Crypto;
var WordArray = C.types.WordArray;

// Base-64 encoding map
var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

C.enc.Base64 = {

	encode: function (words) {

		var sigBytes = WordArray.getSigBytes(words);
		var b64str = [];

		for(var i = 0; i < sigBytes; i += 3) {

			var triplet = (((words[(i    ) >>> 2] >>> (24 - ((i    ) % 4) * 8)) & 0xFF) << 16) |
			              (((words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xFF) <<  8) |
			              ( (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xFF);

			for (var j = 0; j < 4; j++) {
				if (i + j * 0.75 <= sigBytes) {
					b64str.push(b64map.charAt((triplet >>> (6 * (3 - j))) & 0x3F));
				} else {
					b64str.push("=");
				}
			}

		}

		return b64str.join("");

	},

	decode: function (b64str) {

		// Remove padding
		b64str = b64str.replace(/=+$/, "");

		var words = [];
		for (var i = 0, bites = 0; i < b64str.length; i++) {
			if (i % 4) {
				words[bites >>> 2] |= (((b64map.indexOf(b64str.charAt(i - 1)) << ((i % 4) * 2)) |
				                        (b64map.indexOf(b64str.charAt(i)) >>> (6 - (i % 4) * 2))) & 0xFF) << (24 - (bites % 4) * 8);
				bites++;
			}
		}
		WordArray.setSigBytes(words, bites);

		return words;

	}

};

})();
