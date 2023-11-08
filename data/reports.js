export const reportItems = [
    {
        reportName: "Total Posted Jobs",
        reportId: "1",
        columnNames: ["job_id"],
        query: "SELECT * FROM JOBS",
    },
    {
        reportName: "Total no of Applicants",
        reportId: "2",
        columnNames: ["application_id"],
        query: "SELECT COUNT(*) FROM APPLICATIONS",
    },

    {
        reportName: "Average no of Applicants per Jobs",
        reportId: "3",
        columnNames: ["application_id"],
        query: "SELECT AVG(count) FROM  (SELECT COUNT(*)  FROM APPLICATIONS GROUP BY JOB_ID) AS count",
    },
    {
        reportName: "No of Interviews Completed",
        reportId: "4",
        columnNames: ["application_id"],
        query: "SELECT * FROM APPLICATIONS WHERE ONBOARDING_STATUS = 'sent'",
    },
    {
        reportName: "No of Hires",
        reportId: "5",
        columnNames: ["application_id"],
        query: "SELECT * FROM APPLICATIONS WHERE STATUS = 'Hired'",
    },
    {
        reportName: "No of Active Employee",
        reportId: "6",
        columnNames: ["application_id"],
        query: "SELECT * FROM APPLICATIONS WHERE STATUS = 'Hired'",
    },
    {
        reportName: "No of Employee Terminated",
        reportId: "7",
        columnNames: ["application_id"],
        query: "SELECT * FROM APPLICATIONS WHERE STATUS = 'Rejection'",
    },
    {
        reportName: "No of Unpublished Jobs",
        reportId: "8",
        columnNames: ["job_id"],
        query: "SELECT * FROM JOBS WHERE STATUS = 'Unpublished'",
    },
    {
        reportName: "No of Published Jobs",
        reportId: "9",
        columnNames: ["job_id"],
        query: "SELECT * FROM JOBS WHERE STATUS = 'Published'",
    },
];
