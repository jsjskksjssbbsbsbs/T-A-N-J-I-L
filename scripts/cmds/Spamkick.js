module.exports = {
  config: {
    name: "spamkick",
    version: "1.0",
    author: "T A N J I L 🎀",
    countdown: 5,
    role: 1,
    shortDescription: {
      en: "Kick user for spamming"
    },
    longDescription: {
      en: "Kicks user if they send 5 messages in 10 seconds"
    },
    category: "group",
    guide: {
      en: "/spamkick on\n/spamkick off"
    }
  },

  onStart: async function ({ message, event, args, threadsData }) {
    const threadID = event.threadID;
    const status = args[0];

    if (status === "on") {
      await threadsData.set(threadID, true, "spamkick");
      return message.reply("✅ SpamKick system has been ENABLED!");
    } else if (status === "off") {
      await threadsData.set(threadID, false, "spamkick");
      return message.reply("❌ SpamKick system has been DISABLED!");
    } else {
      return message.reply("⚠️ Use: /spamkick on | off");
    }
  },

  onChat: async function ({ event, threadsData, api }) {
    const threadID = event.threadID;
    const senderID = event.senderID;
    const isEnabled = await threadsData.get(threadID, "spamkick");

    if (!isEnabled) return;

    if (!global.spamTrack) global.spamTrack = {};
    if (!global.spamTrack[threadID]) global.spamTrack[threadID] = {};

    const now = Date.now();
    const timeLimit = 10 * 1000; // 10 seconds
    const msgLimit = 5;

    if (!global.spamTrack[threadID][senderID])
      global.spamTrack[threadID][senderID] = [];

    // Add current timestamp
    global.spamTrack[threadID][senderID].push(now);

    // Filter timestamps within time window
    global.spamTrack[threadID][senderID] = global.spamTrack[threadID][senderID].filter(
      t => now - t <= timeLimit
    );

    if (global.spamTrack[threadID][senderID].length >= msgLimit) {
      try {
        await api.removeUserFromGroup(senderID, threadID);
        delete global.spamTrack[threadID][senderID];
        api.sendMessage(`👢 User was kicked for spamming!`, threadID);
      } catch (err) {
        api.sendMessage(`❌ Can't kick user: ${err}`, threadID);
      }
    }
  }
};
