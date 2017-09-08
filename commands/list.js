const dir = require('node-dir');
const readline = require('readline');
const open = require("open");
const leftPad = require("left-pad");
const minimist = require("minimist");

const sourceDir = process.cwd();

module.exports = function(commandName, commandArgs) {

    dir.promiseFiles(sourceDir)
    .then(files => {
        return files.filter(fileName => fileName.match(/\.sln$/));
    })
    .then(solutionFiles => {
        if (commandArgs.filter) {
            return solutionFiles.filter(fileName => fileName.match(`^.*?(${commandArgs.filter}).*?\.sln$`));
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
}