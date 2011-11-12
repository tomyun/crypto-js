<?php

$copyrightInfo = '/*!
 * CryptoJS v3.0 beta 1
 * http://code.google.com/p/crypto-js/
 * (c) 2009-2011 by Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */
';

$files = array(
    'core', 'enc-base64',
    'md5', 'sha1', 'sha256',
    'hmac', 'pbkdf2', 'evpkdf',
    'cipher-core', 'rc4', 'rabbit', 'aes',
    'pad-ansix923', 'pad-iso10126', 'pad-iso97971', 'pad-zeropadding', 'pad-nopadding',
    'mode-cfb', 'mode-ctr', 'mode-ecb', 'mode-ofb'
);

$rollups = array(
    array('core', 'md5'),
    array('core', 'sha1'),
    array('core', 'sha256'),

    array('core', 'md5', 'hmac'),
    array('core', 'sha1', 'hmac'),
    array('core', 'sha256', 'hmac'),

    array('core', 'sha1', 'hmac', 'pbkdf2'),
    array('core', 'md5', 'evpkdf'),

    array('core', 'enc-base64', 'md5', 'evpkdf', 'cipher-core', 'rc4'),
    array('core', 'enc-base64', 'md5', 'evpkdf', 'cipher-core', 'rabbit'),
    array('core', 'enc-base64', 'md5', 'evpkdf', 'cipher-core', 'aes')
);

foreach ($files as $file) {
    mkdir("../build/$file");
    $jsContents = $copyrightInfo . file_get_contents("../src/$file.js");
    file_put_contents("../build/$file/$file.js", $jsContents);
    file_put_contents("../build/$file/$file-min.js", compress($jsContents));
}

foreach ($rollups as $rollup) {
    $rollupName = implode('-', $rollup);
    mkdir("../build/$rollupName");

    $jsContents = $copyrightInfo;
    foreach ($rollup as $file) {
        $jsContents .= file_get_contents("../src/$file.js");
    }

    file_put_contents("../build/$rollupName/$rollupName.js", compress($jsContents));
}

function compress($jsContents)
{
    $cmd = 'java -jar compiler/compiler.jar';
    $descriptors = array(
        0 => array('pipe', 'r'),
        1 => array('pipe', 'w'),
        2 => array('pipe', 'w')
    );
    $process = proc_open($cmd, $descriptors, $pipes);

    if ($process === false) {
        die('proc_open failed');
    }

    fwrite($pipes[0], $jsContents);
    fclose($pipes[0]);

    $compressed = stream_get_contents($pipes[1]);
    fclose($pipes[1]);

    $errors = stream_get_contents($pipes[2]);
    fclose($pipes[2]);

    $exitStatus = proc_close($process);

    if ($errors or $exitStatus != 0) {
        die('errors or exit status failed');
    }

    return $compressed;
}
