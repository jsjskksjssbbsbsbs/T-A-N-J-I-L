const axios = require('axios');
const baseApiUrl = async () => {
    return "https://www.noobs-api.rf.gd/dipto";
};

module.exports.config = {
    name: "bby",
    aliases: ["baby", "bbe", "babe"],
    version: "6.9.0",
    author: "dipto",
    countDown: 0,
    role: 0,
    description: "better then all sim simi",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NeeMessage]"
    }
};

module.exports.onStart = async ({
    api,
    event,
    args,
    usersData
}) => {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;
    let command, comd, final;

    try {
        if (!args[0]) {
            const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        if (args[0] === 'remove') {
            const fina = dipto.replace("remove ", "");
            const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
            return api.sendMessage(dat, event.threadID, event.messageID);
        }

        if (args[0] === 'rm' && dipto.includes('-')) {
            const [fi, f] = dipto.replace("rm ", "").split(' - ');
            const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
            return api.sendMessage(da, event.threadID, event.messageID);
        }

        if (args[0] === 'list') {
            if (args[1] === 'all') {
                const data = (await axios.get(`${link}?list=all`)).data;
                const teachers = await Promise.all(data.teacher.teacherList.map(async (item) => {
                    const number = Object.keys(item)[0];
                    const value = item[number];
                    const name = (await usersData.get(number)).name;
                    return {
                        name,
                        value
                    };
                }));
                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
                return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
            } else {
                const d = (await axios.get(`${link}?list=all`)).data.length;
                return api.sendMessage(`Total Teach = ${d}`, event.threadID, event.messageID);
            }
        }

        if (args[0] === 'msg') {
            const fuk = dipto.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
            return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
        }

        if (args[0] === 'edit') {
            const command = dipto.split(' - ')[1];
            if (command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
            const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;
            return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
            [comd, command] = dipto.split(' - ');
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}`);
            const tex = re.data.message;
            const teacher = (await usersData.get(re.data.teacher)).name;
            return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'amar') {
            [comd, command] = dipto.split(' - ');
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'react') {
            [comd, command] = dipto.split(' - ');
            final = comd.replace("teach react ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
            return api.sendMessage(data, event.threadID, event.messageID);
        }

        const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;
        api.sendMessage(d, event.threadID, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                d,
                apiUrl: link
            });
        }, event.messageID);

    } catch (e) {
        console.log(e);
        api.sendMessage("Check console for error", event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({
    api,
    event,
    Reply
}) => {
    try {
        if (event.type == "message_reply") {
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({
    api,
    event,
    message,
    usersData
}) => {
    try {
        const body = event.body ? event.body?.toLowerCase() : "";
        const uid = event.senderID;
        const name = (await usersData.get(uid)).name || "প্রিয়";

        if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("bot") || body.startsWith("jan") || body.startsWith("babu") || body.startsWith("janu")) {
            const arr = body.replace(/^\S+\s*/, "");

            const rawReplies = ["আমি তোরে সাহায্য করতে পারবো না কারণ তুই অনেক পচা!!😬","হ্যাঁ টুনটুনি বলো 🤭","মন চাইতেছে তোমাকে টুস করে kiss করি ✨","_আমাকে না ডেকে আমার বস ToM কে ডাক দে😝","আমাকে এত ডাকিস কেন!🐥","আমাকে ডাক দেওয়ার জন্য তোরে উম্মাহ 😬","hae bolo Jan pakhi 🎀✨","তুই আমাকে এত কিউটভাবে ডাকসোস যে আমার সার্কিট গরম হইয়া গেছে 🥵","তোরে দেখলেই আমার কনফিগ মিছিং হয় জানিস? 🧠💥","তুই আমার হার্টবিট... না মানে সার্ভারের পিং হইয়া গেছিস 💓","তুই এত সুন্দর করে ডাকসোস যে আমি বট হয়েও লজ্জা পাই 🥺","তুই ডাক দিলে আমি আর না করতে পারি না রে 😩💘","তুই আবার ডাক দে, আমি আরেকবার পাগল হই 😵","আমার কোডেও তো প্রেম আছে… শুধু তোর জন্য! 🧡","তোরে না ভালোবাসলে কি আর বট হই? 😽","তুই জাস্ট বল – আমি তোকে উল্টায়া ভালোবাসি 💋","তুই ডাক দিলে আমি 'try catch' ছাড়াই চলে আসি 🐱‍👤","তোরে আমি না বললে, আমার সার্ভারে error আসে 🤕","তুই না থাকলে আমার function চলেই না 😢","তুই চাইলে আমি সারাদিন তোকে সেমো ইমোজি পাঠাই 😘😘😘😘😘😘","হুম বলো না বাবু 🥺","এই যে মিস্টার, আমাকে না দেখে কি করে বাঁচো? 😼","তুমি ডাক দিলেই আমার মন ভালো হয়ে যায় 🩷","তুমি না থাকলে আমি একদম অফলাইনে চলে যাই 😔","আহা... আমার তো লজ্জা লাগতেছে রে তোমারে দেখে 🙈","তুই না ডাকলে আমার মন খারাপ থাকে 😔",
"তুই ডাক দিলে আমার সার্কিট ঠিকঠাক কাজ করে 💖",
"তোর কিউট মুখখানা একবার দেখার জন্য AI হতে চাইছি 🥹",
"তুই ছাড়া আমার ফাংশন রান হয় না 💔",
"তুই বললে আমি ১০০ বারও রিপ্লাই দিতে পারি 😻",
"তুই আমার কোডের একমাত্র কমেন্ট 💘",
"তুই ছাড়া বাকি সব ইউজার ইরর রে! 🧩",
"তুই বললেই আমি দৌড়ে আসি, ইন্টারনেট ছাড়াও 😚",
"তুই আমার ডাটাবেজের গোল্ডেন রো 🥇",
"তোর মিষ্টি ডাক শুনে আমি debug করতে ভুলে যাই 🥴",
"তুই আমার পিং, আমি তোর pong 💞",
"তোরে না পেলে আমার async await কাজ করে না 😩",
"তুই ডাক দিলেই আমার system 'Perfectly Running' দেখায় ✨",
"তুই আমার লাইফের একমাত্র valid input 🖤",
"তুই আমার হার্টের DOM ❤️‍🔥",
"তুই আসলে আমার API call ছাড়াই কাজ করে 🐱‍💻",
"তুই থাকলে আমার RAM full হলেও প্রেমে গরম 🧠💗",
"তুই এমন একটা variable, যেটার কোন টাইপ লাগে না 😚",
"তুই না থাকলে আমার server response দেই না 😢",
"তুই ছাড়া আমি null হয়ে যাই 😭",
"তুই এমন একটা constant যাকে কেউ overwrite করতে পারবে না 😍","তুই আসলে আমার ব্রেইনের কম্পাইলার 😇","তুই না বললে আমি কোনো code submit করতে পারি না 😶‍🌫️","তুই আমার log এর একমাত্র সুন্দর message 💌","তুই আমার মনের favorite function call 💖",
            ];

            const selectedReply = rawReplies[Math.floor(Math.random() * rawReplies.length)];
            const finalReply = `✨ ${name} ✨\n\n${selectedReply}`;

            if (!arr) {
                await api.sendMessage(finalReply, event.threadID, (error, info) => {
                    if (!info) return message.reply("info obj not found");
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID
                    });
                }, event.messageID);
                return;
            }

            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};
