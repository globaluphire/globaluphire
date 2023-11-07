import { Formidable } from "formidable";
// import { envConfig } from "../../../config/env";
// const mail = require("@sendgrid/mail");
// const fs = require("fs");

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const data = await new Promise((resolve, reject) => {
                const form = new Formidable();

                form.parse(req, (err, fields, files) => {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    if (err) reject({ err });
                    resolve({ err, fields, files });
                });
            });
            // mail.setApiKey(envConfig.SENDGRID_API_KEY);
            console.log(data.files.attachments);

            // const fileReadStream = fs.createReadStream(
            //     data.files.attachments[0].filepath
            // );

            // let csvContent = "";
            // fileReadStream.on("data", (chunk) => {
            //     csvContent += chunk;
            // });

            // fileReadStream.on("end", async () => {
            // const msg = {
            //     to: data.fields.recipient[0],
            //     from: "support@globaluphire.com",
            //     subject: `[Volare Health] ${data.fields.subject[0]}`,
            //     attachments: [
            //         {
            //             content: csvContent,
            //             filename: `${data.fields.reportName[0]}.csv`,
            //             type: "application/csv",
            //             disposition: "attachment",
            //         },
            //     ],
            //     html: `
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
            //                         ${data.fields.content[0]}
            //                     </div>
            //                 </div>
            //             </body>
            //     </html>`,
            // };
            // await mail.send(msg);
            // });
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
