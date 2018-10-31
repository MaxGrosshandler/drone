
const Eris = require('eris')
const config = require("./config.json")
const bot = new Eris.Client(config.token)
const fs = require("fs")
let commands = [];
let helpCommands = [];
function readCommands() {
    fs.readdir("./commands", (err, files) => {
        if (err) console.error(err);
        console.log(
            `Loading a total of ${files.length} commands into memory.`,
            false
        );
        files.forEach(file => {
            try {
                const command = require(`./commands/${file}`);

                console.log(`Attempting to load the command "${command.name}".`, false);


                let newCommand = [
                    command.name,
                    command.options.description,
                    command.options.fullDescription,
                    command.options.usage,
                    command.func,
                    command.hidden
                ];
                if (command.name !== "kick" && command.name !== "ban" && command.name !== "role" && command.name !== "steak") {
                    commands.push(command)
                }



                let hiddenCommands = ['eval', 'help', 'zombiewatch', 'stupidcat', 'kick', 'ban', 'role', 'o', 'clue', 'gnar', 'steak']
                if (!(hiddenCommands.includes(command.name))) {
                    helpCommands.push(newCommand);
                }

            }
            catch (err) {
                console.log(
                    "An error has occured trying to load a command. Here is the error."
                );
                console.log(err.stack);
            }
        });
        console.log("Command Loading complete!");
        console.log("\n");
    });
}

bot.on("ready", () => { // When the bot is ready
    console.log("Drone is online"); // Log "Ready!"
});

bot.on("messageCreate", async msg => {
    if (msg.author.bot) return;
    if (msg.content.toLowerCase().startsWith("drone ")) {
        let stuff = msg.content.split(" ")
        let c = stuff[1];
        stuff.shift()
            commands.forEach(function (command) {
                if (command.name == c) {
                    stuff.shift();
                    command.func(msg, stuff)
                   
                }

            })
        
    }
    



})
readCommands()

bot.connect()