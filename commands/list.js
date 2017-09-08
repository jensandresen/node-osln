const dir = require('node-dir');
const readline = require('readline');
const open = require("open");
const leftPad = require("left-pad");
const minimist = require("minimist");
const path = require("path");

const sourceDir = process.cwd();

module.exports = {
    execute: function(commandName, commandArgs) {
        dir.promiseFiles(sourceDir)
        .then(files => {
            return files.filter(fileName => fileName.match(/\.sln$/));
        })
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
                const option = solutionFiles[i].slice(sourceDir.length+1);
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