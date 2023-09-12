const jwt = require("jsonwebtoken");
const axios = require("axios");
import { supabase } from "../../../config/supabaseClient";

export default async function handler(req, res) {
  if (req.method == "GET") {
    const { email } = req.query;
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
    const generatedJWT = await createJWT();
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
    exp: Math.floor(Date.now() / 1000) + 600, // Expires in 600 seconds (10 minutes)
    scope: "signature impersonation",
  };

  try {
    // Load your private key without replacing '\n' characters.
    //   const privateKey = process.env.NEXT_DOCUSIGN_RSA_KEY;
    const privateKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqBohxgUFeB6g2A+xJ/mr
RYHLAvXseFhWUebPykNY39E4e4YDjKzHst7SH7vpqIxUjQmf7bUJzbXor0zrhSIK
4n98r21eJHo8qR/4ZXf9KP2r6/blajJ459QcghP0Oe2W838x9X6YstDfIDw9Mdon
jz25hH5g6eJEH/N2nwQY9N/ZKPBnqKiugTAM6TPdipsOPQSSiYXQJ+zEV0FJf7Ci
x02LSVwR2mhCGaDRuASyntBaj29RRwaVpuG5B4TE9/B7lDCesiCPvIAWKJoZyDUY
0xZo6Rhn2S/XPvAFx7MTuB1zONQQhcwPxjGYL0W84IAApknZS0UE4AGILcYosqFn
6QIDAQAB
-----END PUBLIC KEY-----
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAqBohxgUFeB6g2A+xJ/mrRYHLAvXseFhWUebPykNY39E4e4YD
jKzHst7SH7vpqIxUjQmf7bUJzbXor0zrhSIK4n98r21eJHo8qR/4ZXf9KP2r6/bl
ajJ459QcghP0Oe2W838x9X6YstDfIDw9Mdonjz25hH5g6eJEH/N2nwQY9N/ZKPBn
qKiugTAM6TPdipsOPQSSiYXQJ+zEV0FJf7Cix02LSVwR2mhCGaDRuASyntBaj29R
RwaVpuG5B4TE9/B7lDCesiCPvIAWKJoZyDUY0xZo6Rhn2S/XPvAFx7MTuB1zONQQ
hcwPxjGYL0W84IAApknZS0UE4AGILcYosqFn6QIDAQABAoIBABaNDuZ+357KKRS4
d4Z1LsilIq6+frR0UVGCb8diuoZSuHY7DQ3ZqJ6dLWjMGjVIwhemPg9dtTd6BaxC
sD53dH4HJpsYG8Qz+8r1JYBjP5HjWfrOmonhGdQr4ePXY8ZDp8z5oszxaJsQfJED
/nJKIaV3MoSM5FkWnWyrNMjHUXEZap86EAHrAIf5kixmsbwvbo2eOQcXFJbuUiOH
2uhqjvotC1h9d1w4jlMmLCegEXXy1ZyA/l9GX8HpHPIMAJT554ZjuSGcN7EHfnDS
f9vh14AmT+jbHuugNtvuzAk2sIYhdabvxgifSX6zSeCxydbsvyTzFDrHPOLqO6WH
etwdVtMCgYEA+P4yotrEEZqvMOWpl8zpRHD30uxjAoguqOcfRZynrLUhhUeq89pj
9Y38/GHe/Dgf7N+8ta/bWKc/s/rCW6NJYi05HMsWLW5kr3elmBjalhmqrcWXBogI
Pe52oVzRN5uCc75iLyHLSAnkyOP6PvHGXio2wsFfvgoE726uUHGMnS8CgYEArNUt
f0VuemL5hRLHCtz6EkoglBLJ5WYBHX7CjIoDRFQLuefol1kz3d350cfCTSdki56R
hNO3omEAjibde4Zwn9iAB/YiBhnQxxE2BYFbHuTK5rfu47Wqdcz+EulID8qmDzR7
QdyDSIs/WuBTSOrIMRCKVxUsJ5e+X+zFSLlt9mcCgYEA6dR+5SWhQA8OO1NSwzYy
Uo3sjm5kRPpzJzd1zL/jT3QC+NFnH/6WJQKk9LdM23wxrxgmdlGiIk1eq7zwTXK4
9bQWkI3AVAX6FDa+kmm0zYVpHiwTOpUBeHe7fKpX6GroRZ4jQrPv3cU8z9QZLIeN
jN0D9D35ldR+8gP1O6KHNQ0CgYEAj6/HXHkHyT4Bvc2HpxNh39S60v/v1ASCxte8
vIR9BNBu00bnSvSBN2I1MF/HvMcUQzM4PdqaX6gPgx7yoaB6f5nJj1TkonfR5736
UIdjjwKdYUTnmW5N4hPj4ysImwBaIGf8VRwUFTqXGGFJPGTcvFXI/W7/v4bbYfqB
Zd2ret8CgYB3p+PgKeSyFjD1g3MAbXQLaVV0bewMPukBAoe5ny0tTOmPMFbhCOZk
fNikRRaoQ2h1CyekbZTgVoAkcuDB7P/VjFaNxsYpnegMhl6EyA9sQMwHqRkN6O3M
YceL+58htUuvErAIfxB7vduvHjr0754SJk9t11TNC6V/kTIO8txw6w==
-----END RSA PRIVATE KEY-----`;
    const token = jwt.sign(payload, privateKey, {
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
