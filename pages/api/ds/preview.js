const docusign = require("docusign-esign");
import { envConfig } from "../../../config/env";

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
      const { token, template } = req.body;
      // create ds client
      let dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(envConfig.DOCUSIGN_API_URL);
      dsApiClient.addDefaultHeader("Authorization", "Bearer " + token);
      // use TemplateApi class
      let templatesApi = new docusign.TemplatesApi(dsApiClient);
      // call function getPages
      const preview = await templatesApi.getPages(
        envConfig.DOCUSIGN_ACCOUNT_ID,
        template.templateId,
        "1",
        { count: template.pageCount }
      );
      return res.status(200).send(preview);
    } catch (error) {
      return res
        .status(400)
        .json({ status: 400, message: "Some Error Occured!" });
    }
  } else {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }
}
