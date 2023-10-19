import { envConfig } from "../../../config/env";
const docusign = require("docusign-esign");

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { token, envelope, pageCount } = req.body;
            // create ds client
            const dsApiClient = new docusign.ApiClient();
            dsApiClient.setBasePath(envConfig.DOCUSIGN_API_URL);
            dsApiClient.addDefaultHeader("Authorization", "Bearer " + token);
            // use EnvelopesApi class
            const templatesApi = new docusign.EnvelopesApi(dsApiClient);
            // call function getPages
            const preview = await templatesApi.getPages(
                envConfig.DOCUSIGN_ACCOUNT_ID,
                envelope.envelopeId,
                1,
                { count: pageCount }
            );
            return res.status(200).send(preview);
        } catch (error) {
            return res
                .status(400)
                .json({ status: 400, message: "Some Error Occured!" });
        }
    } else {
        return res
            .status(405)
            .json({ status: 405, message: "Method not allowed" });
    }
}
