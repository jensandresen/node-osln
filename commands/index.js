module.exports = function(commandName, commandArgs) {
    switch (commandName) {
        case "list":
            const list = require("./list.js");
            list.execute(commandName, commandArgs);

            break;
        case "help":
            const helper = require("./help.js");

            helper.execute(
                commandName, 
                commandArgs, 
                [
                    require("./list.js").getHelp(),
                ]
            );

            break;
        default:
            console.log(`Unknown command "${commandName}"`);
            console.log(`Try "osln help" for more information about available commands.`)
    }
};