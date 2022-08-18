import nodemailer from "nodemailer";

export const emailRepository = {
    async sendEmail(email: string | undefined, code: string) {

        const subject = "Confirmation of registration"
        const message = `<h1>Подтвердите регистрацию</h1> 
                                    <div> 
                                           <h3>Чтобы завершить регистрацию, перейдите по ссылке ниже</h3>
                                           <a href='https://express-start-prj.herokuapp.com/auth/registration-confirmation?code=${code}'>Подтвердить регистрацию</a> 
                                    </div>`

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "yakovlevnode@gmail.com",
                pass: "xentulzzgvrotwrj",
            },
        });

        const info = await transporter.sendMail({
            from: '"Egor Yakovlev 👻" <yakovlevnode@gmail.com>',
            to: email,
            subject: subject,
            html: message,
        });
        return (info.response).split(' ')[0]
    }
}