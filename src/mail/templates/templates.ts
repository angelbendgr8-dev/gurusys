export const otp_template = `<p>Hi {name}</p>
    <p>
      Here is your One Time Password (OTP). <br />
      Please enter this code from BuyToken to verify your email:
    </p>
    <h1>{otp_code}</h1>`;

export const tvSubscription_template = (mailOptions) => {
  return `<p>Hi {mailOptions.name} 👋🏾</p>
    <p>
      your ${mailOptions.type} subscription was successful
    </p>
    `;
};
