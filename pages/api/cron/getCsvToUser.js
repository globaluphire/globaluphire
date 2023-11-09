export default async function handler(req, res) {
    const getReport = async (item) => {
        try {
            const response = await fetch(`/api/report/${item}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return response;
        } catch (error) {
            throw new Error(error);
        }
    };
    if (req.method === "GET") {
        try {
            const response = await getReport(item);
            if (!response.ok) {
                throw new Error(
                    `Failed to fetch data (HTTP status: ${response.status})`
                );
            }

            const responseData = await response.json();

            const csv = Papa.unparse(responseData.data);

            const blob = new Blob([csv], { type: "text/csv" });

            const url = URL.createObjectURL(blob);

            const filename =
                reportItem[selectReportItem].reportName || "report.csv";

            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);

            URL.revokeObjectURL(url);

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

app.get("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find((u) => u.id === userId);
    if (!user) {
        res.status(404).send("User not found");
    } else {
        res.json({ user });
    }
});
