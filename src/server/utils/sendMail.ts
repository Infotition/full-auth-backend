//* ------------------- DEPENDENCIES ------------------ *\\

//* Node modules
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

//* ------------------ CONFIGURATION ------------------ *\\

const { OAuth2 } = google.auth;

//* Setup OAuth2 Client
const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

//* Set Refresh Token for OAuth2 Client to get fresh access token
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

//* Config the SMTP Protocol with nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    type: 'OAuth2',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
});

//* ------------------- Controllers ------------------- *\\

/**
 * Sends a mail with body data.
 *
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 */
async function sendMail(
  to: string,
  subject: string,
  html: string,
  callback: Function
) {
  //* Configure Mail
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to,
    subject,
    generateTextFromHTML: true,
    html,
    auth: {
      user: process.env.MAIL_FROM,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: oauth2Client.getAccessToken(),
    },
  };

  //* Use the configured protocol to send the mail
  transporter.sendMail(mailOptions, (error, mailRes) => {
    //* Close the protocol, to use it again
    transporter.close();

    if (error) {
      callback({
        success: false,
        message: 'errors while sending mail',
        errors: [error],
      });
    }

    callback({
      success: true,
      message: 'successfully sent mail',
      mailRes,
    });
  });
}

//* --------------------- EXPORTS --------------------- *\\

export default sendMail;
