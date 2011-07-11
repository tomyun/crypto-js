/*!
 * Crypto-JS contribution from Simon Greatrix
 */


// Create pad name space
Crypto.pad = {};


// A Padding object must supply a pad method and a corresponding unpad method.
Crypto.pad.Padding = function (spec) {
	this.name = spec.name;
	this.pad = spec.pad;
	this.unpad = spec.unpad;
};


// Create padding schemes
(function () {

    // Calculate the number of padding bytes required.
    function _requiredPadding(cipher, message) {
        var blockSizeInBytes = cipher._blocksize * 4;
        var reqd = blockSizeInBytes - message.length % blockSizeInBytes;
        return reqd;
    };

    // Remove padding when the final byte gives the number of padding bytes.
    var _unpadLength = function (message) {
            var pad = message.pop();
            for (var i = 1; i < pad; i++) {
                message.pop();
            }
        };
    
    // No-operation padding, used for stream ciphers
    Crypto.pad.NoPadding = new Crypto.pad.Padding ({
    		name : "NoPadding",
    		pad : function (cipher,message) {},
    		unpad : function (message) {}
    	});

    // Zero Padding.
    //
    // If the message is not an exact number of blocks, the final block is
    // completed with 0x00 bytes. There is no unpadding.
    Crypto.pad.ZeroPadding = new Crypto.pad.Padding ({
    	name : "ZeroPad",
		pad : function (cipher, message) {
            var blockSizeInBytes = cipher._blocksize * 4;
            var reqd = message.length % blockSizeInBytes;
            if( reqd!=0 ) {                	
            	for(reqd = blockSizeInBytes - reqd; reqd>0; reqd--) {
                    message.push(0x00);                		
            	}
            }
        },
        
        unpad : function (message) {}
    });
    
    // ISO/IEC 7816-4 padding.
    //
    // Pads the plain text with an 0x80 byte followed by as many 0x00
    // bytes are required to complete the block.
    Crypto.pad.iso7816 = new Crypto.pad.Padding ({
    	name : "iso-7816",
        pad : function (cipher, message) {
            var reqd = _requiredPadding(cipher, message);
            message.push(0x80);
            for (; reqd > 1; reqd--) {
                message.push(0x00);
            }
        },

        unpad : function (message) {
            while (message.pop() != 0x80) {}
        }
    });
    
    // ANSI X.923 padding
    //
    // The final block is padded with zeros except for the last byte of the
    // last block which contains the number of padding bytes.
    Crypto.pad.ansix923 = new Crypto.pad.Padding ({
    	name : "ansi-x.923",
        pad : function (cipher, message) {
            var reqd = _requiredPadding(cipher, message);
            for (var i = 1; i < reqd; i++) {
                message.push(0x00);
            }
            message.push(reqd);
        },

        unpad : _unpadLength
    });

    // ISO 10126
    //
    // The final block is padded with random bytes except for the last
    // byte of the last block which contains the number of padding bytes.
    Crypto.pad.iso10126 = new Crypto.pad.Padding ({
    	name : "iso-10126",
        pad : function (cipher, message) {
            var reqd = _requiredPadding(cipher, message);
            for (var i = 1; i < reqd; i++) {
                message.push(Math.floor(Math.random() * 256));
            }
            message.push(reqd);
        },

        unpad : _unpadLength
    });

    // PKCS7 padding
    //
    // PKCS7 is described in RFC 5652. Padding is in whole bytes. The
    // value of each added byte is the number of bytes that are added,
    // i.e. N bytes, each of value N are added.
    Crypto.pad.pkcs7 = new Crypto.pad.Padding ({
    	name : "pkcs7",
        pad : function (cipher, message) {
            var reqd = _requiredPadding(cipher, message);
            for (var i = 0; i < reqd; i++) {
                message.push(reqd);
            }
        },

        unpad : _unpadLength
    });

})();




