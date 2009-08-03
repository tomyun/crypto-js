Crypto.AES = function () {

	// Shortcut
	var util = Crypto.util;

	// Precomputed Sbox
	var Sbox = [
		0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
		0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
		0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
		0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
		0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
		0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
		0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
		0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
		0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
		0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
		0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
		0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
		0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
		0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
		0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
		0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
	];

	// Compute inverse Sbox lookup table
	for (var InvSbox = [], i = 0; i < 256; i++) InvSbox[Sbox[i]] = i;

	// Precomputed RCon lookup
	var Rcon = [ 0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36 ];

	// Mulitplication by x in GF(2^8)
	function xtime(a, b) {

		var result = 0;

		for (var i = 0; i < 8; i++) {

			if (b & 1) result ^= a;

			var hiBitSet = a & 0x80;
			a = (a << 1) & 0xFF;
			if (hiBitSet) a ^= 0x1b;

			b >>>= 1;

		}

		return result;

	}

	// Compute mulitplication in GF(2^8) lookup tables
	var Mult2 = [], Mult3 = [], Mult9 = [], MultB = [], MultD = [], MultE = [];
	for (var i = 0; i < 256; i++) {
		Mult2[i] = xtime(i,2);
		Mult3[i] = xtime(i,3);
		Mult9[i] = xtime(i,9);
		MultB[i] = xtime(i,0xB);
		MultD[i] = xtime(i,0xD);
		MultE[i] = xtime(i,0xE);
	}

	// Inner state
	var State = [[], [], [], []],
	    KeyLength,
	    NRounds,
	    KeySchedule;

	return {

		/**
		 * Public API
		 */

		encrypt: function (message, key, mode) {

			// Convert to byte arrays
			var M = util.string_bytes(message),
			    K = util.string_bytes(key);

			// Generate random IV
			for (var IV = [], i = 0; i < this._BlockSize * 4; i++)
				IV.push(Math.floor(Math.random() * 256));

			// Determine mode
			mode = mode || Crypto.mode.OFB;

			// Encrypt
			this._Init(K);
			mode.encrypt(this, M, IV);

			// Return ciphertext
			return util.bytes_base64(IV.concat(M));

		},

		decrypt: function (ciphertext, key, mode) {

			// Convert to byte arrays
			var C = util.base64_bytes(ciphertext),
			    K = util.string_bytes(key);

			// Separate IV and message
			var IV = C.splice(0, this._BlockSize * 4);

			// Determine mode
			mode = mode || Crypto.mode.OFB;

			// Decrypt
			this._Init(K);
			mode.decrypt(this, C, IV);

			// Return plaintext
			return util.bytes_string(C);

		},


		/**
		 * Package private methods and properties
		 */

		_BlockSize: 4,

		_EncryptBlock: function (M, offset) {

			// Set input
			for (var row = 0; row < this._BlockSize; row++) {
				for (var col = 0; col < 4; col++)
					State[row][col] = M[offset + col * 4 + row];
			}

			// Add round key
			for (var row = 0; row < 4; row++) {
				for (var col = 0; col < 4; col++)
					State[row][col] ^= KeySchedule[col][row];
			}

			for (var round = 1; round < NRounds; round++) {

				// Sub bytes
				for (var row = 0; row < 4; row++) {
					for (var col = 0; col < 4; col++)
						State[row][col] = Sbox[State[row][col]];
				}

				// Shift rows
				State[1].push(State[1].shift());
				State[2].push(State[2].shift());
				State[2].push(State[2].shift());
				State[3].unshift(State[3].pop());

				// Mix columns
				for (var col = 0; col < 4; col++) {

					var s0 = State[0][col],
					    s1 = State[1][col],
					    s2 = State[2][col],
					    s3 = State[3][col];

					State[0][col] = Mult2[s0] ^ Mult3[s1] ^ s2 ^ s3;
					State[1][col] = s0 ^ Mult2[s1] ^ Mult3[s2] ^ s3;
					State[2][col] = s0 ^ s1 ^ Mult2[s2] ^ Mult3[s3];
					State[3][col] = Mult3[s0] ^ s1 ^ s2 ^ Mult2[s3];

				}

				// Add round key
				for (var row = 0; row < 4; row++) {
					for (var col = 0; col < 4; col++)
						State[row][col] ^= KeySchedule[round * 4 + col][row];
				}

			}

			// Sub bytes
			for (var row = 0; row < 4; row++) {
				for (var col = 0; col < 4; col++)
					State[row][col] = Sbox[State[row][col]];
			}

			// Shift rows
			State[1].push(State[1].shift());
			State[2].push(State[2].shift());
			State[2].push(State[2].shift());
			State[3].unshift(State[3].pop());

			// Add round key
			for (var row = 0; row < 4; row++) {
				for (var col = 0; col < 4; col++)
					State[row][col] ^= KeySchedule[NRounds * 4 + col][row];
			}

			// Set output
			for (var row = 0; row < this._BlockSize; row++) {
				for (var col = 0; col < 4; col++)
					M[offset + col * 4 + row] = State[row][col];
			}

		},

		_DecryptBlock: function (C, offset) {

			// Set input
			for (var row = 0; row < this._BlockSize; row++) {
				for (var col = 0; col < 4; col++)
					State[row][col] = C[offset + col * 4 + row];
			}

			// Add round key
			for (var row = 0; row < 4; row++) {
				for (var col = 0; col < 4; col++)
					State[row][col] ^= KeySchedule[NRounds * 4 + col][row];
			}

			for (var round = 1; round < NRounds; round++) {

				// Inv shift rows
				State[1].unshift(State[1].pop());
				State[2].push(State[2].shift());
				State[2].push(State[2].shift());
				State[3].push(State[3].shift());

				// Inv sub bytes
				for (var row = 0; row < 4; row++) {
					for (var col = 0; col < 4; col++)
						State[row][col] = InvSbox[State[row][col]];
				}

				// Add round key
				for (var row = 0; row < 4; row++) {
					for (var col = 0; col < 4; col++)
						State[row][col] ^= KeySchedule[(NRounds - round) * 4 + col][row];
				}

				// Inv mix columns
				for (var col = 0; col < 4; col++) {

					var s0 = State[0][col],
					    s1 = State[1][col],
					    s2 = State[2][col],
					    s3 = State[3][col];

					State[0][col] = MultE[s0] ^ MultB[s1] ^ MultD[s2] ^ Mult9[s3];
					State[1][col] = Mult9[s0] ^ MultE[s1] ^ MultB[s2] ^ MultD[s3];
					State[2][col] = MultD[s0] ^ Mult9[s1] ^ MultE[s2] ^ MultB[s3];
					State[3][col] = MultB[s0] ^ MultD[s1] ^ Mult9[s2] ^ MultE[s3];

				}

			}

			// Inv shift rows
			State[1].unshift(State[1].pop());
			State[2].push(State[2].shift());
			State[2].push(State[2].shift());
			State[3].push(State[3].shift());

			// Inv sub bytes
			for (var row = 0; row < 4; row++) {
				for (var col = 0; col < 4; col++)
					State[row][col] = InvSbox[State[row][col]];
			}

			// Add round key
			for (var row = 0; row < 4; row++) {
				for (var col = 0; col < 4; col++)
					State[row][col] ^= KeySchedule[col][row];
			}

			// Set output
			for (var row = 0; row < this._BlockSize; row++) {
				for (var col = 0; col < 4; col++)
					C[offset + col * 4 + row] = State[row][col];
			}

		},


		/**
		 * Internal methods and properties
		 */

		_Init: function (K) {
			KeyLength = K.length / 4;
			NRounds = KeyLength + 6;
			this._KeyExpansion(K);
		},

		/**
		 * Generate a key schedule
		 */
		_KeyExpansion: function (K) {

			KeySchedule = [];

			for (var row = 0; row < KeyLength; row++) {
				KeySchedule[row] = [
					K[row * 4],
					K[row * 4 + 1],
					K[row * 4 + 2],
					K[row * 4 + 3]
				];
			}

			for (var row = KeyLength; row < this._BlockSize * (NRounds + 1); row++) {

				var temp = [
					KeySchedule[row - 1][0],
					KeySchedule[row - 1][1],
					KeySchedule[row - 1][2],
					KeySchedule[row - 1][3]
				];

				if (row % KeyLength == 0) {

					// Rot word
					temp.push(temp.shift());

					// Sub word
					temp[0] = Sbox[temp[0]];
					temp[1] = Sbox[temp[1]];
					temp[2] = Sbox[temp[2]];
					temp[3] = Sbox[temp[3]];

					temp[0] ^= Rcon[row / KeyLength];

				} else if (KeyLength > 6 && row % KeyLength == 4) {

					// Sub word
					temp[0] = Sbox[temp[0]];
					temp[1] = Sbox[temp[1]];
					temp[2] = Sbox[temp[2]];
					temp[3] = Sbox[temp[3]];

				}

				KeySchedule[row] = [
					KeySchedule[row - KeyLength][0] ^ temp[0],
					KeySchedule[row - KeyLength][1] ^ temp[1],
					KeySchedule[row - KeyLength][2] ^ temp[2],
					KeySchedule[row - KeyLength][3] ^ temp[3]
				];

			}

		}

	};

}();
