(function(){

var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// Shortcut
var C = Crypto,
    WordArray = C.type.WordArray;

C.enc.Base64 = {

	encode: function(words) {

		for(var b64str = [], b = WordArray.getSignificantBytes(words), i = 0; i < b; i += 3) {

			var triplet = (((words[ i      >>> 2] >>> (24 - ( i      % 4) * 8)) & 0xFF) << 16) |
			              (((words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xFF) <<  8) |
			               ((words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xFF);

			for (var j = 0; j < 4; j++) {
				if (i * 8 + j * 6 <= WordArray.getSignificantBytes(words) * 8) {
					b64str.push(b64map.charAt((triplet >>> (6 * (3 - j))) & 0x3F));
				}
				else {
					b64str.push("=");
				}
			}

		}

		return b64str.join("");

	},

	decode: function(b64str) {

		// Remove padding
		b64str = b64str.replace(/=+$/, "");

		for (var words = [], b = 0, i = 0; i < b64str.length; i++) {
			if (i % 4) {
				words[b >>> 2] |= (((b64map.indexOf(b64str.charAt(i - 1)) << ((i % 4) * 2)) |
				                    (b64map.indexOf(b64str.charAt(i)) >>> (6 - (i % 4) * 2))) & 0xFF) << (24 - (b % 4) * 8);
				b++;
			}
		}

		WordArray.setSignificantBytes(words, Math.floor(b64str.length * 0.75));

		return words;

	}

};

})();
