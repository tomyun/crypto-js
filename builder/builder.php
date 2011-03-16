<?php

$copyrightInfo = '/*!
 * Crypto-JS vX.X.X
 * http://code.google.com/p/crypto-js/
 * Copyright (c) 2009, Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */
';

$files = array(
    'core', 'base64',
    'hash_base',
    'md5', 'sha1', 'sha256',
    'hmac',
    'pbkdf2',
    'cipher_base',
    'marc4', 'rabbit', 'aes',
    'cbc', 'ofb'
);

$rollups = array(
    array('core', 'hash_base', 'md5'),
    array('core', 'hash_base', 'sha1'),
    array('core', 'hash_base', 'sha256'),

    array('core', 'hash_base', 'md5', 'hmac'),
    array('core', 'hash_base', 'sha1', 'hmac'),
    array('core', 'hash_base', 'sha256', 'hmac'),

    array('core', 'hash_base', 'sha1', 'hmac', 'pbkdf2'),

    array('core', 'base64', 'hash_base', 'sha1', 'hmac', 'pbkdf2', 'cipher_base', 'marc4'),
    array('core', 'base64', 'hash_base', 'sha1', 'hmac', 'pbkdf2', 'cipher_base', 'rabbit'),
    array('core', 'base64', 'hash_base', 'sha1', 'hmac', 'pbkdf2', 'cipher_base', 'aes', 'ofb')
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
        die();
    }

    fwrite($pipes[0], $jsContents);
    fclose($pipes[0]);

    $compressed = stream_get_contents($pipes[1]);
    fclose($pipes[1]);

    $errors = stream_get_contents($pipes[2]);
    fclose($pipes[2]);

    $exitStatus = proc_close($process);

    if ($errors or $exitStatus != 0) {
        die();
    }

    return $compressed;
}
