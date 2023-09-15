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
      // get document details from supabase
      const userTemplates = await supabase
        .from("document_signing")
        .select("*")
        .match({
          sender_user_id: user.id,
          application_id: applicant.application_id,
          sender_email: user.email,
        });

      let envelopesApi = new docusign.EnvelopesApi(dsApiClient);

      // Promise for async
      const updatedTemplates = await Promise.all(
        templates.envelopeTemplates.map(async (template) => {
          // match templateId from all the templates available to get envelope_id
          const matchingUserTemplate = userTemplates.data.find(
            (userTemplate) => userTemplate.template_id === template.templateId
          );
          // matched templates are the ones which are sent/completed
          if (matchingUserTemplate) {
            // get envelope data using envelope_id
            const response = await envelopesApi.getEnvelope(
              process.env.NEXT_DOCUSIGN_ACCOUNT_ID,
              matchingUserTemplate.envelope_id
            );
            // update documen_signing table
            await supabase
              .from("document_signing")
              .update({ status: response.status })
              .eq("id", matchingUserTemplate.id);
            // appened envelope data
            template.envelope = response;
          }
          return template;
        })
      );
      return res
        .status(200)
        .json({ message: "Success", data: updatedTemplates });
    } catch (error) {
      console.log(error);
    }
  } else {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }
}
