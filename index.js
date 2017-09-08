#!/usr/bin/env node
const dir = require('node-dir');
const readline = require('readline');
const open = require("open");
const leftPad = require("left-pad");
const minimist = require("minimist");

const commandProcessor = require("./commands");

const args = process.argv.splice(2);

const commandName = args[0];
const commandArgs = minimist(args.slice(1));


commandProcessor(commandName, commandArgs);

/*
const sourceDir = process.cwd();

dir.promiseFiles(sourceDir)
    .then(files => {
        return files.filter(name => name.match(/\.sln$/))
    })
    .then(solutionFiles => {
        if (solutionFiles.length === 0) {
            console.log(`No solution file found in "${sourceDir}"`)
            return;
        }

        if (solutionFiles.length === 1) {
            const selected = solutionFiles[0];
            console.log(`Opening "${selected}"...`);
            open(selected);
            return;
        }

        console.log("");
        console.log("Multiple solution files found...")
        console.log("");

        for(let i = 0; i < solutionFiles.length; i++) {
            const option = solutionFiles[i].slice(sourceDir.length+1);
            console.log(`${leftPad(i+1, 5)}: ${option}`);
        }

        console.log("\n");

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("Please select which to open: ", (answer) => {
            const index = parseInt(answer) - 1;
            const selected = solutionFiles[index];

            if (selected) {
                console.log(`Opening "${selected}"...`);
                open(selected);
            } else {
                console.log(`Error, unrecognized value of "${answer}". The value should have been between 1-${solutionFiles.length}.`);
            }

            rl.close();
        });                
    });
    */