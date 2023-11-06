/* eslint-disable no-undef */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { reportItems } from "../../../data/reports";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            // const obj = {};
            // for (const [key, value] of Object.entries(reportItems)) {
            //     obj[key] = value;
            // }
            // // console.log(obj);
            // data.push(obj);
            // const headers = [];
            // for (const [key, value] of Object.entries(reportItems)) {
            //     headers.push({ id: key, title: convertCamelCase(key) });
            // }

            const newReportItems = reportItems.map(
                ({ reportId, reportName }) => ({
                    reportId,
                    reportName,
                })
            );

            return res
                .status(200)
                .json({ message: "success", data: newReportItems });
        } catch (error) {
            return res
                .status(500)
                .json({ status: 500, message: "Method not allowed" });
        }
    } else {
        return res
            .status(405)
            .json({ status: 405, message: "Method not allowed" });
    }
}
