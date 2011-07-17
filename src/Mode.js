/*!
 * Crypto-JS contribution from Simon Greatrix
 */

(function(){

// Shortcuts
var C = Crypto,
    C_pad = C.pad;

// Create mode namespace
var C_mode = C.mode = {};

/**
 * Mode base "class".
 */
var Mode = C_mode.Mode = function (padding) {
    if (padding) {
        this._padding = padding;
    }
};

Mode.prototype = {
    encrypt: function (cipher, m, iv) {
        this._padding.pad(cipher, m);
        this._doEncrypt(cipher, m, iv);
    },

    decrypt: function (cipher, m, iv) {
        this._doDecrypt(cipher, m, iv);
        this._padding.unpad(m);
    },

    // Default padding
    _padding: C_pad.iso7816
};


/**
 * Electronic Code Book mode.
 * 
 * ECB applies the cipher directly against each block of the input.
 * 
 * ECB does not require an initialization vector.
 */
var ECB = C_mode.ECB = function () {
    // Call parent constructor
    Mode.apply(this, arguments);
};

// Inherit from Mode
var ECB_prototype = ECB.prototype = new Mode;

// Concrete steps for Mode template
ECB_prototype._doEncrypt = function (cipher, m, iv) {
    var blockSizeInBytes = cipher._blocksize * 4;
    // Encrypt each block
    for (var offset = 0; offset < m.length; offset += blockSizeInBytes) {
        cipher._encryptblock(m, offset);
    }
};
ECB_prototype._doDecrypt = function (cipher, c, iv) {
    var blockSizeInBytes = cipher._blocksize * 4;
    // Decrypt each block
    for (var offset = 0; offset < c.length; offset += blockSizeInBytes) {
        cipher._decryptblock(c, offset);
    }
};

// ECB never uses an IV
ECB_prototype.fixOptions = function (options) {
    options.iv = [];
};


/**
 * Cipher block chaining
 * 
 * The first block is XORed with the IV. Subsequent blocks are XOR with the
 * previous cipher output.
 */
var CBC = C_mode.CBC = function () {
    // Call parent constructor
    Mode.apply(this, arguments);
};

// Inherit from Mode
var CBC_prototype = CBC.prototype = new Mode;

// Concrete steps for Mode template
CBC_prototype._doEncrypt = function (cipher, m, iv) {
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
};
CBC_prototype._doDecrypt = function (cipher, c, iv) {
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
};


/**
 * Cipher feed back
 * 
 * The cipher output is XORed with the plain text to produce the cipher output,
 * which is then fed back into the cipher to produce a bit pattern to XOR the
 * next block with.
 * 
 * This is a stream cipher mode and does not require padding.
 */
var CFB = C_mode.CFB = function () {
    // Call parent constructor
    Mode.apply(this, arguments);
};

// Inherit from Mode
var CFB_prototype = CFB.prototype = new Mode;

// Override padding
CFB_prototype._padding = C_pad.NoPadding;

// Concrete steps for Mode template
CFB_prototype._doEncrypt = function (cipher, m, iv) {
    var blockSizeInBytes = cipher._blocksize * 4,
        keystream = iv.slice(0);

    // Encrypt each byte
    for (var i = 0; i < m.length; i++) {

        var j = i % blockSizeInBytes;
        if (j == 0) cipher._encryptblock(keystream, 0);

        m[i] ^= keystream[j];
        keystream[j] = m[i];
    }
};
CFB_prototype._doDecrypt = function (cipher, c, iv) {
    var blockSizeInBytes = cipher._blocksize * 4,
        keystream = iv.slice(0);

    // Encrypt each byte
    for (var i = 0; i < c.length; i++) {

        var j = i % blockSizeInBytes;
        if (j == 0) cipher._encryptblock(keystream, 0);

        var b = c[i];
        c[i] ^= keystream[j];
        keystream[j] = b;
    }
};


/**
 * Output feed back
 * 
 * The cipher repeatedly encrypts its own output. The output is XORed with the
 * plain text to produce the cipher text.
 * 
 * This is a stream cipher mode and does not require padding.
 */
var OFB = C_mode.OFB = function () {
    // Call parent constructor
    Mode.apply(this, arguments);
};

// Inherit from Mode
var OFB_prototype = OFB.prototype = new Mode;

// Override padding
OFB_prototype._padding = C_pad.NoPadding;

// Concrete steps for Mode template
OFB_prototype._doEncrypt = function (cipher, m, iv) {

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
};
OFB_prototype._doDecrypt = OFB_prototype._doEncrypt;

})();