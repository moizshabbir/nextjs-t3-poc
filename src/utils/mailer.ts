import nodemailer from 'nodemailer';

export async function sendLoginEmail(email: string, url: string, token: string) {
    const testAccount = await nodemailer.createTestAccount()

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    })

    const info = await transporter.sendMail({
        from: "Test Account <moiz.sf@gmail.com>", 
        to: email, 
        subject: 'Login to your account', 
        html: `Login by clicking here <a href="${url}/login#token=${token}">${url}/login#token=${token}</a>`
    });

    console.log(`Preview url: ${nodemailer.getTestMessageUrl(info)}`)
}