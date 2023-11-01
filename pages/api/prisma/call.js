// import { supabase } from "../../../config/supabaseClient";
import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
    try {
        const qry = new PrismaClient();
        const result =
            await qry.$queryRaw`SELECT AVG(COUNT(*)) FROM APPLICATIONS GROUP BY JOB_TITLE`;
        console.log(result);
        // return res.status(200).json({ message: "success", data: result });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
