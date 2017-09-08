const leftPad = require("left-pad");
const rightPad = require("right-pad");

module.exports = {

    execute: function(commandName, commandArgs, helpMessages) {
        console.log(`Usage: osln <command> [<args>]`);
        console.log("");
        console.log("Available commands:");
        console.log("");
        
        let maxLength = 0;
        helpMessages.forEach(function(element) {
            if (element.name.length > maxLength) {
                maxLength = element.name.length;
            }
        }, this);

        for (var i = 0; i < helpMessages.length; i++) {
            var help = helpMessages[i];
            console.log(`   ${rightPad(help.name, maxLength + 4)}${help.description}`);
        }

        console.log();
        console.log("Type \"osln help <command>\" for help information for a specific command.");
    }
};