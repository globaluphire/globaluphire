import nodemailer from "nodemailer";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { email, subject, text } = req.body;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "",
                pass: "",
            },
        });

        const mailOptions = {
            from: "",
            to: email,
            subject: subject,
            text: text,
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("Email sent: " + info.response);
            res.status(200).json({ message: "Email sent successfully" });
        } catch (error) {
            console.error("Error occurred while sending email:", error);
            res.status(500).json({ message: "Failed to send email" });
        }
    } else {
        res.status(405).end();
    }
}
