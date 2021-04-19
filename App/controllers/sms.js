require('dotenv').config();

const accountSid ='AC2dfaad355955929cb648fccdfc2fa6e9'; // Your Account SID from www.twilio.com/console
const authToken = process.env.TOKEN;   // Your Auth Token from www.twilio.com/console


const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

module.exports = client;

