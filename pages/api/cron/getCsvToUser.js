/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useState } from "react";
import { Papa } from "papaparse";

export default async function handler(req, res) {
    const { reportItem } = req.query;

    try {
        const response = await fetch(`/api/report/${reportItem}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch data (HTTP status: ${response.status})`
            );
        }

        const responseData = await response.json();
        const data = responseData.data;
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${reportItem}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return res.status(200).json({ message: "success" });
    } catch (error) {
        return res
            .status(405)
            .json({ status: 405, message: "Method not allowed" });
    }
}
