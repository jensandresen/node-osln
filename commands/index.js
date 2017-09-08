module.exports = function(commandName, commandArgs) {
    switch (commandName) {
        case "list":
            const list = require("./list.js");
            list(commandName, commandArgs);
            break;
        case "help":
            console.log("help it is!");
            break;
        default:
            console.log(`Unknown command "${commandName}"`);
            console.log(`Try "osln help" for more information about available commands.`)
    }
}