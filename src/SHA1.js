(function (C)
{
  var SHA1 = C["SHA1"] = function (message)
  {
    return C.typ.AbstractHasher.call(SHA1, message);
  };

  SHA1.blockSize = 16;

  SHA1.doHash = function (m)
  {
    // Add padding
    var l = m.getSigBytes() * 8;
    m[l >>> 5] |= 0x80 << (24 - l % 32);
    m[(((l + 64) >>> 9) << 4) + 15] = l;

    // Initial values
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;

    var w  = [];

    // Iterate
    for (var i = 0; i < m.length; i += 16)
    {
      var a = H0;
      var b = H1;
      var c = H2;
      var d = H3;
      var e = H4;

      for (var j = 0; j < 80; j++)
      {
        if (j < 16)
        {
          w[j] = m[i + j];
        }
        else
        {
          var n = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
          w[j] = (n << 1) | (n >>> 31);
        }

        var t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0);
        if      (j < 20) t += ((H1 & H2) | (~H1 & H3)) + 0x5A827999;
        else if (j < 40) t += (H1 ^ H2 ^ H3) + 0x6ED9EBA1;
        else if (j < 60) t += ((H1 & H2) | (H1 & H3) | (H2 & H3)) - 0x70E44324;
        else             t += (H1 ^ H2 ^ H3) - 0x359D3E2A;

        H4 = H3;
        H3 = H2;
        H2 = (H1 << 30) | (H1 >>> 2);
        H1 = H0;
        H0 = t;
      }

      H0 += a;
      H1 += b;
      H2 += c;
      H3 += d;
      H4 += e;
    }

    return C.typ.WordArray([H0, H1, H2, H3, H4]);
  };

})(CryptoJS);
