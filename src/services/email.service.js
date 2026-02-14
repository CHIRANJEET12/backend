const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error connecting to email server:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Generic email sender
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('📨 Message sent:', info.messageId);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

// Registration email function
const sendRegistrationEmail = async (userEmail, name) => {
  const subject = 'Welcome to Our Platform 🎉';

  const text = `
Hi ${name},

Welcome to our platform! We're excited to have you onboard.

Best Regards,
Your Team
`;

  const html = `
<h2>Hi ${name},</h2>
<p>Welcome to <strong>our platform</strong>! 🎉</p>
<p>We're excited to have you onboard.</p>
<br/>
<p>Best Regards,<br/>Your Team</p>
`;

  return sendEmail(userEmail, subject, text, html);
};

// Export properly
module.exports = {
  transporter,
  sendEmail,
  sendRegistrationEmail,
};
