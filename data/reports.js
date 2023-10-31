export const reportItems = [
    {
        reportName: "Total posted jobs",
        reportId: "1",
        columnNames: ["name"],
        query: "select job_name from hired_job where status = 'recruited'",
    },
    {
        reportName: "most popular roles",
        reportId: "2",
        columnNames: ["role_title"],
        query: "select role_title from recruitment_data where hired = 'yes'",
    },
    {
        reportName: "top engineering positions",
        reportId: "3",
        columnNames: ["position_title"],
        query: "select position_title from engineering_positions where status = 'recruited'",
    },
    {
        reportName: "most sought-after professions",
        reportId: "4",
        columnNames: ["profession_name"],
        query: "select profession_name from job_applications where status = 'hired'",
    },
    {
        reportName: "top 5 recruited candidates",
        reportId: "5",
        columnNames: ["candidate_name"],
        query: "select candidate_name from hired_candidates where employment_status = 'employed'",
    },
];
