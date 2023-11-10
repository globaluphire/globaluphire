/* eslint-disable no-undef */
import { supabase } from "../../../../config/supabaseClient";
import { useState } from "react";
// const mail = require("@sendgrid/mail");
import { reportItems } from "../../../../data/reports";
import Papa from "papaparse";

export default async function handler(req, res) {
    const [reportItem, setReportItem] = useState([]);

    if (req.method === "GET") {
        try {
            const fetchUser = await supabase
                .from("users")
                .select("email")
                .ilike("role", "SUPER_ADMIN");
            console.log(fetchUser);

            let reportsArray = [];

            for (const user of reportItems) {
                // console.log("User data :: " + user.query);
                // const reportDataQuery = ` ${user.query}`;
                reportsArray = [
                    user.reportId,
                    user.reportName,
                    user.columnNames,
                    user.query,
                ];
            }
            // console.log("arr :: " + reportsArray);

            const csv = Papa.unparse(fetchUser.data);
            const base64EncodedContent = Buffer.from(csv).toString("base64");

            const blob = new Blob([csv], { type: "text/csv" });

            const url = URL.createObjectURL(blob);

            const filename =
                reportItem[setReportItem].reportName || "report.csv";

            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);

            URL.revokeObjectURL(url);
            console.log("URL :: " + filename);

            reportsArray.push({
                content: toBase64(base64EncodedContent),
                filename: `${req.body.reportName}.csv`,
                type: "text/csv",
                disposition: "attachment",
            });

            // console.log(reportsArray);
            res.json(reportsArray);
        } catch (error) {
            console.error("Error ::", error.message);
            // res.status(500).json({ error: "Internal Server Error" });
        }

        //     const response = await fetch(
        //         `${req.body.url}/api/report/${req.body.id}`,
        //         {
        //             method: "GET",
        //             headers: {
        //                 "Content-Type": "application/json",
        //             },
        //         }
        //     );
        //     const responseData = await response.json();
        //     const csv = Papa.unparse(responseData.data);
        //     const base64EncodedContent = Buffer.from(csv).toString("base64");
        //     mail.setApiKey(envConfig.SENDGRID_API_KEY);
        //     const msg = {
        //         to: req.body.recipient,
        //         from: "support@globaluphire.com",
        //         subject: `[Volare Health] Your report for ${req.body.reportName} is ready!`,
        //         attachments: [
        //             {
        //                 content: base64EncodedContent,
        //                 filename: `${req.body.reportName}.csv`,
        //                 type: "text/csv",
        //                 disposition: "attachment",
        //             },
        //         ],
        //         html: `
        //     <html>
        //         <head>
        //         <style>
        //         a {
        //             color: unset;
        //             text-decoration: unset;
        //         }
        //         .body {
        //             padding: 100px;
        //             background-color: #e6effc;
        //         }
        //         .content {
        //             font-family: Helvetica;
        //             background-color: #fff;
        //             padding: 15px;
        //             box-shadow: 5px 5px 20px 0px rgba(0,0,0,0.3) !important;
        //             border-radius: 5px;
        //             width: fit-content;
        //             margin: 0 auto;
        //         }
        //         ul {
        //             list-style: none;
        //         }
        //         button {
        //             width: 100%;
        //             background: linear-gradient(to bottom right, #1967d2, #222293);
        //             border: 0;
        //             border-radius: 12px;
        //             color: #FFFFFF;
        //             cursor: pointer;
        //             display: inline-block;
        //             font-family: -apple-system,system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
        //             font-size: 16px;
        //             font-weight: 500;
        //             line-height: 2.5;
        //             outline: transparent;
        //             padding: 0 1rem;
        //             text-align: center;
        //             text-decoration: none;
        //             transition: box-shadow .2s ease-in-out;
        //             user-select: none;
        //             -webkit-user-select: none;
        //             touch-action: manipulation;
        //             white-space: nowrap;
        //         }
        //         button:not([disabled]):focus {
        //             box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.5), -.1rem -.1rem .1rem rgba(25, 103, 210, 0.3), .1rem .1rem .1rem rgba(34, 34, 147, 0.3);
        //         }
        //         button:not([disabled]):hover {
        //             box-shadow: 0 0 .25rem rgba(0, 0, 0, 0.5), -.1rem -.1rem .1rem rgba(25, 103, 210, 0.3), .1rem .1rem .1rem rgba(34, 34, 147, 0.3);
        //         }
        //     </style>
        //         </head>
        //             <body>
        //                 <div class="body">
        //                     <div class="content" style="box-shadow: 5px 5px 20px 0px rgba(0,0,0,0.3);">
        //                         <h1>Please check your Report for "${req.body.reportName}" is attached to mail.</h1>
        //                     </div>
        //                 </div>
        //             </body>
        //     </html>`,
        //     };
        //     await mail.send(msg);
        //     return res.status(200).json({ status: 200 });
        // } catch (error) {
        //     console.log(error);
        //     return res
        //         .status(500)
        //         .json({ status: 500, message: "Internal Server Error!" });
        // }
    } else {
        console.log(res);
        // return res
        //     .status(405)
        //     .json({ status: 405, message: "Method not allowed" });
    }
}
