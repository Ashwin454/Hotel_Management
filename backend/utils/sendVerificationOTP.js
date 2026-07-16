const { Resend } = require("resend");
const sendEmailVerificationModel = require("../models/emailVerification");

const resend = new Resend('re_9nDMHXjB_PWqvW96NNqFfdnDmfrxexYHn');

const sendEmailVerificationOTP = async (req, user) => {
    try {
        const otp = Math.floor(1000 + Math.random() * 9000);

        await new sendEmailVerificationModel({
            userId: user._id,
            otp: otp
        }).save();

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: user.email,
            subject: "OTP for Account verification",
            html: `
            <p>Dear ${user.name},</p>
            <p>Verify your email using the OTP below:</p>
            <h2>${otp}</h2>
            `
        });

        return otp;

    } catch (err) {
        console.log("EMAIL OTP ERROR 👉", err.message);
        return null; // ⚠️ do NOT crash server
    }
};
module.exports = sendEmailVerificationOTP;