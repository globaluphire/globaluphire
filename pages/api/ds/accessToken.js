import { supabase } from "../../../config/supabaseClient";
import { envConfig } from "../../../config/env";
const jwt = require("jsonwebtoken");
const axios = require("axios");

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { email } = req.query;
        // validate user if admin or not
        const { data } = await supabase
            .from("users")
            .select("*")
            .filter("email", "eq", email);

        const user = data[0];
        if (user.role !== "ADMIN") {
            return res
                .status(405)
                .json({ status: 405, message: "Method not allowed" });
        }
        // create jwt using rsa and other keys
        const generatedJWT = await createJWT();
        // get access token from ds
        const response = await getDsAccessToken(generatedJWT);
        return res
            .status(200)
            .json({ message: "success", data: response.data });
    } else {
        return res
            .status(405)
            .json({ status: 405, message: "Method not allowed" });
    }
}

// create jwt grant using your keys for docusign
async function createJWT() {
    const payload = {
        iss: envConfig.DOCUSIGN_INTEGRATION_KEY,
        sub: envConfig.DOCUSIGN_USER_ID,
        aud: "account.docusign.com",
        iat: Math.floor(Date.now() / 1000), // Current Unix Epoch Time
        // use short lived tokens
        exp: Math.floor(Date.now() / 1000) + 600, // Expires in 600 seconds (10 minutes)
        scope: "signature impersonation",
    };

    try {
        // Load your private key without replacing '\n' characters.
        const privateKey = JSON.parse(envConfig.DOCUSIGN_RSA_KEY);
        const token = jwt.sign(payload, privateKey.privateKey, {
            algorithm: "RS256",
        });
        return token;
    } catch (error) {
        console.error("Error creating JWT:", error);
        throw new Error("Internal Server Error!");
    }
}

// request docuSign for access_token
async function getDsAccessToken(generatedJWT) {
    try {
        const response = await axios.post(envConfig.DOCUSIGN_ACCESS_TOKEN_URL, {
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: generatedJWT,
        });
        return response;
    } catch (error) {
        // Handle errors
        console.error("Error:", error);
        throw new Error("Internal Server Error!");
    }
}
