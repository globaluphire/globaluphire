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
  const documentArray = [];
  // looping through all selected templates to send
  for (const doc of template) {
    try {
      let envelope = makeEnvelope(doc, recipient, user);
      // send the envelope
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
      // store response in supabase
      await supabase.from("document_signing").insert(documentObj);
      documentArray.push(documentObj);
    } catch (error) {
      console.error(`Error creating envelope: ${error}`);
    }
  }
  // returning array
  return documentArray;
}

function makeEnvelope(template, recipient, user) {
  // Create the envelope definition
  let env = new docusign.EnvelopeDefinition();
  env.templateId = template.templateId;
  env.documentId = 1;

  // Create template role elements to connect the signer and cc recipients
  // to the template
  // We're setting the parameters via the object creation
  let hr = docusign.TemplateRole.constructFromObject({
    email: user.email,
    name: user.name,
    roleName: "HR",
  });
  let signer = docusign.TemplateRole.constructFromObject({
    email: recipient.email,
    name: recipient.name,
    roleName: "Signer",
  });

  // Create a cc template role.
  // We're setting the parameters via setters
  //   let cc1 = new docusign.TemplateRole();
  //   cc1.email = "";
  //   cc1.name = "";
  //   cc1.roleName = "cc";

  // Add the TemplateRole objects to the envelope object
  //   env.templateRoles = [signer1, cc1];
  env.templateRoles = [hr, signer];
  env.status = "sent"; // We want the envelope to be sent

  return env;
}
