const axios = require("axios");

export default async function handler(req, res) {
  if (req.method == "GET") {
    const { token } = req.query;
    const response = await getDsTemplates(token);
    if (response?.errorCode) {
      return res.status(400).json({ message: "DocuSign Error" });
    } else {
      return res.status(200).json({ message: "success", data: response });
    }
  } else {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }
}
async function getDsTemplates(token) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_DOCUSIGN_API_URL}/restapi/v2.1/accounts/${process.env.NEXT_DOCUSIGN_ACCOUNT_ID}/templates`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
}
