const dir = require('node-dir');
const readline = require('readline');
const open = require("open");

const sourceDir = process.cwd();

dir.promiseFiles(sourceDir)
    .then(files => {
        return files.filter(name => name.match(/\.txt$/))
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
            const option = solutionFiles[i];
            console.log(`  ${i+1}: ${option}`);
        }

        console.log("");

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
                console.log(`Error, unrecognized value of "${answer}". The options was 1-${solutionFiles.length}.`);
            }

            rl.close();
        });                
    });