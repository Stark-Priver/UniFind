import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export async function sendMatchNotification(userEmail: string, matchedItem: any) {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: userEmail,
    subject: 'Potential Match Found for Your Item',
    html: `
      <h1>We Found a Potential Match!</h1>
      <p>A ${matchedItem.type} item has been reported that matches your criteria:</p>
      <h2>${matchedItem.title}</h2>
      <p>${matchedItem.description}</p>
      <p>Location: ${matchedItem.location.coordinates.join(', ')}</p>
      <a href="${process.env.NEXT_PUBLIC_URL}/items/${matchedItem._id}">View Item Details</a>
    `
  };

  await transporter.sendMail(mailOptions);
}