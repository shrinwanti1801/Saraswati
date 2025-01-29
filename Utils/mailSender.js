const nodemailer=require('nodemailer');

const mailSender=async function(email,title,body){
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            },
          });

          const info = await transporter.sendMail({
            from: process.env.MAIL_USER, // sender address
            to:   email, // list of receivers
            subject: title,
            html: body,
          });
        
          //console.log(info);
          return info;
    }
    catch(error){
        console.log(error);
    }
}

module.exports=mailSender;