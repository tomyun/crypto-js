(function(){

// Shortcuts
var C = Crypto,
    util = C.util,
    charenc = C.charenc,
    UTF8 = charenc.UTF8,
    Binary = charenc.Binary;

// Compute double table
for (var d = [], i = 0; i < 256; i++) {
	d[i] = i >= 128 ? i << 1 ^ 0x11b : i << 1
}

// Compute mulitplication in GF(2^8) lookup tables
var SBOX = [],
    INVSBOX = [],
    MULT2 = [],
    MULT3 = [],
    MULT9 = [],
    MULTB = [],
    MULTD = [],
    MULTE = [];
    MULT2_SBOX = [],
    MULT3_SBOX = [];

// Walk GF(2^8)
var x = 0, xi = 0;
for (var x = 0, xi = 0, i = 0; i < 256; i++) {

	var sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
	sx = sx >>> 8 ^ sx & 0xFF ^ 0x63;

	SBOX[x] = sx;
	INVSBOX[sx] = x;

	var x2 = d[x],
	    x4 = d[x2],
	    x8 = d[x4];

	MULT2[x] = x2;
	MULT3[x] = x2 ^ x;
	MULT9[x] = x8 ^ x;
	MULTB[x] = x8 ^ x2 ^ x;
	MULTD[x] = x8 ^ x4 ^ x;
	MULTE[x] = x8 ^ x4 ^ x2;

	if (x == 0) x = xi = 1;
	else {
		x = x2 ^ d[d[d[x8 ^ x2]]];
		xi ^= d[d[xi]];
	}

}

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
		var s0 = block[0 + offset] ^ keyschedule[0],
		    s1 = block[1 + offset] ^ keyschedule[1],
		    s2 = block[2 + offset] ^ keyschedule[2],
		    s3 = block[3 + offset] ^ keyschedule[3];

		for (var ksrow = 4, round = 1; round < nrounds; round++) {

			// Shift rows, sub bytes, mix columns, and add round key
			var t0 = (((MULT2_SBOX[s0 >>> 24] ^ MULT3_SBOX[(s1 >>> 16) & 0xFF] ^ SBOX[(s2 >>> 8) & 0xFF]       ^ SBOX[s3 & 0xFF])       << 24) |
			          ((SBOX[s0 >>> 24]       ^ MULT2_SBOX[(s1 >>> 16) & 0xFF] ^ MULT3_SBOX[(s2 >>> 8) & 0xFF] ^ SBOX[s3 & 0xFF])       << 16) |
			          ((SBOX[s0 >>> 24]       ^ SBOX[(s1 >>> 16) & 0xFF]       ^ MULT2_SBOX[(s2 >>> 8) & 0xFF] ^ MULT3_SBOX[s3 & 0xFF]) <<  8) |
			           (MULT3_SBOX[s0 >>> 24] ^ SBOX[(s1 >>> 16) & 0xFF]       ^ SBOX[(s2 >>> 8) & 0xFF]       ^ MULT2_SBOX[s3 & 0xFF])) ^ keyschedule[ksrow++],

			    t1 = (((MULT2_SBOX[s1 >>> 24] ^ MULT3_SBOX[(s2 >>> 16) & 0xFF] ^ SBOX[(s3 >>> 8) & 0xFF]       ^ SBOX[s0 & 0xFF])       << 24) |
			          ((SBOX[s1 >>> 24]       ^ MULT2_SBOX[(s2 >>> 16) & 0xFF] ^ MULT3_SBOX[(s3 >>> 8) & 0xFF] ^ SBOX[s0 & 0xFF])       << 16) |
			          ((SBOX[s1 >>> 24]       ^ SBOX[(s2 >>> 16) & 0xFF]       ^ MULT2_SBOX[(s3 >>> 8) & 0xFF] ^ MULT3_SBOX[s0 & 0xFF]) <<  8) |
			           (MULT3_SBOX[s1 >>> 24] ^ SBOX[(s2 >>> 16) & 0xFF]       ^ SBOX[(s3 >>> 8) & 0xFF]       ^ MULT2_SBOX[s0 & 0xFF])) ^ keyschedule[ksrow++],

			    t2 = (((MULT2_SBOX[s2 >>> 24] ^ MULT3_SBOX[(s3 >>> 16) & 0xFF] ^ SBOX[(s0 >>> 8) & 0xFF]       ^ SBOX[s1 & 0xFF])       << 24) |
			          ((SBOX[s2 >>> 24]       ^ MULT2_SBOX[(s3 >>> 16) & 0xFF] ^ MULT3_SBOX[(s0 >>> 8) & 0xFF] ^ SBOX[s1 & 0xFF])       << 16) |
			          ((SBOX[s2 >>> 24]       ^ SBOX[(s3 >>> 16) & 0xFF]       ^ MULT2_SBOX[(s0 >>> 8) & 0xFF] ^ MULT3_SBOX[s1 & 0xFF]) <<  8) |
			           (MULT3_SBOX[s2 >>> 24] ^ SBOX[(s3 >>> 16) & 0xFF]       ^ SBOX[(s0 >>> 8) & 0xFF]       ^ MULT2_SBOX[s1 & 0xFF])) ^ keyschedule[ksrow++],

			    t3 = (((MULT2_SBOX[s3 >>> 24] ^ MULT3_SBOX[(s0 >>> 16) & 0xFF] ^ SBOX[(s1 >>> 8) & 0xFF]       ^ SBOX[s2 & 0xFF])       << 24) |
			          ((SBOX[s3 >>> 24]       ^ MULT2_SBOX[(s0 >>> 16) & 0xFF] ^ MULT3_SBOX[(s1 >>> 8) & 0xFF] ^ SBOX[s2 & 0xFF])       << 16) |
			          ((SBOX[s3 >>> 24]       ^ SBOX[(s0 >>> 16) & 0xFF]       ^ MULT2_SBOX[(s1 >>> 8) & 0xFF] ^ MULT3_SBOX[s2 & 0xFF]) <<  8) |
			           (MULT3_SBOX[s3 >>> 24] ^ SBOX[(s0 >>> 16) & 0xFF]       ^ SBOX[(s1 >>> 8) & 0xFF]       ^ MULT2_SBOX[s2 & 0xFF])) ^ keyschedule[ksrow++];

			s0 = t0;
			s1 = t1;
			s2 = t2;
			s3 = t3;

		}

		// Shift rows, sub bytes, and add round key
		var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xFF] << 16) | (SBOX[(s2 >>>  8) & 0xFF] <<  8) | SBOX[s3 & 0xFF]) ^ keyschedule[ksrow++],
		    t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xFF] << 16) | (SBOX[(s3 >>>  8) & 0xFF] <<  8) | SBOX[s0 & 0xFF]) ^ keyschedule[ksrow++],
		    t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xFF] << 16) | (SBOX[(s0 >>>  8) & 0xFF] <<  8) | SBOX[s1 & 0xFF]) ^ keyschedule[ksrow++],
		    t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xFF] << 16) | (SBOX[(s1 >>>  8) & 0xFF] <<  8) | SBOX[s2 & 0xFF]) ^ keyschedule[ksrow++];

		// Set output
		block[0 + offset] = t0;
		block[1 + offset] = t1;
		block[2 + offset] = t2;
		block[3 + offset] = t3;

	},

	_decryptblock: function (block, offset) {

		var ksrow = nrounds * 4;

		// Set input and add round key
		var s0 = block[0 + offset] ^ keyschedule[ksrow++],
		    s1 = block[1 + offset] ^ keyschedule[ksrow++],
		    s2 = block[2 + offset] ^ keyschedule[ksrow++],
		    s3 = block[3 + offset] ^ keyschedule[ksrow++];

		for (var round = 1; round < nrounds; round++) {

			ksrow -= 8;

			// Inv shift rows, inv sub bytes, and add round key
			var t0 = ((INVSBOX[s0 >>> 24] << 24) | (INVSBOX[(s3 >>> 16) & 0xFF] << 16) | (INVSBOX[(s2 >>> 8) & 0xFF] << 8) | INVSBOX[s1 & 0xFF]) ^ keyschedule[ksrow++],
			    t1 = ((INVSBOX[s1 >>> 24] << 24) | (INVSBOX[(s0 >>> 16) & 0xFF] << 16) | (INVSBOX[(s3 >>> 8) & 0xFF] << 8) | INVSBOX[s2 & 0xFF]) ^ keyschedule[ksrow++],
			    t2 = ((INVSBOX[s2 >>> 24] << 24) | (INVSBOX[(s1 >>> 16) & 0xFF] << 16) | (INVSBOX[(s0 >>> 8) & 0xFF] << 8) | INVSBOX[s3 & 0xFF]) ^ keyschedule[ksrow++],
			    t3 = ((INVSBOX[s3 >>> 24] << 24) | (INVSBOX[(s2 >>> 16) & 0xFF] << 16) | (INVSBOX[(s1 >>> 8) & 0xFF] << 8) | INVSBOX[s0 & 0xFF]) ^ keyschedule[ksrow++];

			// Inv mix columns
			s0 = ((MULTE[t0 >>> 24] ^ MULTB[(t0 >>> 16) & 0xFF] ^ MULTD[(t0 >>> 8) & 0xFF] ^ MULT9[t0 & 0xFF]) << 24) |
			     ((MULT9[t0 >>> 24] ^ MULTE[(t0 >>> 16) & 0xFF] ^ MULTB[(t0 >>> 8) & 0xFF] ^ MULTD[t0 & 0xFF]) << 16) |
			     ((MULTD[t0 >>> 24] ^ MULT9[(t0 >>> 16) & 0xFF] ^ MULTE[(t0 >>> 8) & 0xFF] ^ MULTB[t0 & 0xFF]) <<  8) |
			      (MULTB[t0 >>> 24] ^ MULTD[(t0 >>> 16) & 0xFF] ^ MULT9[(t0 >>> 8) & 0xFF] ^ MULTE[t0 & 0xFF]);

			s1 = ((MULTE[t1 >>> 24] ^ MULTB[(t1 >>> 16) & 0xFF] ^ MULTD[(t1 >>> 8) & 0xFF] ^ MULT9[t1 & 0xFF]) << 24) |
			     ((MULT9[t1 >>> 24] ^ MULTE[(t1 >>> 16) & 0xFF] ^ MULTB[(t1 >>> 8) & 0xFF] ^ MULTD[t1 & 0xFF]) << 16) |
			     ((MULTD[t1 >>> 24] ^ MULT9[(t1 >>> 16) & 0xFF] ^ MULTE[(t1 >>> 8) & 0xFF] ^ MULTB[t1 & 0xFF]) <<  8) |
			      (MULTB[t1 >>> 24] ^ MULTD[(t1 >>> 16) & 0xFF] ^ MULT9[(t1 >>> 8) & 0xFF] ^ MULTE[t1 & 0xFF]);

			s2 = ((MULTE[t2 >>> 24] ^ MULTB[(t2 >>> 16) & 0xFF] ^ MULTD[(t2 >>> 8) & 0xFF] ^ MULT9[t2 & 0xFF]) << 24) |
			     ((MULT9[t2 >>> 24] ^ MULTE[(t2 >>> 16) & 0xFF] ^ MULTB[(t2 >>> 8) & 0xFF] ^ MULTD[t2 & 0xFF]) << 16) |
			     ((MULTD[t2 >>> 24] ^ MULT9[(t2 >>> 16) & 0xFF] ^ MULTE[(t2 >>> 8) & 0xFF] ^ MULTB[t2 & 0xFF]) <<  8) |
			      (MULTB[t2 >>> 24] ^ MULTD[(t2 >>> 16) & 0xFF] ^ MULT9[(t2 >>> 8) & 0xFF] ^ MULTE[t2 & 0xFF]);

			s3 = ((MULTE[t3 >>> 24] ^ MULTB[(t3 >>> 16) & 0xFF] ^ MULTD[(t3 >>> 8) & 0xFF] ^ MULT9[t3 & 0xFF]) << 24) |
			     ((MULT9[t3 >>> 24] ^ MULTE[(t3 >>> 16) & 0xFF] ^ MULTB[(t3 >>> 8) & 0xFF] ^ MULTD[t3 & 0xFF]) << 16) |
			     ((MULTD[t3 >>> 24] ^ MULT9[(t3 >>> 16) & 0xFF] ^ MULTE[(t3 >>> 8) & 0xFF] ^ MULTB[t3 & 0xFF]) <<  8) |
			      (MULTB[t3 >>> 24] ^ MULTD[(t3 >>> 16) & 0xFF] ^ MULT9[(t3 >>> 8) & 0xFF] ^ MULTE[t3 & 0xFF]);

		}

		ksrow -= 8;

		// Inv shift rows, inv sub bytes, and add round key
		var t0 = ((INVSBOX[s0 >>> 24] << 24) | (INVSBOX[(s3 >>> 16) & 0xFF] << 16) | (INVSBOX[(s2 >>> 8) & 0xFF] << 8) | INVSBOX[s1 & 0xFF]) ^ keyschedule[ksrow++],
		    t1 = ((INVSBOX[s1 >>> 24] << 24) | (INVSBOX[(s0 >>> 16) & 0xFF] << 16) | (INVSBOX[(s3 >>> 8) & 0xFF] << 8) | INVSBOX[s2 & 0xFF]) ^ keyschedule[ksrow++],
		    t2 = ((INVSBOX[s2 >>> 24] << 24) | (INVSBOX[(s1 >>> 16) & 0xFF] << 16) | (INVSBOX[(s0 >>> 8) & 0xFF] << 8) | INVSBOX[s3 & 0xFF]) ^ keyschedule[ksrow++],
		    t3 = ((INVSBOX[s3 >>> 24] << 24) | (INVSBOX[(s2 >>> 16) & 0xFF] << 16) | (INVSBOX[(s1 >>> 8) & 0xFF] << 8) | INVSBOX[s0 & 0xFF]) ^ keyschedule[ksrow++];

		// Set output
		block[0 + offset] = t0;
		block[1 + offset] = t1;
		block[2 + offset] = t2;
		block[3 + offset] = t3;

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
