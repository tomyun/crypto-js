(function (C)
{
  // Shortcuts
  var Utf8Str = C["enc"]["Utf8Str"];
  var WordArray = C.typ.WordArray;

  var PBKDF2 = C["PBKDF2"] = function (password, salt, keyLength, options)
  {
    // Default options
    var hasher = options && options["hasher"] || C["SHA1"];
    var iterations = options && options["iterations"] || 1;

    // Convert string to WordArray, else assume WordArray already
    if (password.constructor == String) password = Utf8Str["decode"](password);
    if (salt.constructor == String) salt = Utf8Str["decode"](salt);

    // Initial values
    var derivedKey = WordArray();
    var blockIndex = WordArray([1]);

    // Generate key
    while (derivedKey.getSigBytes() < keyLength)
    {
      var block = C["HMAC"](hasher, salt.cat(blockIndex), password);

      // Iterations
      var u = block;
      for (var i = 1; i < iterations; i++)
      {
        u = C["HMAC"](hasher, u, password);

        for (var j = 0; j < block.length; j++)
        {
          block[j] ^= u[j];
        }
      }

      derivedKey = derivedKey.cat(block);
      blockIndex[0]++;
    }

    // Ignore excess bytes
    derivedKey.setSigBytes(keyLength);

    return derivedKey;
  };

})(CryptoJS);
