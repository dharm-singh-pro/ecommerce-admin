const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "carlos.walter63@ethereal.email",
    pass: "6pKD4DXYr4ZuHYqYDd",
  },
});

// async..await is not allowed in global scope, must use a wrapper
exports.sendEMail = async(mailData={}) => {

  try{
    const {to = null, subject = '' , text = '' , html = '' } = mailData;

    const from = process.env.SENDER_EMAIL??null;

      console.log('>>df',from);

    if(!from || !to){
      return {statusCode:401,msg:'Sender or reciever is not found.'};
    }

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent: %s", info.messageId,info,{
      from,
      to,
      subject,
      text,
      html,
    });
  }catch(error){
    return {statusCode:401,msg:error};
  }
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}