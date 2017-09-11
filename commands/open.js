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
//        .then(solutionFiles => {
//            if (commandArgs.filter) {
//                return solutionFiles.filter(filePath => {
//                    const fileName = path.basename(filePath, ".sln");
//                    return fileName.match(commandArgs.filter);
//                });
//            }
//    
//            return solutionFiles;
//        })
        .then(solutionFiles => {
            return new Promise((resolve, reject) => {
                if (solutionFiles.length === 0) {
                    reject(`No solution file found in "${sourceDir}"`);
                } else {
                    resolve(solutionFiles);
                }
            });
        })
        .then(solutionFiles => {
            console.log("");
            console.log("Multiple solution files found...")
            console.log("");

            for(let i = 0; i < solutionFiles.length; i++) {
                const option = solutionFiles[i].slice(sourceDir.length+1);
                console.log(`${leftPad(i+1, 5)}: ${option}`);
            }

            return new Promise((resolve, reject) => {
                console.log();

                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

                rl.question("Please select which to open: ", (answer) => {
                    const index = parseInt(answer) - 1;
                    const selected = solutionFiles[index];
        
                    rl.close();

                    if (selected) {
                        resolve(selected);
                    } else {
                        reject(`Unexpected value of "${answer}". The value should have been between 1-${solutionFiles.length}.`);
                    }        
                });                
            });
        })
        .then(selected => {
            console.log(`Opening "${selected}"...`);
            //open(selected);
            return;
        })
        .catch(err => {
            console.log(err);
        });
    },
    getHelp: function() {
        return {
            name: "open",
            description: "Scan and list all available files in current folder and subfolders. \nPrompts to select which to open.",
            args: [
                {
                    short: "f",
                    long: "filter",
                    description: "Apply a RegEx filter on the file name (without extension)."
                }
            ]
        };
    }
};