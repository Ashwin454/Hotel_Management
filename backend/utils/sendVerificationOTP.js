const { Resend } = require("resend");
const sendEmailVerificationModel = require("../models/emailVerification");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmailVerificationOTP = async (req, user) => {
    const otp = Math.floor(1000 + Math.random() * 9000);

    await new sendEmailVerificationModel({
        userId: user._id,
        otp: otp
    }).save();

    const otpVerificationLink = `${process.env.FRONTEND_HOST}/account/verify-email`;

    await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "OTP for Account verification",
        html: `
        <p>Dear ${user.name},</p>
        <p>Verify your email using the OTP below:</p>
        <h2>${otp}</h2>
        <p>Or visit: ${otpVerificationLink}</p>
        `
    });

    return otp;
};

module.exports = sendEmailVerificationOTP;