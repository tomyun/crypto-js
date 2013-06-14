CryptoJS
========

This repository is a mirror of [crypto-js](https://code.google.com/p/crypto-js/) from Google Code. Its full history has been converted with [svn2git](https://github.com/nirvdrum/svn2git), yet it is not guaranteed to track more recent changes.  Other than that, several branches have been created for working on some extra stuffs.

PBKDF1
------

[PBKDF1](http://tools.ietf.org/html/rfc2898) is a key derivation function superseded by more robust [PBKDF2](http://en.wikipedia.org/wiki/PBKDF2). While any supported hash functions can be used, keys longer than the hash digest cannot be derived.

```html
<script src="https://raw.github.com/tomyun/crypto-js/xeit-3.1.2/build/rollups/pbkdf1.js"></script>
<script>
    var salt = CryptoJS.lib.WordArray.random(128/8);
    var sha1 = CryptoJS.algo.SHA1;
    var key = CryptoJS.PBKDF1("Secret Passphrase", salt, { keySize: 128/32, hasher: sha1, iterations: 1000 });
</script>
```
