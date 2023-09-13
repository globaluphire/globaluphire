const docusign = require("docusign-esign");
import { supabase } from "../../../config/supabaseClient";

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
      const { token, user, applicant, template, recipient } = req.body;

      if (user.role !== "ADMIN") {
        return res
          .status(405)
          .json({ status: 405, message: "Method not allowed" });
      }

      let dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(process.env.NEXT_DOCUSIGN_API_URL);
      dsApiClient.addDefaultHeader("Authorization", "Bearer " + token);

      let envelopesApi = new docusign.EnvelopesApi(dsApiClient);

      // Make the envelope request body
      const response = await createEnvelopes(
        envelopesApi,
        user,
        applicant,
        template,
        recipient
      );

      return res.status(200).json({ message: "success", data: response });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  } else {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }
}

async function createEnvelopes(
  envelopesApi,
  user,
  applicant,
  template,
  recipient
) {
  const documentArray = []
  for (const doc of template) {
    let envelope = makeEnvelope(doc, recipient);
    try {
      let results = await envelopesApi.createEnvelope(
        process.env.NEXT_DOCUSIGN_ACCOUNT_ID,
        {
          envelopeDefinition: envelope,
        }
      );
      const documentObj = {
        sender_name: user.name,
        sender_user_id: user.id,
        sender_email: user.email,
        receiver_name: applicant.name,
        receiver_email: recipient.email,
        application_id: applicant.application_id,
        applicant_name: applicant.name,
        envelope_id: results.envelopeId,
        template_id: doc.templateId,
        uri: results.uri,
        status: results.status,
      };
      await supabase.from("document_signing").insert(documentObj);
      documentArray.push(documentObj)
    } catch (error) {
      console.error(`Error creating envelope: ${error}`);
    }
  }
  return documentArray;
}

function makeEnvelope(template, recipient) {
  // Create the envelope definition
  let env = new docusign.EnvelopeDefinition();
  env.templateId = template.templateId;
  env.documentId = 1;

  // Create template role elements to connect the signer and cc recipients
  // to the template
  // We're setting the parameters via the object creation
  let signer1 = docusign.TemplateRole.constructFromObject({
    email: recipient.email,
    name: recipient.name,
    roleName: recipient.roleName,
  });

  // Create a cc template role.
  // We're setting the parameters via setters
  //   let cc1 = new docusign.TemplateRole();
  //   cc1.email = "";
  //   cc1.name = "";
  //   cc1.roleName = "cc";

  // Add the TemplateRole objects to the envelope object
  //   env.templateRoles = [signer1, cc1];
  env.templateRoles = [signer1];
  env.status = "sent"; // We want the envelope to be sent

  return env;
}
