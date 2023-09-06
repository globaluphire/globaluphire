import { Twilio } from "twilio";

export default async function handler(req, res) {
  const twilioClient = new Twilio(
    process.env.NEXT_TWILIO_ACCOUNT_SID,
    process.env.NEXT_TWILIO_AUTH_TOKEN
  );
  if (req.method == "POST") {
    await twilioClient.messages
      .create({
        body: req.body.content,
        // Check number from Twilio if changed
        from: process.env.NEXT_TWILIO_NUMBER,
        to: req.body.recepient,
      })
      .then(() => {
        res.status(200).json({ status: "SUCCESS" });
      })
      .catch((error) => {
        console.log(error)
        res.status(500).json({ status: "Internal server error" });
      });
  } else {
    res.status(405).json({ status: 405, message: "Method not allowed" });
  }
}
