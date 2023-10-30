// import { supabase } from "../../../config/supabaseClient";
import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
    try {
        const prisma = new PrismaClient();
        const result = await prisma.$queryRaw`SELECT * FROM USERS`;
        return res.status(200).json({ message: "success", data: result });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
