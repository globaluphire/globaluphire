export const reportItems = [
    {
        reportName: "Total Posted Jobs",
        reportId: "1",
        columnNames: ["job_id"],
        query: "select * from jobs",
    },
    {
        reportName: "Total no of Applicants",
        reportId: "2",
        columnNames: ["application_id"],
        query: "select count(*) from applications",
    },
    {
        reportName: "Average no of Applicants per Jobs",
        reportId: "3",
        columnNames: ["application_id"],
        query: "select AVG(user_id) from applications group by job_title",
    },
    {
        reportName: "No of Interviews Completed",
        reportId: "4",
        columnNames: ["application_id"],
        query: "select count(*) from applications where onBoarding_status = 'not send'",
    },
    {
        reportName: "No of Hires",
        reportId: "5",
        columnNames: ["application_id"],
        query: "select count(*) from applications where onBoarding_status = 'send'",
    },
    {
        reportName: "No of Active Employee",
        reportId: "6",
        columnNames: ["application_id"],
        query: "select count(*) from applications where hired_date='?'",
    },
    {
        reportName: "No of Employee Terminated",
        reportId: "7",
        columnNames: ["application_id"],
        query: "select count(*) from applications where rejected_date='?'",
    },
    {
        reportName: "No of Unpublished Jobs",
        reportId: "8",
        columnNames: ["job_id"],
        query: "select count(*) from jobs where unpublished_date = '?'",
    },
    {
        reportName: "No of Published Jobs",
        reportId: "9",
        columnNames: ["job_id"],
        query: "select count(*) from jobs where published_date = '?'",
    },
];
