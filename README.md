CryptoJS
========

This repository is a mirror of [crypto-js](https://code.google.com/p/crypto-js/) from Google Code. Its full history has been converted with [svn2git](https://github.com/nirvdrum/svn2git), yet it is not guaranteed to track more recent changes.  Other than that, several branches have been created for working on some extra stuffs.

RC2
---

[RC2](http://tools.ietf.org/html/rfc2268) is a block cipher whose details were kept secret for a decade. Although it has been superseded by many other recent algorithms, there are some legacy systems still dependent on. The effective key length is 32 bits by default, while it can be specified up to 1024 bits.

```html
<script src="https://raw.github.com/tomyun/crypto-js/xeit-3.1.2/build/rollups/rc2.js"></script>
<script>
    var encrypted = CryptoJS.RC2.encrypt("Message", "Secret Passphrase", { effectiveKeyBits: 64 });
    var decrypted = CryptoJS.RC2.decrypt(encrypted, "Secret Passphrase", { effectiveKeyBits: 64 });
</script>
```
