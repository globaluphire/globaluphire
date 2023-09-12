const docusign = require("docusign-esign");

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { token } = req.query;
      let dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(process.env.NEXT_DOCUSIGN_API_URL);
      dsApiClient.addDefaultHeader(
        "Authorization",
        "Bearer " + token
      );
      let templatesApi = new docusign.TemplatesApi(dsApiClient);
      const templates = await templatesApi.listTemplates(process.env.NEXT_DOCUSIGN_ACCOUNT_ID)
      return res.status(200).json({ message: "Success", data: templates });
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
