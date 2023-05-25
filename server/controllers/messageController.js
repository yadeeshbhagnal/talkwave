const Messages = require("../models/messageModel");
const cryptoJS = require('crypto-js')

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      const bytes = cryptoJS.AES.decrypt(msg.message.text, process.env.SECRET_KEY)
      const decryptedMsg = bytes.toString(cryptoJS.enc.Utf8);
      return {
        fromSelf: msg.sender.toString() === from,
        message: decryptedMsg,
        time: msg.createdAt
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const encryptedMsg = cryptoJS.AES.encrypt(message, process.env.SECRET_KEY).toString();
    const data = await Messages.create({
      message: { text: encryptedMsg },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};
