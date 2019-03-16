const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require('fs');
let config = require('./database/config.json');
let prefix = config.prefix;
let users = require('./database/users.json')

bot.on("ready", () =>{
    console.log("Dark Shark Bot ready! Author: f.mitchell.")
})

bot.on("message", async message => {
    if(!message.guild.id == "525454680168464384") return;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    if(!cmd.startsWith(prefix)) return;
    //Команда "run"
    if(cmd == `${prefix}run`){
        if(message.author.id == "347827337137750016"){
            try {
                const code = args.join(" ");
                let evaled = eval(code);
                if (typeof evaled !== "string")
                    evaled = require("util").inspect(evaled);
            } catch (err) {
                message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
            }
        }else{
            message.delete()
            message.channel.createWebhook("Access Denied!", "https://i.imgur.com/389kj7O.jpg")
            .then(async webhook =>{
                webhook.send(`${message.author}, \`эта команда доступна только создателю бота!\``)
                .then(async msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 3000);
                })
                webhook.delete()
            })
        }
    }
    //Команда "register"
    if(cmd == `${prefix}register`){
        message.delete()
        if(users[message.author.id].rank < 4) return
        if(!args[0]){
            message.reply("вы не выбрали пользователя.")
                .then(message => { 
                    setTimeout(() => {
                        message.delete()
                    }, 3000);
                })
            return
        }
        if(users[message.guild.member(message.mentions.users.first()).id]){
            message.reply("данный пользователь уже зарегистрирован!")
                .then(message => { 
                    setTimeout(() => {
                        message.delete()
                    }, 3000);
                })
            return
        }
        if(!args.slice(1).join(" ")){
            message.reply("вы не указали псевдоним.")
                .then(message => { 
                    setTimeout(() => {
                        message.delete()
                    }, 3000);
                })
            return
        }
        users[message.guild.member(message.mentions.users.first()).id] = {
            rep: 0,
            rank: 1,
            warns: 0,
            nick: args.slice(1).join(" ")
        }
        fs.writeFile('./database/users.json', JSON.stringify(users),(err) => {
            if(err) console.log(err);
        });
        message.guild.member(message.mentions.users.first()).addRole("525457330448367616")
        message.reply(`аккаунт ${message.guild.member(message.mentions.users.first())} успешно создан! Псевдоним: ${args.slice(1).join(" ")}.`)
        message.mentions.members.first().setNickname(args.slice(1).join(" "))
        let log = new Discord.RichEmbed()
            .setAuthor("Создание аккаунта.")
            .addField("Пользователь:", message.mentions.members.first())
            .addField("Администратор:", message.author)
            .addField("Псевдоним:", args.slice(1).join(" "))
            .setFooter("Dark Shark")
            .setTimestamp(new Date())
            .setColor("#06a503")
        message.guild.channels.find("id", "556257844387643423").send(log)
    }
    //Команда "delacc"
    if(cmd == `${prefix}delacc`){
        message.delete()
        if(users[message.author.id].rank < 4) return;
        if(!message.mentions.members.first()){
            message.reply("вы не выбрали аккаунт для удаления.")
                .then(message => { 
                    setTimeout(() => {
                        message.delete()
                    }, 3000);
                })
            return
        }
        if(!users[message.mentions.members.first().id]){
            message.reply("аккаунт не найден.")
                .then(message => { 
                    setTimeout(() => {
                        message.delete()
                    }, 3000);
                })
            return
        }
        if(users[message.author.id].rank == 4 && users[message.mentions.members.first().id].rank > 3){
            message.reply("вы не можете удалить этот аккаунт.")
                .then(message => { 
                    setTimeout(() => {
                        message.delete()
                    }, 3000);
                })
            return
        }
        if(users[message.author.id].rank == 5 && users[message.mentions.members.first().id].rank == 5){
            message.reply("вы не можете удалить этот аккаунт.")
                .then(message => { 
                    setTimeout(() => {
                        message.delete()
                    }, 3000);
                })
            return
        }
        delete users[message.mentions.members.first().id];
        fs.writeFile('./database/users.json', JSON.stringify(users),(err) => {
            if(err) console.log(err);
        });
        message.reply(`аккаунт ${message.mentions.members.first()} успешно удален!`)
        let log = new Discord.RichEmbed()
            .setAuthor("Удаление аккаунта.")
            .addField("Пользователь:", message.mentions.members.first())
            .addField("Администратор:", message.author)
            .setFooter("Dark Shark")
            .setTimestamp(new Date())
            .setColor("#ff0000")
        message.guild.channels.find("id", "556257844387643423").send(log)
    }
    //Команда "giverep"
    if(cmd == `${prefix}giverep`){
        message.delete()
        if(users[message.author.id].rank < 4) return
        if(!message.mentions.users.first()){
            message.reply("вы не указали пользователя.")
                .then(message => { 
                    setTimeout(() => {
                        message.delete()
                    }, 3000);
                })
            return
        }
        if(!users[message.mentions.members.first().id]){
            message.reply("профиль не найден.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        if(!parseInt(args[1])){
            message.reply("введите корректное кол-во очков.")
                .then(message => { 
                    setTimeout(() => {
                        message.delete()
                    }, 3000);
                })
            return
        }
        if(message.mentions.users.first() == message.author){
            message.reply("вы не можете изменять свою репутацию.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        if(users[message.guild.member(message.mentions.users.first()).id].rep + args[1] > 500 && users[message.author.id].rank == 4){
            message.reply("вы не можете выдать столько очков репутации.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        if(users[message.author.id].rank == 4 && users[message.guild.member(message.mentions.users.first()).id].rank > 3){
            message.reply("вы не можете изменить репутацию этому пользователю.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        if(users[message.author.id].rank == 5 && users[message.guild.member(message.mentions.users.first()).id].rank == 5){
            message.reply("вы не можете изменить репутацию этому пользователю.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        users[message.guild.member(message.mentions.users.first()).id].rep += parseInt(args[1]);
        fs.writeFile('./database/users.json', JSON.stringify(users),(err) => {
            if(err) console.log(err);
        });
        if(users[message.guild.member(message.mentions.users.first()).id].rank < 4){
            if(users[message.guild.member(message.mentions.users.first()).id].rep < 100 ){
                message.guild.member(message.mentions.users.first()).setRoles(["525457330448367616"])
                users[message.guild.member(message.mentions.users.first()).id].rank = 1
            }else if(users[message.guild.member(message.mentions.users.first()).id].rep > 100 && users[message.guild.member(message.mentions.users.first()).id].rep < 500){
                message.guild.member(message.mentions.users.first()).setRoles(["525457011467354113"])
                users[message.guild.member(message.mentions.users.first()).id].rank = 2
            }else if(users[message.guild.member(message.mentions.users.first()).id].rep > 500){
                message.guild.member(message.mentions.users.first()).setRoles(['525458205732765696'])
                users[message.guild.member(message.mentions.users.first()).id].rank = 3
            }
            fs.writeFile('./database/users.json', JSON.stringify(users),(err) => {
                if(err) console.log(err);
            });
        }
        message.channel.send(`${message.guild.member(message.mentions.users.first())}, ваша репутация изменена на ${users[message.guild.member(message.mentions.users.first()).id].rep}. Источник: ${message.author}.`)
        let log = new Discord.RichEmbed()
            .setAuthor("Изменение репутации.")
            .addField("Пользователь:", message.mentions.members.first())
            .addField("Администратор:", message.author)
            .addField("Кол-во очков:", args[1])
            .setFooter("Dark Shark")
            .setTimestamp(new Date())
            .setColor("#2891db")
        message.guild.channels.find("id", "556261647384051792").send(log)
    }
    //Команда "addzam"
    if(cmd == `${prefix}addzam`){
        message.delete()
        if(users[message.author.id].rank != 5) return;
        if(!message.mentions.members.first()){
            message.reply("вы должны отметить пользователя, которого хотите сделать заместителем.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        if(!users[message.mentions.members.first().id]){
            message.reply("профиль не найден.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        message.guild.member(message.mentions.users.first()).setRoles(["525456065655996434"])
        users[message.guild.member(message.mentions.users.first()).id].rank = 4
        fs.writeFile('./database/users.json', JSON.stringify(users),(err) => {
            if(err) console.log(err);
        });
        message.channel.send(`${message.mentions.users.first()}, вы были назначены на пост заместителя. Источник: ${message.author}.`)
    }
    //Команда "delzam"
    if(cmd == `${prefix}delzam`){
        message.delete()
        if(users[message.author.id].rank != 5) return;
        if(!message.mentions.members.first()){
            message.reply("вы должны отметить пользователя, которого хотите снять с поста заместителя.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        if(users[message.guild.member(message.mentions.users.first()).id].rep < 100 ){
            message.guild.member(message.mentions.users.first()).setRoles(["525457330448367616"])
            users[message.guild.member(message.mentions.users.first()).id].rank = 1
        }else if(users[message.guild.member(message.mentions.users.first()).id].rep > 100 && users[message.guild.member(message.mentions.users.first()).id].rep < 500){
            message.guild.member(message.mentions.users.first()).setRoles(["525457011467354113"])
            users[message.guild.member(message.mentions.users.first()).id].rank = 2
        }else if(users[message.guild.member(message.mentions.users.first()).id].rep >= 500){
            message.guild.member(message.mentions.users.first()).setRoles(['525458205732765696'])
            users[message.guild.member(message.mentions.users.first()).id].rank = 3
        }
        users[message.guild.member(message.mentions.users.first()).id].rank = 4
        fs.writeFile('./database/users.json', JSON.stringify(users),(err) => {
            if(err) console.log(err);
        });
        message.channel.send(`${message.mentions.users.first()}, вы были сняты с поста заместителя. Источник: ${message.author}.`)
    }
    //Команда "profile"
    if(cmd == `${prefix}profile`){
        message.delete()
        let rank = ""
        let embed = new Discord.RichEmbed()
            .setAuthor(`Профиль члена группировки:`)
            .addField(`Псевдоним:`, users[message.author.id].nick)
            switch(users[message.author.id].rank){
                case 1: rank = "Ненадежный"; break;
                case 2: rank = "Подтвержденный"; break;
                case 3: rank = "Профессионал"; break;
                case 4: rank = "Заместитель"; break;
                case 5: rank = "Главный хакер"; break;
            }
            embed.addField(`Статус:`, rank)
            .addField(`Репутация:`, users[message.author.id].rep)
            .addField(`Предупреждения:`, users[message.author.id].warns + `/3`)
            .setFooter("Dark Shark")
            .setColor("#2891db")
            .setTimestamp(new Date())
        message.author.send(embed)    
    }
    //Команда "warn"
    if(cmd == `${prefix}warn`){
        message.delete()
        if(users[message.author.id].rank < 4) return;
        if(!message.mentions.members.first()){
            message.reply("вы должны отметить пользователя, которому хотите дать варн.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        if(!users[message.mentions.members.first().id]){
            message.reply("профиль не найден.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        if(!args.slice(1).join(" ")){
            message.reply("вы должны указать причину выдачи варна.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        if(users[message.author.id].rank == 4 && users[message.mentions.members.first().id].rank > 3){
            message.reply("вы не можете выдать варн этому пользователю.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        if(users[message.author.id].rank == 5 && users[message.mentions.members.first().id].rank == 5){
            message.reply("вы не можете выдать варн этому пользователю.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        users[message.mentions.members.first().id].warns++;
        if(users[message.mentions.members.first().id].warns >= 3){
            message.mentions.members.first().kick("3/3 варнов.")
            delete users[message.mentions.members.first().id];
            fs.writeFile('./database/users.json', JSON.stringify(users),(err) => {
                if(err) console.log(err);
            });
            message.channel.send(`${message.author} забанил ${message.mentions.members.first()}. Причина: 3/3 предупреждений.`)
            return
        }
        fs.writeFile('./database/users.json', JSON.stringify(users),(err) => {
            if(err) console.log(err);
        });
        message.channel.send(`${message.author} выдал варн ${message.mentions.members.first()}. Причина: ${args.slice(1).join(" ")}.`)
        let log = new Discord.RichEmbed()
            .setAuthor("Выдача варна.")
            .addField("Пользователь:", message.mentions.members.first())
            .addField("Администратор:", message.author)
            .addField("Причина:", args.slice(1).join(" "))
            .addField("Всего варнов:", users[message.mentions.members.first().id].warns)
            .setFooter("Dark Shark")
            .setTimestamp(new Date())
            .setColor("#ff0000")
        message.guild.channels.find("id", "556261910467575819").send(log)
    }
    //Команда "unwarn"
    if(cmd == `${prefix}unwarn`){
        message.delete()
        if(users[message.author.id].rank < 4) return;
        if(!message.mentions.members.first()){
            message.reply("вы должны отметить пользователя, которому хотите снять варн.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        if(users[message.author.id].rank == 4 && users[message.mentions.members.first().id].rank > 3){
            message.reply("вы не можете снять варн этому пользователю.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        if(users[message.author.id].rank == 5 && users[message.mentions.members.first().id].rank == 5){
            message.reply("вы не можете снять варн этому пользователю.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        if(users[message.mentions.members.first().id].warns <= 0){
            message.reply("у этого пользователя нет варнов.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        users[message.mentions.members.first().id].warns--;
        fs.writeFile('./database/users.json', JSON.stringify(users),(err) => {
            if(err) console.log(err);
        });
        message.channel.send(`${message.author} снял варн ${message.mentions.members.first()}.`)
        let log = new Discord.RichEmbed()
            .setAuthor("Снятие варна.")
            .addField("Пользователь:", message.mentions.members.first())
            .addField("Администратор:", message.author)
            .addField("Осталось варнов:", users[message.mentions.members.first().id].warns)
            .setFooter("Dark Shark")
            .setTimestamp(new Date())
            .setColor("#06a503")
        message.guild.channels.find("id", "556261910467575819").send(log)
    }
    //Команда "checkprofile"
    if(cmd == `${prefix}checkprofile`){
        message.delete()
        if(users[message.author.id].rank < 4) return;
        if(!message.mentions.members.first()){
            message.reply("вы не выбрали пользователя, профиль которого хотите посмотреть.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        if(!users[message.mentions.members.first().id]){
            message.reply("профиль не найден.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        let rank = ""
        let embed = new Discord.RichEmbed()
            .setAuthor(`Профиль члена группировки:`)
            .addField(`Псевдоним:`, users[message.mentions.members.first().id].nick)
            switch(users[message.mentions.members.first().id].rank){
                case 1: rank = "Ненадежный"; break;
                case 2: rank = "Подтвержденный"; break;
                case 3: rank = "Профессионал"; break;
                case 4: rank = "Заместитель"; break;
                case 5: rank = "Главный хакер"; break;
            }
            embed.addField(`Статус:`, rank)
            .addField(`Репутация:`, users[message.mentions.members.first().id].rep)
            .addField(`Предупреждения:`, users[message.mentions.members.first().id].warns + `/3`)
            .setFooter("Dark Shark")
            .setColor("#2891db")
            .setTimestamp(new Date())
        message.author.send(embed)    
    }
    //Команда "users"
    if(cmd == `${prefix}users`){
        message.delete()
        if(users[message.author.id].rank < 4) return;
        let list = ""
        for (var prop in users) {
            list += `**` + users[prop].nick + `**\n`
        }
        let embed = new Discord.RichEmbed()
            .setAuthor(`Члены группировки:`)
            .setDescription(list)
            .setFooter("Dark Shark")
            .setColor("#2891db")
            .setTimestamp(new Date())
        message.author.send(embed)    
    }
    //Команда "setnick"
    if(cmd == `${prefix}setnick`){
        message.delete()
        if(users[message.author.id].rank < 5) return;
        if(!message.mentions.members.first()){
            message.reply("вы не выбрали пользователя, которому хотите изменить псевдоним.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        if(!users[message.mentions.members.first().id]){
            message.reply("аккаунт не найден!")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        if(!args.slice(1).join(" ")){
            message.reply("вы не указали новый псевдоним.")
            .then(message => { 
                setTimeout(() => {
                    message.delete()
                }, 3000);
            })
            return
        }
        message.channel.send(`${message.author} изменил псевдоним ${message.mentions.members.first()} с \`${users[message.mentions.members.first().id].nick}\` на \`${args.slice(1).join(" ")}\`.`)
        users[message.mentions.members.first().id].nick = args.slice(1).join(" ");
        fs.writeFile('./database/users.json', JSON.stringify(users),(err) => {
            if(err) console.log(err);
        });
        message.mentions.members.first().setNickname(args.slice(1).join(" "))
    }
    //Команда "help"
    if(cmd == `${prefix}help`){
        message.delete()
        let embed = new Discord.RichEmbed()
            .setAuthor(`Команды бота.`)
            .setDescription("Список всех команд бота приведен ниже.")
            .addField("!profile", "Посмотреть свой профиль.")
            .addField("!checkprofile [Пользователь]", "Посмотреть чужой профиль. [Для заместителей]")
            .addField("!register [Пользователь] [Псевдоним]", "Внести нового пользователя в базу данных. [Для заместителей]")
            .addField("!delacc [Пользователь]", "Удалить аккаунт из базы данных. [Для заместителей]")
            .addField("!giverep [Пользователь] [Кол-во очков]", "Изменить репутацию пользователя. [Для заместителей]")
            .addField("!warn [Пользователь] [Причина]", "Выдать варн пользователю. 3 варна = бан. [Для заместителей]")
            .addField("!unwarn [Пользователь]", "Снять варн пользователю. [Для заместителей]")
            .addField("!addzam [Пользователь]", "Поставить заместителя. [Для Главных Хакеров]")
            .addField("!delzam [Пользователь]", "Снять заместителя. [Для Главных Хакеров]")
            .addField("!setnick [Пользователь] [Псевдоним]", "Изменить псевдоним пользователя. [Для Главных Хакеров]")
            .setFooter("Dark Shark")
            .setColor("#2891db")
            .setTimestamp(new Date())
        message.author.send(embed)
    }
});

async function clean(text) {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

bot.login(process.env.BOT_TOKEN)
