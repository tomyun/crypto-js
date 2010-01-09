(function() {

/* Global crypto object
----------------------------------------------------------------------------- */
var C = window.Crypto = {};

/* Crypto utilities
----------------------------------------------------------------------------- */
var util = C.util = {

	// Convert to unsigned 32-bit integer
	u32: function(n) {

		// If number given, convert to unsigned 32-bit
		if (n.constructor == Number) return n >>> 0;

		// Else, assume array and convert all items
		for (var i = 0; i < n.length; i++) n[i] = util.u32(n[i]);
		return n;

	},

	// Unsigned 32-bit addition
	add: function() {
		var result = util.u32(arguments[0]);
		for (var i = 1; i < arguments.length; i++) {
			result = util.u32(result + util.u32(arguments[i]));
		}
		return result;
	},

	// Unsigned 32-bit multiplication
	mult: function(a, b) {
		return util.add((a & 0xFFFF0000) * b,
		                (a & 0x0000FFFF) * b);
	},

	// Unsigned 32-bit greater than (>) comparison
	gt: function(a, b) {
		return util.u32(a) > util.u32(b);
	},

	// Unsigned 32-bit less than (<) comparison
	lt: function(a, b) {
		return util.u32(a) < util.u32(b);
	},

	// Bit-wise rotate left
	rotl: function(n, b) {
		return (n << b) | (n >>> (32 - b));
	},

	// Bit-wise rotate right
	rotr: function(n, b) {
		return (n << (32 - b)) | (n >>> b);
	},

	// Swap big-endian to little-endian and vice versa
	endian: function(n) {

		// If number given, swap endian
		if (n.constructor == Number) {
			return (util.rotl(n, 8) & 0x00FF00FF) |
			       (util.rotr(n, 8) & 0xFF00FF00);
		}

		// Else, assume array and swap all items
		for (var i = 0; i < n.length; i++) {
			n[i] = util.endian(n[i]);
		}
		return n;

	},

	// Generate random words
	randomWords: function(n) {
		for (var words = []; n > 0; n--) {
			words.push(Math.floor(Math.random() * 0x100000000));
		}
		return words;
	}

};

/* Character encodings
----------------------------------------------------------------------------- */
var chr = C.chr = {};

/* Binary characters
-------------------------------------------------------------- */
var Binary = chr.Binary = {

	// Convert string to words
	stringToWords: function(str) {
		for (var words = [], i = 0; i < str.length; i++) {
			words[i >>> 2] |= str.charCodeAt(i) << (24 - (i % 4) * 8);
		}
		return words;
	},

	// Convert words to string
	wordsToString: function(words, strlen) {
		for (var str = [], i = 0; i < words.length * 4; i++) {
			str.push(String.fromCharCode((words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xFF));
		}
		if (strlen != undefined) str.length = strlen;
		return str.join("");
	}

};

/* UTF8 characters
-------------------------------------------------------------- */
var UTF8 = chr.UTF8 = {

	// Convert string to words
	stringToWords: function(str) {
		return Binary.stringToWords(unescape(encodeURIComponent(str)));
	},

	// Convert words to string
	wordsToString: function(words, strlen) {
		var str = decodeURIComponent(escape(Binary.wordsToString(words)));
		return strlen != undefined ? str.substr(0, strlen) : str;
	}

};

/* Data encodings
----------------------------------------------------------------------------- */
var enc = C.enc = {};

/* Hex
-------------------------------------------------------------- */
var Hex = enc.Hex = {

	encode: function(words) {
		for (var hex = [], i = 0; i < words.length * 4; i++) {
			var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xFF;
			hex.push((bite >>> 4).toString(16));
			hex.push((bite & 0xF).toString(16));
		}
		return hex.join("");
	},

	decode: function(hex) {
		for (var words = [], i = 0; i < hex.length; i += 8) {
			words.push(parseInt(hex.substr(i, 8), 16));
		}
		return words;
	}

};

/* Base64
-------------------------------------------------------------- */
var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var Base64 = enc.Base64 = {

	encode: function(words) {

		for(var b64str = [], i = 0; i < words.length * 4; i += 3) {

			var triplet = (((words[ i      >>> 2] >>> (24 - ( i      % 4) * 8)) & 0xFF) << 16) |
			              (((words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xFF) <<  8) |
			               ((words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xFF);

			for (var j = 0; j < 4; j++) {
				if (i * 8 + j * 6 <= words.length * 32) {
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

		return words;

	}

};

/* Block cipher mode namespace
----------------------------------------------------------------------------- */
C.mode = {};

})();
