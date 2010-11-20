(function (C)
{
  // Shortcuts
  var Utf8Str = C["enc"]["Utf8Str"];
  var WordArray = C.typ.WordArray;

  var HMAC = C["HMAC"] = function (hasher, message, key)
  {
    // Convert string to WordArray, else assume WordArray already
    if (message.constructor == String) message = Utf8Str["decode"](message);
    if (key.constructor == String) key = Utf8Str["decode"](key);

    // Allow arbitrary length keys
    if (key.length > hasher.blockSize)
    {
      key = hasher(key);
    }

    // XOR keys with pad constants
    var oKey = WordArray(key.slice(0));
    var iKey = WordArray(key.slice(0));
    for (var i = 0; i < hasher.blockSize; i++)
    {
      oKey[i] ^= 0x5C5C5C5C;
      iKey[i] ^= 0x36363636;
    }

    // Do hash
    return hasher(oKey.cat(hasher(iKey.cat(message))));
  };

})(CryptoJS);
