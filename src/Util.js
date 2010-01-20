(function(){

var util = Crypto.util = {

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

})();
