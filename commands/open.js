const dir = require('node-dir');
const readline = require('readline');
const open = require("open");
const leftPad = require("left-pad");
const minimist = require("minimist");
const path = require("path");
const unique = require('array-unique');
const settings = require("../utils/settings");

const sourceDir = process.cwd();

module.exports = {
    execute: function(commandName, commandArgs) {
        let paths = commandArgs["_"];

        if (!paths || paths.length == 0) {
            paths = [sourceDir];
        }

        Promise.all(paths.map(p => dir.promiseFiles(p)))
        .then(fileLists => [].concat.apply([], fileLists))
        .then(files => files.filter(fileName => fileName.match(/\.sln$/)))
        .then(files => files.filter(file => settings.getExcludedPath().every(exclude => !path.dirname(file).match(exclude))))
        .then(files => files.map(file => path.resolve(file)))
        .then(files => unique(files))
        .then(files => files.sort())
        .then(solutionFiles => {
            if (commandArgs.f || commandArgs.filter) {
                return solutionFiles.filter(filePath => {
                    const fileName = path.basename(filePath, ".sln");
                    return fileName.match(commandArgs.filter);
                });
            }
    
            return solutionFiles;
        })
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

            if (solutionFiles.length === 1) {
                return new Promise(resolve => {
                    resolve(solutionFiles[0]);
                });
            }

            console.log("");
            console.log("Multiple solution files found...")
            console.log("");

            for(let i = 0; i < solutionFiles.length; i++) {
                const option = path.relative(process.cwd(), solutionFiles[i]).replace(/^..(\/|\\)/, '');
                console.log(`${leftPad(i + 1, 5)}: ${option}`);
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
            if (commandArgs["dry-run"]) {
                console.log(`Would open this file: ${selected}`);
            } else {
                console.log(`Opening "${selected}"...`);
                open(selected);
            }

            return;
        })
        .catch(err => {
            console.log(err);
        });
    },
    getHelp: function() {
        return {
            name: "open",
            description: "Scan and list all available files in current folder and subfolders.",
            args: [
                {
                    short: "f",
                    long: "filter",
                    description: "Apply a RegEx filter on the file name (without extension)."
                },
                {
                    long: "dry-run",
                    description: "Will not actually open the file, only print which would be opened."
                }
            ]
        };
    }
};