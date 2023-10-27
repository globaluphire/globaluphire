export const reportsItems = [
    {
        report_name: "topmost 5 recruited jobs",
        report_id: "1",
        column_names: ["name"],
        query: "select job_name from hired_job where status = 'recruited'",
    },
    {
        report_name: "most popular roles",
        report_id: "2",
        column_names: ["role_title"],
        query: "select role_title from recruitment_data where hired = 'yes'",
    },
    {
        report_name: "top engineering positions",
        report_id: "3",
        column_names: ["position_title"],
        query: "select position_title from engineering_positions where status = 'recruited'",
    },
    {
        report_name: "most sought-after professions",
        report_id: "4",
        column_names: ["profession_name"],
        query: "select profession_name from job_applications where status = 'hired'",
    },
    {
        report_name: "top 5 recruited candidates",
        report_id: "5",
        column_names: ["candidate_name"],
        query: "select candidate_name from hired_candidates where employment_status = 'employed'",
    },
];
