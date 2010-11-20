if ( ! window["CryptoJS"])
{
  (function ()
  {
    var C = CryptoJS = {};


    /* OOP
    ------------------------------------------------------------ */

    C["extend"] = function ()
    {
      if (arguments[0].constructor == Function)
      {
        return extendFunctionObject.apply(this, arguments);
      }
      else
      {
        return extendObject.apply(this, arguments);
      }
    };

    function extendObject(supertype, overrides)
    {
      function F() {}
      F.prototype = supertype;
      var subtype = new F();

      override(subtype, overrides);
      subtype["$super"] = supertype;

      return subtype;
    }

    function extendFunctionObject(subtype, supertype, overrides)
    {
      subtype.prototype = extendObject(supertype.prototype, overrides);
      subtype.prototype.constructor = subtype;
      subtype["$super"] = supertype;
    }

    function override(o, overrides)
    {
      for (var p in overrides)
      {
        o[p] = overrides[p];
      }

      // IE won't copy toString using the loop above
      if (overrides["toString"] != undefined)
      {
        o["toString"] = overrides["toString"];
      }

      return o;
    }


    /* Types
    ------------------------------------------------------------ */

    var typ = C.typ = {};


    /* Type -> WordArray
    --------------------------------------------- */

    var WordArray = typ.WordArray = function (words, sigBytes)
    {
        // IE won't let us extend Array directly, so instead we augment an array object
      var wordArray = override(words || [], wordArrayOverrides);

      if (sigBytes != undefined)
      {
        wordArray.setSigBytes(sigBytes);
      }

      return wordArray;
    };

    var wordArrayOverrides =
    {
      constructor: WordArray,

      getSigBytes: function ()
      {
        if (this.sigBytes != undefined)
        {
          return this.sigBytes;
        }
        else
        {
          return this.length * 4;
        }
      },

      setSigBytes: function (sigBytes)
      {
        this.sigBytes = sigBytes;
      },

      cat: function (wordArray)
      {
        return ByteStr["decode"](ByteStr["encode"](this) + ByteStr["encode"](wordArray));
      },

      "toString": function (encoder)
      {
        return (encoder || Hex)["encode"](this);
      }
    };


    /* Type -> Hasher
    --------------------------------------------- */

    var Hasher = typ.Hasher = function (message)
    {
      // Convert string to WordArray, else assume WordArray already
      if (message.constructor == String) message = Utf8Str["decode"](message);

      return this.doHash(message);
    };


    /* Type -> Cipher
    --------------------------------------------- */

    var Cipher = typ.Cipher =
    {
      "encrypt": function (message, password)
      {
        // Convert string to WordArray, else assume WordArray already
        if (message.constructor == String) message = Utf8Str["decode"](message);

        // Generate random IV
        var iv = WordArray();
        for (var i = 0; i < /*this.ivSize ||*/ 16; i++)
        {
          iv.push(Math.floor(Math.random() * 0x100000000));
        }

        // Derive key, else assume key already
        if (password.constructor == String)
        {
          password = C["PBKDF2"](password, iv, /*this.keySize ||*/ 16);
        }

        this.doEncrypt(message, password, iv);

        return new C.typ.Ciphertext(message, iv);
      },

      "decrypt": function (ciphertext, password)
      {
        // Convert string to Ciphertext, else assume Ciphertext already
        if (ciphertext.constructor == String) new C.typ.Ciphertext(ciphertext);

        // Derive key, else assume key already
        if (password.constructor == String)
        {
          password = C["PBKDF2"](password, ciphertext.getIV(), /*this.keySize ||*/ 16);
        }

        this.doDecrypt(ciphertext.getCiphertext(), password, ciphertext.getIV());

        return ciphertext.getCiphertext();
      }
    };


    /* Type -> Ciphertext
    --------------------------------------------- */

    var Ciphertext = typ.Ciphertext = function (ciphertext, iv)
    {
      if (ciphertext)
      {
        if (ciphertext.constructor == String)
        {
          this.fromString(ciphertext);
        }
        else
        {
          this.setCiphertext(ciphertext);
        }
      }

      if (iv)
      {
        this.setIV(iv);
      }
    };

    Ciphertext.prototype =
    {
      setCiphertext: function (ciphertext)
      {
        this.ciphertext = ciphertext;
      },

      getCiphertext: function ()
      {
        return this.ciphertext;
      },

      setIV: function (iv)
      {
        this.iv = iv;
      },

      getIV: function ()
      {
        return this.iv;
      },

      fromString: function (ctStr)
      {
        var ctWords = Base64["decode"](ctStr);
        this.setIV(WordArray(ctWords.slice(0, 16)));
        this.setCiphertext(WordArray(ctWords.slice(16)));
      },

      "toString": function ()
      {
        return this.getIV().cat(this.getCiphertext()).toString(Base64);
      }
    };


    /* Encodings
    ------------------------------------------------------------ */

    var enc = C["enc"] = {};


    /* Encoding -> ByteStr
    --------------------------------------------- */

    var ByteStr = enc["ByteStr"] =
    {
      "encode": function (words)
      {
        var sigBytes = words.getSigBytes();
        var byteStr = [];

        for (var i = 0; i < sigBytes; i++)
        {
          byteStr.push(String.fromCharCode((words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xFF));
        }

        return byteStr.join("");
      },

      "decode": function (byteStr)
      {
        var words = [];

        for (var i = 0; i < byteStr.length; i++)
        {
          words[i >>> 2] |= byteStr.charCodeAt(i) << (24 - (i % 4) * 8);
        }

        return WordArray(words, byteStr.length);
      }
    };


    /* Encoding -> Utf8Str
    --------------------------------------------- */

    var Utf8Str = enc["Utf8Str"] =
    {
      "encode": function (words)
      {
        return decodeURIComponent(escape(ByteStr["encode"](words)));
      },

      "decode": function (utf8Str)
      {
        return ByteStr["decode"](unescape(encodeURIComponent(utf8Str)));
      }

    };


    /* Encoding -> Hex
    --------------------------------------------- */

    var Hex = enc["Hex"] =
    {
      "encode": function (words)
      {
        var sigBytes = words.getSigBytes();
        var hexStr = [];

        for (var i = 0; i < sigBytes; i++)
        {
          var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xFF;
          hexStr.push((bite >>> 4).toString(16));
          hexStr.push((bite & 0xF).toString(16));
        }

        return hexStr.join("");
      },

      "decode": function (hexStr)
      {
        var words = [];

        for (var i = 0; i < hexStr.length; i += 2)
        {
          words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
        }

        return WordArray(words, hexStr.length / 2);
      }

    };


    /* Encoding -> Base64
    --------------------------------------------- */

    var Base64 = enc["Base64"] =
    {
      "encode": function (words)
      {
        var sigBytes = words.getSigBytes();
        var base64Str = [];

        for (var i = 0; i < sigBytes; i += 3)
        {
          var triplet = (((words[(i    ) >>> 2] >>> (24 - ((i    ) % 4) * 8)) & 0xFF) << 16) |
                        (((words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xFF) <<  8) |
                        ( (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xFF);

          for (var j = 0; j < 4; j++)
          {
            if (j * 0.75 + i <= sigBytes)
            {
              base64Str.push(Base64.charMap.charAt((triplet >>> (6 * (3 - j))) & 0x3F));
            }
            else
            {
              base64Str.push("=");
            }
          }
        }

        return base64Str.join("");
      },

      "decode": function (base64Str)
      {
        base64Str = base64Str.replace(/=+$/, "");
        var words = [];

        for (var i = 0, bites = 0; i < base64Str.length; i++)
        {
          if (i % 4)
          {
            words[bites >>> 2] |= (((Base64.charMap.indexOf(base64Str.charAt(i - 1)) << ((i % 4) * 2)) |
                                    (Base64.charMap.indexOf(base64Str.charAt(i)) >>> (6 - (i % 4) * 2))) & 0xFF) <<
                                  (24 - (bites % 4) * 8);
            bites++;
          }
        }

        return WordArray(words, bites);
      },

      charMap: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

    };

  })();
}
