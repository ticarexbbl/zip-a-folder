'use strict';
var fs = require('fs');
var archiver = require('archiver');
var path = require('path');

class ZipAFolder {
    static async zip(srcFolder, zipFilePath, storeCompression = false) {
        return new Promise((resolve, reject) => {
            ZipAFolder.zipFolder({
                inPath: srcFolder,
                outPath: zipFilePath,
                storeCompression
            }, err => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    static zipFolder({
        inPath,
        outPath,
        storeCompression = false
    }, callback) {
        // folder double check
        fs.access(inPath, fs.constants.F_OK, (notExistingError) => {
            if (notExistingError) {
                return callback(notExistingError);
            }
            fs.access(path.dirname(outPath), fs.constants.F_OK, (notExistingError) => {
                if (notExistingError) {
                    return callback(notExistingError);
                }
                var output = fs.createWriteStream(outPath);
                var zipArchive = archiver('zip', {
                    store: storeCompression
                });

                output.on('close', function () {
                    callback();
                });

                zipArchive.pipe(output);
                zipArchive.directory(inPath, false);
                zipArchive.finalize();
            });
        });
    }
}

module.exports = ZipAFolder;