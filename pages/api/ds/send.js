const docusign = require("docusign-esign");

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
      const data = req.body;
      let dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(process.env.NEXT_DOCUSIGN_API_URL);
      dsApiClient.addDefaultHeader(
        "Authorization",
        "Bearer " + data.accessToken
      );
      let envelopesApi = new docusign.EnvelopesApi(dsApiClient);

      // Make the envelope request body
      let envelope = makeEnvelope(data);

      // Call Envelopes::create API method
      // Exceptions will be caught by the calling function
      let results = await envelopesApi.createEnvelope(
        process.env.NEXT_DOCUSIGN_ACCOUNT_ID,
        {
          envelopeDefinition: envelope,
        }
      );
      return res.status(200).json({ message: "success", data: results });
    } catch (error) {
      console.log(error.response);
      return res.status(500).json({ message: "Internal Server Error!" });
    }
  } else {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }
}

function makeEnvelope(data) {
  // Create the envelope definition
  let env = new docusign.EnvelopeDefinition();
  env.templateId = data.templateId;

  // Create template role elements to connect the signer and cc recipients
  // to the template
  // We're setting the parameters via the object creation
  let signer1 = docusign.TemplateRole.constructFromObject({
    email: data.recipientEmail,
    name: data.recipientName,
    roleName: data.recipientRole,
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
