import { Twilio } from "twilio";
import { config } from "../../config/env"

export default async function handler(req, res) {
  const twilioClient = new Twilio(
    config.TWILIO_ACCOUNT_SID,
    config.TWILIO_AUTH_TOKEN
  );
  if (req.method == "POST") {
    try {
      const response = await twilioClient.messages.create({
        body: req.body.content,
        // Check number from Twilio if changed
        from: config.TWILIO_NUMBER,
        to: req.body.recipient,
      });
      return res.status(200).json({ status: "success", data: response });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "Internal server error" });
    }
  } else {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }
}
