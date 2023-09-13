const docusign = require("docusign-esign");
import { supabase } from "../../../config/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { token, user, applicant } = req.body;
      let dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(process.env.NEXT_DOCUSIGN_API_URL);
      dsApiClient.addDefaultHeader("Authorization", "Bearer " + token);
      let templatesApi = new docusign.TemplatesApi(dsApiClient);
      const templates = await templatesApi.listTemplates(
        process.env.NEXT_DOCUSIGN_ACCOUNT_ID
      );
      const userTemplates = await supabase
        .from("document_signing")
        .select("*")
        .match({
          sender_user_id: user.id,
          application_id: applicant.application_id,
          sender_email: user.email,
        });

      const updatedTemplates = templates.envelopeTemplates.map(
        (template) => {
          const matchingUserTemplate = userTemplates.data.find(
            (userTemplate) => userTemplate.template_id === template.templateId
          );
          if (matchingUserTemplate) {
            template.status = matchingUserTemplate.status;
            template.envelopeId = matchingUserTemplate.envelope_id;
            template.envelopeUri = matchingUserTemplate.uri;
            template.sentAt = matchingUserTemplate.created_at;
          }
          return template;
        }
      );
      // add status to all templates for a specific user
      return res.status(200).json({ message: "Success", data: updatedTemplates });
    } catch (error) {
      console.log(error);
    }
  } else {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }
}
