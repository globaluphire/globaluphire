const axios = require("axios");

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { token } = req.query;
      const response = await axios.get(
        `${process.env.NEXT_DOCUSIGN_API_URL}/restapi/v2.1/accounts/${process.env.NEXT_DOCUSIGN_ACCOUNT_ID}/templates`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.response.status === 200) {
        const templates = await response.data;
        return res.status(200).json({ message: "Success", data: templates });
      }
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 403) {
        return res.status(401).json({ message: "Token expired or invalid" });
      } else {
        return res
          .status(error.response.status)
          .json({ message: "DocuSign Error" });
      }
    }
  } else {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }
}
