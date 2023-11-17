/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
import { envConfig } from "../../../../config/env";
import { reportItems } from "../../../../data/reports";
import Papa from "papaparse";
const mail = require("@sendgrid/mail");

export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const reportsArray = [];
            const emptyReportsArray = [];
            let message = "";

            for (let i = 0; i < reportItems.length; i++) {
                const response = await fetch(
                    `${envConfig.WEBSITE_URL}/api/report/${
                        reportItems[i].reportId - 1
                    }`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                const data = await response.json();
                const csv = Papa.unparse(data.data);

                if (data.data?.length === 0) {
                    emptyReportsArray.push(reportItems[i].reportName);
                }

                const base64EncodedContent =
                    Buffer.from(csv).toString("base64");

                reportsArray.push({
                    content: base64EncodedContent,
                    filename: `${reportItems[i].reportName}.csv`,
                    type: "text/csv",
                    disposition: "attachment",
                });
            }

            if (emptyReportsArray) {
                message = `Reports with 0 columns returned: <br/>
                ${JSON.stringify(emptyReportsArray)
                    .slice(1, -1)
                    .replace(/"/g, "")
                    .replace(/,\s*/g, "<br/>")}`;
            }

            mail.setApiKey(envConfig.SENDGRID_API_KEY);
            const msg = {
                to: envConfig.EMAIL_REPORT,
                from: "support@globaluphire.com",
                subject: "[Volare Health] Your report are ready!",
                attachments: reportsArray,
                html: `
            <html>
                <head>
                <style>
                a {
                    color: unset;
                    text-decoration: unset;
                }
                .body {
                    padding: 100px;
                    background-color: #e6effc;
                }
                .content {
                    font-family: Helvetica;
                    background-color: #fff;
                    padding: 15px;
                    box-shadow: 5px 5px 20px 0px rgba(0,0,0,0.3) !important;
                    border-radius: 5px;
                    width: fit-content;
                    margin: 0 auto;
                }
                ul {
                    list-style: none;
                }
                button {
                    width: 100%;
                    background: linear-gradient(to bottom right, #1967d2, #222293);
                    border: 0;
                    border-radius: 12px;
                    color: #FFFFFF;
                    cursor: pointer;
                    display: inline-block;
                    font-family: -apple-system,system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
                    font-size: 16px;
                    font-weight: 500;
                    line-height: 2.5;
                    outline: transparent;
                    padding: 0 1rem;
                    text-align: center;
                    text-decoration: none;
                    transition: box-shadow .2s ease-in-out;
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: manipulation;
                    white-space: nowrap;
                }
                button:not([disabled]):focus {
                    box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.5), -.1rem -.1rem .1rem rgba(25, 103, 210, 0.3), .1rem .1rem .1rem rgba(34, 34, 147, 0.3);
                }
                button:not([disabled]):hover {
                    box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.5), -.1rem -.1rem .1rem rgba(25, 103, 210, 0.3), .1rem .1rem .1rem rgba(34, 34, 147, 0.3);
                }
            </style>
                </head>
                    <body>
                        <div class="body">
                            <div class="content" style="box-shadow: 5px 5px 20px 0px rgba(0,0,0,0.3);">
                                <h1>Please check your Reports attached to mail.</h1>
                                <h4>${message}</h4>
                            </div>
                        </div>
                    </body>
            </html>`,
            };
            await mail.send(msg);
            return res.status(200).json({ status: 200 });
        } catch (error) {
            console.log(error);
            return res
                .status(500)
                .json({ status: 500, message: "Internal Server Error!" });
        }
    } else {
        return res
            .status(405)
            .json({ status: 405, message: "Method not allowed" });
    }
}
