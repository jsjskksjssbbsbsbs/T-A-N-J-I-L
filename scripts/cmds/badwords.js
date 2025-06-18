module.exports = {
  config: {
    name: "badwords",
    version: "1.0",
    author: "T A N J I L 🎀",
    countdown: 5,
    role: 1,
    shortDescription: {
      en: "Kick users who use bad language"
    },
    longDescription: {
      en: "Auto-kick users who say offensive/bad words in chat"
    },
    category: "group",
    guide: {
      en: "/badwords on\n/badwords off"
    }
  },

  onStart: async function ({ message, event, args, threadsData }) {
    const threadID = event.threadID;
    const status = args[0];

    if (status === "on") {
      await threadsData.set(threadID, true, "badwords");
      return message.reply("✅ Badwords system ENABLED! Now galiyars will be kicked.");
    } else if (status === "off") {
      await threadsData.set(threadID, false, "badwords");
      return message.reply("❌ Badwords system DISABLED!");
    } else {
      return message.reply("⚠️ Use: /badwords on | off");
    }
  },

  onChat: async function ({ event, threadsData, api }) {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const messageText = (event.body || "").toLowerCase();

    const isEnabled = await threadsData.get(threadID, "badwords");
    if (!isEnabled) return;

    const badWordList = [
      "mc", "bc", "bhosdike", "madarchod", "chod", "lund", "gaand", "bsdk", "chutiya",
      "মাদারচোদ", "চুদ", "চুদা", "চুদছি", "চুদি", "মাগি", "বেশ্যা", "মাল", "mg", "magi", "sexy", "xoda",
      "sex","ধর", "যৌন", "সেক্স", "fuck", "asshole","khankir pola", "khanki", "pussy", "tudi", "nangi","মাদারচোদ", "চুদি", "চুদা", "চুদ", "চোদ", "গান্ডু", "গুদ", "মাগি", "বেশ্যা", "খানকি",
      "মাদারফাকার", "ঝাড়", "মাল", "বীর্য", "গুদে", "চুলকি", "ন্যাংটা", "পাকা মেয়ে", "ধোন",
      "চুল", "থাপড়াবো", "চুষবি", "ঢুকাবো", "পাছা", "চু*বি", "চু*দে দিবো",
      "পাছায় মারবো",
      "madarchod", "bhenchod", "chutiya", "chudne", "lund", "gaand", "kuttiya", "randi",
      "chusle", "lavde", "behnke", "bhosdike", "teri maa ki", "maa ke laude", "gaand fat gayi",
      "chudwa diya","lavdi", "bhen ke lode", "chutiya sale",
      "fuck", "motherfucker","bitch", "bastard", "dick", "cock", "pussy",
      "slut", "whore", "son of a bitch", "cunt", "jerk", "wanker", "shithead", "fucker",
      "bullshit", "damn", "suck my dick", "suck it", "dickhead", "blowjob", "dildo",
      "gangbang", "cumshot", "creampie", "rimjob", "porn", "nudes",
      "mc", "bc", "mf", "bkl", "f*ck", "m@therfucker", "ch0d", "ch**ya", "l*nd", "g@nd",
      "p*ssy", "d*ck", "s*x", "b!tch", "n@ng!", "s#x", "r@pe",
      "くそ", "씨발", "merde", "puta", "putain", "fick dich", "kanina mo","sex","sexy",
    ];

    // Escape special chars for regex safety
    const escapedWords = badWordList.map(word => word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'i');

    if (regex.test(messageText)) {
      try {
        await api.removeUserFromGroup(senderID, threadID);
        api.sendMessage(`👢 ${event.senderID} kicked for using bad language.`, threadID);
      } catch (err) {
        api.sendMessage(`❌ Couldn't kick user: ${err}`, threadID);
      }
    }
  }
};
