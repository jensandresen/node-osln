const dir = require('node-dir');
const readline = require('readline');
const open = require("open");
const leftPad = require("left-pad");
const minimist = require("minimist");
const path = require("path");
const unique = require('array-unique');

const sourceDir = process.cwd();

module.exports = {
    execute: function(commandName, commandArgs) {
        let paths = commandArgs["_"];

        if( !paths || paths.length==0 ) {
            paths = [sourceDir];
        }

        Promise.all(paths.map(p => dir.promiseFiles(p)))
        .then(fileLists => [].concat.apply([], fileLists))
        .then(files => files.filter(fileName => fileName.match(/\.sln$/)))
        .then(files => files.map(file => path.resolve(file)))
        .then(files => unique(files))
        .then(files => files.sort())
        .then(solutionFiles => {
            if (commandArgs.filter) {
                return solutionFiles.filter(filePath => {
                    const fileName = path.basename(filePath, ".sln");
                    return fileName.match(commandArgs.filter);
                });
            }
    
            return solutionFiles;
        })
        .then(solutionFiles => {
            if (solutionFiles.length === 0) {
                throw new Error(`No solution file found in "${sourceDir}"`);
            }
    
            return solutionFiles;
        })
        .then(solutionFiles => {
            if (!commandArgs.raw) {
                console.log("");
                console.log("Found:")
                console.log("");
            }
    
            return solutionFiles;
        })
        .then(solutionFiles => {
            for(let i = 0; i < solutionFiles.length; i++) {
                const option = path.relative(process.cwd(), solutionFiles[i]).replace(/^..(\/|\\)/, '');
                console.log(`${leftPad(i+1, 5)}: ${option}`);
            }
        })
        .catch(err => {
            console.log(err.message);
        });
    },
    getHelp: function() {
        return {
            name: "list",
            description: "Scan and show a list of available files.",
            args: [
                {
                    short: "f",
                    long: "filter",
                    description: "Apply a RegEx filter on the file name (without extension)."
                },
                {
                    short: "r",
                    long: "raw",
                    description: "Will NOT print the header - easier for grepping!"
                }
            ]
        };
    }

};