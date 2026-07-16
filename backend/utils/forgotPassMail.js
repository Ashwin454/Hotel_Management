const { Resend } = require("resend");

const resend = new Resend('re_9nDMHXjB_PWqvW96NNqFfdnDmfrxexYHn');

const sendEmail = async (options) => {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: options.email,
            subject: options.subject || "Password Reset",
            html: options.message
        });
    } catch (err) {
        console.log("EMAIL ERROR 👉", err.message);
    }
};
module.exports = sendEmail;