const jwt = require("jsonwebtoken");
const axios = require("axios");
import { supabase } from "../../../config/supabaseClient";

export default async function handler(req, res) {
  if (req.method == "GET") {
    // create jwt using rsa and other keys
    const generatedJWT = await createJWT();
    // get access token from ds
    const response = await getDsAccessToken(generatedJWT);
    return res.status(200).json({ message: "success", data: response.data });
  } else {
    return res.status(405).json({ status: 405, message: "Method not allowed" });
  }
}

// create jwt grant using your keys for docusign
async function createJWT() {
  const payload = {
    iss: process.env.NEXT_DOCUSIGN_INTEGRATION_KEY,
    sub: process.env.NEXT_DOCUSIGN_USER_ID,
    aud: "account-d.docusign.com",
    iat: Math.floor(Date.now() / 1000), // Current Unix Epoch Time
    // use short lived tokens
    exp: Math.floor(Date.now() / 1000) + 600, // Expires in 600 seconds (10 minutes)
    scope: "signature impersonation",
  };

  try {
    // Load your private key without replacing '\n' characters.
const privateKey = JSON.parse(process.env.NEXT_DOCUSIGN_RSA_KEY);
    const token = jwt.sign(payload, privateKey.privateKey, {
      algorithm: "RS256",
    });
    return token;
  } catch (error) {
    console.error("Error creating JWT:", error);
    return null; // Return null or handle the error as needed.
  }
}

// request docuSign for access_token
async function getDsAccessToken(generatedJWT) {
  try {
    const response = await axios.post(
      "https://account-d.docusign.com/oauth/token",
      {
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: generatedJWT,
      }
    );
    return response;
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
  }
}
