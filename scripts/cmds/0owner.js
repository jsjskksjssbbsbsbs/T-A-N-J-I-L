const { getStreamFromURL } = require("fb-watchman");

module.exports = {
  config: {
    name: "owner",
    version: 2.0,
    author: "〲 T A N J I L ツ",
    longDescription: "info about bot and owner",
    category: "Special",
    guide: {
      en: "{p}{n}",
    },
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const imgURL = "https://files.catbox.moe/5thzzz.mp4";
    const attachment = await global.utils.getStreamFromURL(imgURL);

    const id = event.senderID;
    const userData = await usersData.get(id);
    const name = userData.name;

    const ment = [{ id: id, tag: name }];
    
    const a = "✨YOUR 卝 চুন্নি✨";
    const b = "/"; // Prefix
    const c = "〲 T A N J I L ツ";
    const e = "Male";
    const f = "𝟏𝟗 ±";
    const g = "𝐒𝐢𝐧𝐠𝐥𝐞";
    const h = "𝐈𝐧𝐭𝐞𝐫 𝟑";
    const i = "𝐃𝐡𝐚𝐤𝐚";
    const d = "𝟎𝟏𝟕𝟒𝟗𝟑𝟏𝟓𝟏𝟓𝟕";

    message.reply({ 
      body: `
╭────────֍
│Hello  ${name} 
│
│✨Bot: ${a}
│✨ Bot's prefix: ${b}  
│
│✨Owner: ${c}
│✨ Gender: ${e}
│
│✨ Number: ${d}
│✨ Age: ${f}
│✨ Relationship: ${g}
│
│✨Class: ${h}
│✨ Basa: ${i}
╰────────────────֍`,
      mentions: ment,
      attachment: attachment
    });
  }
};
