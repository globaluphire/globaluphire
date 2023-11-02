// import { supabase } from "../../../config/supabaseClient";
import { PrismaClient } from "@prisma/client";
import { reportItems } from "../../../data/reports";

export default async function handler(req, res) {
    try {
        const qry = new PrismaClient();
        const itemId = (parseInt(req.query.id) + 1).toString();
        const report = reportItems.filter((item) => item.reportId === itemId);
        // //console.log(report);
        // const result = await qry.$queryRaw`SELECT COUNT(*) FROM APPLICATIONS`;
        // console.log(report[0].query);
        const result = await qry.$queryRaw`${report[0].query}`;
        return res.status(200).json({ message: "success", data: result });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
