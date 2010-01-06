(function(){

// Shortcuts
var C = Crypto,
    util = C.util,
    charenc = C.charenc,
    UTF8 = charenc.UTF8,
    Binary = charenc.Binary;

// Compute Sbox
var SBOX = [],
    INVSBOX = [];

// Compute double table
for (var d = [], i = 0; i < 256; i++) {
	d[i] = i >= 128 ? i << 1 ^ 0x11b : i << 1
}

// Walk GF(2^8)
var x = 0, xi = 0;
while (1) {

	var sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
	sx = sx >>> 8 ^ sx & 0xFF ^ 0x63;

	SBOX[x] = sx;
	INVSBOX[sx] = x;

	var x2 = d[x],
	    x4 = d[x2],
	    x8 = d[x4];

	if (x == 5) {
		break;
	}
	else if (x) {
		x = x2 ^ d[d[d[x8 ^ x2]]];
		xi ^= d[d[xi]];
	}
	else {
		x = xi = 1;
	}

}

// Compute mulitplication in GF(2^8) lookup tables
var MULT2 = [],
    MULT3 = [],
    MULT9 = [],
    MULTB = [],
    MULTD = [],
    MULTE = [];

function xtime(a, b) {
	for (var result = 0, i = 0; i < 8; i++) {
		if (b & 1) result ^= a;
		var hiBitSet = a & 0x80;
		a = (a << 1) & 0xFF;
		if (hiBitSet) a ^= 0x1b;
		b >>>= 1;
	}
	return result;
}

for (var i = 0; i < 256; i++) {
	MULT2[i] = d[i];
	MULT3[i] = xtime(i,3);
	MULT9[i] = xtime(i,9);
	MULTB[i] = xtime(i,0xB);
	MULTD[i] = xtime(i,0xD);
	MULTE[i] = xtime(i,0xE);
}

var MULT2_SBOX = [],
    MULT3_SBOX = [];

for (var i = 0; i < 256; i++) {
	MULT2_SBOX[i] = MULT2[SBOX[i]];
	MULT3_SBOX[i] = MULT3[SBOX[i]];
}

// Precomputed RCon lookup
var RCON = [ 0x00000000, 0x01000000, 0x02000000, 0x04000000,
             0x08000000, 0x10000000, 0x20000000, 0x40000000,
             0x80000000, 0x1b000000, 0x36000000 ];

// Inner state
var state = [[], [], [], []],
    keylength,
    nrounds,
    keyschedule;

var AES = C.AES = {

	/**
	 * Public API
	 */

	encrypt: function (message, password, options) {

		var

		    // Convert to bytes
		    m = UTF8.stringToBytes(message),

		    // Generate random IV
		    iv = util.randomBytes(16),

		    // Generate key
		    k = password.constructor == String ?
		        // Derive key from passphrase
		        C.PBKDF2(password, iv, 32, { asBytes: true }) :
		        // else, assume byte array representing cryptographic key
		        password;

		// Determine mode
		mode = options && options.mode || C.mode.OFB;

		// Encrypt
		AES._init(k);
		var c = mode.encrypt(AES, m, iv);

		// Return ciphertext
		return /*util.bytesToBase64*/(iv.concat(c));

	},

	decrypt: function (ciphertext, password, options) {

		var

		    // Convert to bytes
		    c = util.base64ToBytes(ciphertext),

		    // Separate IV and message
		    iv = c.splice(0, 16),

		    // Generate key
		    k = password.constructor == String ?
		        // Derive key from passphrase
		        C.PBKDF2(password, iv, 32, { asBytes: true }) :
		        // else, assume byte array representing cryptographic key
		        password;

		// Determine mode
		mode = options && options.mode || C.mode.OFB;

		// Decrypt
		AES._init(k);
		var m = mode.decrypt(AES, c, iv);

		// Return plaintext
		return UTF8.bytesToString(m);

	},


	/**
	 * Package private methods and properties
	 */

	_blocksize: 4,

	_encryptblock: function (block, offset) {

		// Set input and add round key
		var s0 = block[0 + offset] ^ keyschedule[0];
		var s1 = block[1 + offset] ^ keyschedule[1];
		var s2 = block[2 + offset] ^ keyschedule[2];
		var s3 = block[3 + offset] ^ keyschedule[3];

		for (var ksrow = 4, round = 1; round < nrounds; round++) {

			// Temp copy
			var t0 = s0,
			    t1 = s1,
			    t2 = s2,
			    t3 = s3;

			// Shift rows
			s0 = (t0 & 0xFF000000) | (t1 & 0x00FF0000) | (t2 & 0x0000FF00) | (t3 & 0x000000FF);
			s1 = (t1 & 0xFF000000) | (t2 & 0x00FF0000) | (t3 & 0x0000FF00) | (t0 & 0x000000FF);
			s2 = (t2 & 0xFF000000) | (t3 & 0x00FF0000) | (t0 & 0x0000FF00) | (t1 & 0x000000FF);
			s3 = (t3 & 0xFF000000) | (t0 & 0x00FF0000) | (t1 & 0x0000FF00) | (t2 & 0x000000FF);

			// Sub bytes, mix columns, and add round key
			t0 = ((MULT2_SBOX[s0 >>> 24] ^ MULT3_SBOX[(s0 >>> 16) & 0xFF] ^ SBOX[(s0 >>> 8) & 0xFF]       ^ SBOX[s0 & 0xFF])       << 24) |
			     ((SBOX[s0 >>> 24]       ^ MULT2_SBOX[(s0 >>> 16) & 0xFF] ^ MULT3_SBOX[(s0 >>> 8) & 0xFF] ^ SBOX[s0 & 0xFF])       << 16) |
			     ((SBOX[s0 >>> 24]       ^ SBOX[(s0 >>> 16) & 0xFF]       ^ MULT2_SBOX[(s0 >>> 8) & 0xFF] ^ MULT3_SBOX[s0 & 0xFF]) <<  8) |
			      (MULT3_SBOX[s0 >>> 24] ^ SBOX[(s0 >>> 16) & 0xFF]       ^ SBOX[(s0 >>> 8) & 0xFF]       ^ MULT2_SBOX[s0 & 0xFF]);
			t1 = ((MULT2_SBOX[s1 >>> 24] ^ MULT3_SBOX[(s1 >>> 16) & 0xFF] ^ SBOX[(s1 >>> 8) & 0xFF]       ^ SBOX[s1 & 0xFF])       << 24) |
			     ((SBOX[s1 >>> 24]       ^ MULT2_SBOX[(s1 >>> 16) & 0xFF] ^ MULT3_SBOX[(s1 >>> 8) & 0xFF] ^ SBOX[s1 & 0xFF])       << 16) |
			     ((SBOX[s1 >>> 24]       ^ SBOX[(s1 >>> 16) & 0xFF]       ^ MULT2_SBOX[(s1 >>> 8) & 0xFF] ^ MULT3_SBOX[s1 & 0xFF]) <<  8) |
			      (MULT3_SBOX[s1 >>> 24] ^ SBOX[(s1 >>> 16) & 0xFF]       ^ SBOX[(s1 >>> 8) & 0xFF]       ^ MULT2_SBOX[s1 & 0xFF]);
			t2 = ((MULT2_SBOX[s2 >>> 24] ^ MULT3_SBOX[(s2 >>> 16) & 0xFF] ^ SBOX[(s2 >>> 8) & 0xFF]       ^ SBOX[s2 & 0xFF])       << 24) |
			     ((SBOX[s2 >>> 24]       ^ MULT2_SBOX[(s2 >>> 16) & 0xFF] ^ MULT3_SBOX[(s2 >>> 8) & 0xFF] ^ SBOX[s2 & 0xFF])       << 16) |
			     ((SBOX[s2 >>> 24]       ^ SBOX[(s2 >>> 16) & 0xFF]       ^ MULT2_SBOX[(s2 >>> 8) & 0xFF] ^ MULT3_SBOX[s2 & 0xFF]) <<  8) |
			      (MULT3_SBOX[s2 >>> 24] ^ SBOX[(s2 >>> 16) & 0xFF]       ^ SBOX[(s2 >>> 8) & 0xFF]       ^ MULT2_SBOX[s2 & 0xFF]);
			t3 = ((MULT2_SBOX[s3 >>> 24] ^ MULT3_SBOX[(s3 >>> 16) & 0xFF] ^ SBOX[(s3 >>> 8) & 0xFF]       ^ SBOX[s3 & 0xFF])       << 24) |
			     ((SBOX[s3 >>> 24]       ^ MULT2_SBOX[(s3 >>> 16) & 0xFF] ^ MULT3_SBOX[(s3 >>> 8) & 0xFF] ^ SBOX[s3 & 0xFF])       << 16) |
			     ((SBOX[s3 >>> 24]       ^ SBOX[(s3 >>> 16) & 0xFF]       ^ MULT2_SBOX[(s3 >>> 8) & 0xFF] ^ MULT3_SBOX[s3 & 0xFF]) <<  8) |
			      (MULT3_SBOX[s3 >>> 24] ^ SBOX[(s3 >>> 16) & 0xFF]       ^ SBOX[(s3 >>> 8) & 0xFF]       ^ MULT2_SBOX[s3 & 0xFF]);

			// Add round key
			s0 = t0 ^ keyschedule[ksrow++];
			s1 = t1 ^ keyschedule[ksrow++];
			s2 = t2 ^ keyschedule[ksrow++];
			s3 = t3 ^ keyschedule[ksrow++];

		}

		// Temp copy
		var t0 = s0,
		    t1 = s1,
		    t2 = s2,
		    t3 = s3;

		// Shift rows
		s0 = (t0 & 0xFF000000) | (t1 & 0x00FF0000) | (t2 & 0x0000FF00) | (t3 & 0x000000FF);
		s1 = (t1 & 0xFF000000) | (t2 & 0x00FF0000) | (t3 & 0x0000FF00) | (t0 & 0x000000FF);
		s2 = (t2 & 0xFF000000) | (t3 & 0x00FF0000) | (t0 & 0x0000FF00) | (t1 & 0x000000FF);
		s3 = (t3 & 0xFF000000) | (t0 & 0x00FF0000) | (t1 & 0x0000FF00) | (t2 & 0x000000FF);

		// Sub bytes
		s0 = (SBOX[s0 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xFF] << 16) | (SBOX[(s0 >>>  8) & 0xFF] <<  8) | SBOX[s0 & 0xFF];
		s1 = (SBOX[s1 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xFF] << 16) | (SBOX[(s1 >>>  8) & 0xFF] <<  8) | SBOX[s1 & 0xFF];
		s2 = (SBOX[s2 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xFF] << 16) | (SBOX[(s2 >>>  8) & 0xFF] <<  8) | SBOX[s2 & 0xFF];
		s3 = (SBOX[s3 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xFF] << 16) | (SBOX[(s3 >>>  8) & 0xFF] <<  8) | SBOX[s3 & 0xFF];

		// Set output and add round key
		block[0 + offset] = s0 ^ keyschedule[ksrow++];
		block[1 + offset] = s1 ^ keyschedule[ksrow++];
		block[2 + offset] = s2 ^ keyschedule[ksrow++];
		block[3 + offset] = s3 ^ keyschedule[ksrow++];

	},

	_decryptblock: function (c, offset) {

		// Set input and add round key
		for (var row = 0; row < 4; row++) {
			for (var col = 0; col < 4; col++) {
				state[row][col] = c[offset + col * 4 + row] ^ keyschedule[nrounds * 4 + col][row];
			}
		}

		for (var round = 1; round < nrounds; round++) {

			// Inv shift rows
			state[1].unshift(state[1].pop());
			state[2].push(state[2].shift());
			state[2].push(state[2].shift());
			state[3].push(state[3].shift());

			// Inv sub bytes and add round key
			for (var row = 0; row < 4; row++) {
				for (var col = 0; col < 4; col++) {
					state[row][col] = INVSBOX[state[row][col]] ^ keyschedule[(nrounds - round) * 4 + col][row];
				}
			}

			// Inv mix columns
			for (var col = 0; col < 4; col++) {

				var s0 = state[0][col],
				    s1 = state[1][col],
				    s2 = state[2][col],
				    s3 = state[3][col];

				state[0][col] = MULTE[s0] ^ MULTB[s1] ^ MULTD[s2] ^ MULT9[s3];
				state[1][col] = MULT9[s0] ^ MULTE[s1] ^ MULTB[s2] ^ MULTD[s3];
				state[2][col] = MULTD[s0] ^ MULT9[s1] ^ MULTE[s2] ^ MULTB[s3];
				state[3][col] = MULTB[s0] ^ MULTD[s1] ^ MULT9[s2] ^ MULTE[s3];

			}

		}

		// Inv shift rows
		state[1].unshift(state[1].pop());
		state[2].push(state[2].shift());
		state[2].push(state[2].shift());
		state[3].push(state[3].shift());

		// Inv sub bytes, add round key, and set output
		for (var row = 0; row < 4; row++) {
			for (var col = 0; col < 4; col++)
				c[offset + col * 4 + row] = INVSBOX[state[row][col]] ^ keyschedule[col][row];
		}

	},


	/**
	 * Private methods
	 */

	_init: function (k) {
		keylength = k.length / 4;
		nrounds = keylength + 6;
		AES._keyexpansion(k);
	},

	// Generate a key schedule
	_keyexpansion: function (k) {

		keyschedule = [];
		for (var row = 0; row < keylength; row++) {
			keyschedule[row] = (k[row * 4]     << 24) | (k[row * 4 + 1] << 16) |
			                   (k[row * 4 + 2] <<  8) |  k[row * 4 + 3];
		}

		for (var row = keylength; row < (nrounds + 1) * 4; row++) {

			var temp = keyschedule[row - 1];

			if (row % keylength == 0) {

				// Rot word
				temp = (temp << 8) | (temp >>> 24);

				// Sub word
				temp = (SBOX[ temp >>> 24] << 24) |
				       (SBOX[(temp >>> 16) & 0xFF] << 16) |
				       (SBOX[(temp >>>  8) & 0xFF] <<  8) |
				        SBOX[ temp & 0xFF];

				// Mix Rcon
				temp ^= RCON[row / keylength];

			} else if (keylength > 6 && row % keylength == 4) {

				// Sub word
				temp = (SBOX[ temp >>> 24] << 24) |
				       (SBOX[(temp >>> 16) & 0xFF] << 16) |
				       (SBOX[(temp >>>  8) & 0xFF] <<  8) |
				        SBOX[ temp & 0xFF];

			}

			keyschedule[row] = keyschedule[row - keylength] ^ temp;

		}

	}

};

})();
