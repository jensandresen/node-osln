const settings = require("./../utils/settings.js");
const rightPad = require("right-pad");
const indendBaseline = "  ";

module.exports = {

    execute: function(commandName, commandArgs, helpMessages) {
        const commandsNeedingHelp = commandArgs["_"];

        if (commandsNeedingHelp === undefined || commandsNeedingHelp === null || commandsNeedingHelp.length === 0) {
            this.printAll(helpMessages);
            return;
        }

        if (commandsNeedingHelp.length === 1) {
            const name = commandsNeedingHelp[0];

            const theCommand = helpMessages.find(x => x.name === name);
            
            if (theCommand) {
                this.printSingle(theCommand);
                return;
            } else {
                console.log(`Command "${name}" is unknown.`);
                console.log();
            }
        } else {
            console.log("Only specify one command name for detailed information and usage.")
            console.log();
        }

        const helpMessageForHelpCommand = this.getHelp();        
        this.printSingle(helpMessageForHelpCommand);
    },
    getHelp: function() {
        return {
            name: "help",
            description: "Show information about all commands available or detailed usage for a specific command.",
            usages: [
                "help [command]",
            ],
            footer: `For a list of available commands type "${settings.getName()} help".`
        };
    },
    printAll: function(helpMessages) {
        console.log(`Usage:`);
        console.log(`${indendBaseline}${settings.getName()} <command> [<args>]`);
        console.log("");

        console.log("Available commands:");
        
        let maxLength = 0;
        helpMessages.forEach(function(element) {
            if (element.name.length > maxLength) {
                maxLength = element.name.length;
            }
        }, this);

        for (var i = 0; i < helpMessages.length; i++) {
            var help = helpMessages[i];
            console.log(`${indendBaseline}${rightPad(help.name, maxLength + 4)}${help.description}`);
        }

        console.log();
        console.log(`Type "${settings.getName()} help <command>" for help information for a specific command.`);
    },
    printSingle: function(command) {
        const hasArguments = command.args && command.args.length > 0;

        console.log(`Usage:`);
        const usages = command.usages && command.usages.length > 0
            ? command.usages
            : [`${command.name}${hasArguments ? " [<args>]" : ""}`];

        usages.forEach(usage => {
            console.log(`${indendBaseline}${settings.getName()} ${usage}`);
        });

        console.log();
        console.log("Description:")
        console.log(`${indendBaseline}${command.description}`);

        if (hasArguments) {
            console.log();
            console.log("Available arguments:");
            
            const availableArgs = command.args.map(arg => {
                let short = null;
                if (arg.short) {
                    short = `-${arg.short}`;
                }

                let long = null;
                if (arg.long) {
                    long = `--${arg.long}`;
                }

                if (short && long) {
                    return {
                        args: `${short}, ${long}`,
                        description: arg.description
                    };
                }

                return {
                    args: [short, long].find(x => x != null),
                    description: arg.description
                };
            });

            let maxLength = 0;
            availableArgs.forEach(arg => {
                if (arg.args.length > maxLength) {
                    maxLength = arg.args.length;
                }
            });

            availableArgs.forEach(arg => {
                const message = `${indendBaseline}${rightPad(arg.args, maxLength+4)}${arg.description}`;
                console.log(message);
            });
        }

        if (command.footer) {
            console.log();
            console.log(command.footer);
        }
    }
};