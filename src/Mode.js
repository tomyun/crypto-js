/*!
 * Crypto-JS contribution from Simon Greatrix
 */

(function(){

// Shortcuts
var C = Crypto,
    C_mode = C.mode;

/**
 * Combine a block mode with a padding scheme.
 */
var Mode = C_mode.Mode = function (mode, padding) {
	this.encryptBlock = mode.encryptBlock;
	this.decryptBlock = mode.decryptBlock;
	this.fixOptions = mode.fixOptions;
	this.name = mode.name;
	this.padding = padding;
	if( this.padding == null ) {
		this.padding = mode.defaultPadding;
	} else {
		this.name = mode.name + "/" + this.padding.name;
	}
};

Mode.prototype = {
	encrypt: function (cipher, m, iv) {
		this.padding.pad(cipher, m);
		this.encryptBlock(cipher, m, iv);
	},

	decrypt: function (cipher, m, iv) {
		this.decryptBlock(cipher, m, iv);
		this.padding.unpad(m);
	}
};

/**
 * Electronic Code Book mode.
 * 
 * ECB applies the cipher directly against each block of the input.
 * 
 * ECB does not require an initialization vector.
 */
C_mode.ECB = new Mode({
	name: "ECB",
	
	defaultPadding : Crypto.pad.iso7816,

    // There is no initialisation vector in ECB
	fixOptions : function (options) {
		options.iv = [];
	},
		
    encryptBlock: function (cipher, m, iv) {
        var blockSizeInBytes = cipher._blocksize * 4;
        // Encrypt each block
        for (var offset = 0; offset < m.length; offset += blockSizeInBytes) {
            cipher._encryptblock(m, offset);
        }
    },
    decryptBlock: function (cipher, c, iv) {
        var blockSizeInBytes = cipher._blocksize * 4;
        // Decrypt each block
        for (var offset = 0; offset < c.length; offset += blockSizeInBytes) {
            cipher._decryptblock(c, offset);
        }
    }
},null);


/**
 * Cipher block chaining
 * 
 * The first block is XORed with the IV. Subsequent blocks are XOR with the
 * previous cipher output.
 */
C_mode.CBC = new Mode({
	name : "CBC",
	
    defaultPadding : Crypto.pad.iso7816,
		
    encryptBlock: function (cipher, m, iv) {
        var blockSizeInBytes = cipher._blocksize * 4;

        // Encrypt each block
        for (var offset = 0; offset < m.length; offset += blockSizeInBytes) {
            if (offset == 0) {
                // XOR first block using IV
                for (var i = 0; i < blockSizeInBytes; i++)
                m[i] ^= iv[i];
            } else {
                // XOR this block using previous crypted block
                for (var i = 0; i < blockSizeInBytes; i++)
                m[offset + i] ^= m[offset + i - blockSizeInBytes];
            }
            // Encrypt block
            cipher._encryptblock(m, offset);
        }
    },

    decryptBlock: function (cipher, c, iv) {
        var blockSizeInBytes = cipher._blocksize * 4;

        // At the start, the previously crypted block is the IV
        var prevCryptedBlock = iv;
        
        // Decrypt each block
        for (var offset = 0; offset < c.length; offset += blockSizeInBytes) {
            // Save this crypted block
            var thisCryptedBlock = c.slice(offset, offset + blockSizeInBytes);
            // Decrypt block
            cipher._decryptblock(c, offset);
            // XOR decrypted block using previous crypted block
            for (var i = 0; i < blockSizeInBytes; i++) {
            	c[offset + i] ^= prevCryptedBlock[i];
            }
            prevCryptedBlock = thisCryptedBlock;
        }
    }
},null);


/**
 * Cipher feed back
 * 
 * The cipher output is XORed with the plain text to produce the cipher output,
 * which is then fed back into the cipher to produce a bit pattern to XOR the
 * next block with.
 * 
 * This is a stream cipher mode and does not require padding.
 */
C_mode.CFB = new Mode({
	name: "CFB",
	
	defaultPadding : Crypto.pad.NoPadding,
		
    encryptBlock: function (cipher, m, iv) {
        var blockSizeInBytes = cipher._blocksize * 4,
            keystream = iv.slice(0);

        // Encrypt each byte
        for (var i = 0; i < m.length; i++) {

            var j = i % blockSizeInBytes;
            if( j==0 ) cipher._encryptblock(keystream, 0);

            m[i] ^= keystream[j];
            keystream[j] = m[i];
        }                 
    },

    decryptBlock: function (cipher, c, iv) {
        var blockSizeInBytes = cipher._blocksize * 4,
            keystream = iv.slice(0);

        // Encrypt each byte
        for (var i = 0; i < c.length; i++) {

            var j = i % blockSizeInBytes;
            if( j==0 ) cipher._encryptblock(keystream, 0);

            var b = c[i];
            c[i] ^= keystream[j];
            keystream[j] = b;
        }                 
    }
},null);


/**
 * Output feed back
 * 
 * The cipher repeatedly encrypts its own output. The output is XORed with the
 * plain text to produce the cipher text.
 * 
 * This is a stream cipher mode and does not require padding.
 */
	Crypto.mode.OFB = new Crypto.mode.Mode({
		name: "OFB",
		defaultPadding: Crypto.pad.NoPadding,
		encryptBlock: OFB,
		decryptBlock: OFB
	}, null);

	// The mode function
	function OFB(cipher, m, iv) {

		var blockSizeInBytes = cipher._blocksize * 4,
		    keystream = iv.slice(0);

		// Encrypt each byte
		for (var i = 0; i < m.length; i++) {

			// Generate keystream
			if (i % blockSizeInBytes == 0)
				cipher._encryptblock(keystream, 0);

			// Encrypt byte
			m[i] ^= keystream[i % blockSizeInBytes];

		}
	}
})();