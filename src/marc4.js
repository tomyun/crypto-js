(function (C)
{
  var MARC4 = C["MARC4"] = C["extend"](C.typ.AbstractCipher,
  {
    doEncrypt: function (m, k, iv)
    {
      // State
      var s = [];
      for (var i = 0; i < 256; i++)
      {
        s[i] = i;
      }

      // Key setup
      for (var i = 0, j = 0; i < 256; i++)
      {
        var kByte = i % k.getSigBytes();

        j = (j + s[i] + ((k[kByte >>> 2] >>> (24 - (kByte % 4) * 8)) & 0xFF)) % 256;

        // Swap
        var t = s[i];
        s[i]  = s[j];
        s[j]  = t;
      }

      // Encryption
      for (var i = -MARC4.drop, a = 0, b = 0; i < m.length; i++)
      {
        var keystream = 0;
        for (var n = 0; n < 4; n++)
        {
          a = (a + 1) % 256;
          b = (b + s[a]) % 256;

          // Swap
          var t = s[a];
          s[a]  = s[b];
          s[b]  = t;

          keystream |= s[(s[a] + s[b]) % 256] << (24 - n * 8);
        }

        // Stop here if we're still dropping keystream
        if (i < 0) continue;

        // Encrypt
        m[i] ^= keystream;
      }
    },

    drop: 384
  });

  // Decryption is the same process as encryption
  MARC4.doDecrypt = MARC4.doEncrypt;

})(CryptoJS);
