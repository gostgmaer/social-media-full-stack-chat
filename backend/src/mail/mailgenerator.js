const Mailgen = require("mailgen");
const { emailName } = require("../config/setting");

const MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: emailName,
      link: "https://google.com",
    },
  });


let EmailBody = MailGenerator.generate(mailBody);


module.exports = EmailBody;
