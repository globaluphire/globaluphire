const docusign = require("docusign-esign");

export default async function handler(req, res) {
  if (req.method == "POST") {
    const { token, template } = req.body;
    const templateId = template.templateId;
    const documentId = template.documentId;
    let dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath(process.env.NEXT_DOCUSIGN_API_URL);
    dsApiClient.addDefaultHeader("Authorization", "Bearer " + token);
    let templatesApi = new docusign.TemplatesApi(dsApiClient);
    const preview = await templatesApi.getPages(
      process.env.NEXT_DOCUSIGN_ACCOUNT_ID,
      templateId,
      documentId
    );
    return res.status(200).send(preview);
  } else {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }
}
