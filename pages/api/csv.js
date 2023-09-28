import { createObjectCsvWriter } from "csv-writer";
import { supabase } from "../../config/supabaseClient";

export default async function handler(req, res) {
	if (req.method == "POST") {
		const applicantionData = req.body;

		let data = [];

		const application = await supabase
			.from("applications")
			.select("*") // You can specify specific columns if needed
			.eq("application_id", applicantionData.application_id)
			.single();

		const applicantData = application.data;

		const organization = await supabase
			.from("org")
			.select("*") // You can specify specific columns if needed
			.eq("id", applicantionData.org_id)
			.single();

		const organizationData = organization.data;

		const applicantJob = await supabase
			.from("jobs")
			.select("*") // You can specify specific columns if needed
			.eq("job_id", applicantData.job_id)
			.single();

		const applicantJobData = applicantJob.data;

		const facilityDetail = await supabase
			.from("facility_dtl")
			.select("*") // You can specify specific columns if needed
			.eq("facility_dtl_id", applicantionData.facility_id)
			.single();

		const facilityDetailData = facilityDetail.data;

		const effectiveDate = new Date().toISOString().slice(0, 10);
		const payrollNumber = applicantData.emp_id;
		const companyCode = organizationData.org_id;

		const displayName = applicantData.name;
		const lastName = displayName.split(" ")[1] ?? applicantData.name;
		const firstName = displayName.split(" ")[0] ?? applicantData.name;
		const middleInitial = displayName ?? applicantData?.name?.[0];
		const suffix = displayName ?? applicantData.name;

		const employeeType = applicantJobData.job_type;
		const positionCode = "";
		const positionDescription = applicantJobData.job_title;
		const departmentCode = "";
		const homeCostCenter = "";
		const badgeId = "";
		const exemptFromPunchingStatus = "";

		const address = facilityDetailData.street;
		const city = facilityDetailData.city;
		const state = facilityDetailData.st_cd;
		const zip = facilityDetailData.zip_cd;
		const SSN = facilityDetailData.ein_nbr;

		const dateOfBirth = applicantData.dob ?? "";
		const dateOfHire = applicantData.hired_date;
		const terminationDate = applicantData.termination_date ?? "";

        const formattedHomePhone = applicantData.phn_nbr ? `(${applicantData.phn_nbr.slice(0, 3)}) ${applicantData.phn_nbr.slice(3, 6)}-${applicantData.phn_nbr.slice(6)}` : "";
		const homePhone = formattedHomePhone;
		const mobilePhone = formattedHomePhone;
		const pager = formattedHomePhone;
		const fax = formattedHomePhone;
		const alternatePhone = formattedHomePhone;

		const employeeUnion = "";
		const gender = applicantData.gender ?? "";
		const race = applicantData.race ?? "";
		const payType = applicantData.pay_type ?? "";
		const payRate = applicantData.pay_rate ?? "";
		const workHours = applicantData.work_hours ?? "";

		// date format yyyy-mm-dd

		const evaluationDate = applicantData.evaluation_date ?? "";
		const lastIncreaseDate = applicantData.last_increase_date ?? "";
		const dailyBenefitHours = applicantData.daily_benefit_hours ?? "";
		const specialConsideration = applicantData.special_considerations ?? "";
		const specialConsideration2 =
			applicantData.special_considerations2 ?? "";

		data = [
			{
				field: "Effective Date",
				value: effectiveDate,
			},
			{
				field: "Payroll Number",
				value: payrollNumber,
			},
			{
				field: "Company Code",
				value: companyCode,
			},
			{
				field: "Display Name",
				value: displayName,
			},
			{
				field: "Last Name",
				value: lastName,
			},
			{
				field: "First Name",
				value: firstName,
			},
			{
				field: "Middle Initial",
				value: middleInitial,
			},
			{
				field: "Suffix",
				value: suffix,
			},
			{
				field: "Employee Type",
				value: employeeType,
			},
			{
				field: "Position Code",
				value: positionCode,
			},
			{
				field: "Position Description",
				value: positionDescription,
			},
			{
				field: "Department Code",
				value: departmentCode,
			},
			{
				field: "Home Cost Center",
				value: homeCostCenter,
			},
			{
				field: "Badge ID",
				value: badgeId,
			},
			{
				field: "Exempt from Punching Status",
				value: exemptFromPunchingStatus,
			},
			{
				field: "Address",
				value: address,
			},
			{
				field: "City",
				value: city,
			},
			{
				field: "State",
				value: state,
			},
			{
				field: "Zip",
				value: zip,
			},
			{
				field: "SSN",
				value: SSN,
			},
			{
				field: "Date of Birth",
				value: dateOfBirth,
			},
			{
				field: "Date of Hire",
				value: dateOfHire,
			},
			{
				field: "Termination Date",
				value: terminationDate,
			},
			{
				field: "Home Phone",
				value: homePhone,
			},
			{
				field: "Mobile Phone",
				value: mobilePhone,
			},
			{
				field: "Pager",
				value: pager,
			},
			{
				field: "Fax",
				value: fax,
			},
			{
				field: "Alternate Phone",
				value: alternatePhone,
			},
			{
				field: "Employee Union",
				value: employeeUnion,
			},
			{
				field: "Gender",
				value: gender,
			},
			{
				field: "Race",
				value: race,
			},
			{
				field: "Pay Type",
				value: payType,
			},
			{
				field: "Pay Rate",
				value: payRate,
			},
			{
				field: "Work Hours",
				value: workHours,
			},
			{
				field: "Evaluation Date",
				value: evaluationDate,
			},
			{
				field: "Last Increase Date",
				value: lastIncreaseDate,
			},
			{
				field: "Daily Benefit Hours",
				value: dailyBenefitHours,
			},
			{
				field: "Special Consideration",
				value: specialConsideration,
			},
			{
				field: "Special Consideration 2",
				value: specialConsideration2,
			},
		];

		const currentDate = new Date();
		const formattedDate = `${(currentDate.getMonth() + 1)
			.toString()
			.padStart(2, "0")}${currentDate
			.getDate()
			.toString()
			.padStart(2, "0")}${currentDate.getFullYear()}`;
		const path = `HrData_${displayName.replace(
			" ",
			"_"
		)}_${formattedDate}.csv`;

		const csvWriter = createObjectCsvWriter({
			path: path, // Change to your desired file path
			header: [
				{ id: "field", title: "Field" },
				{ id: "value", title: "Value" },
			],
		});

		csvWriter
			.writeRecords(data)
			.then(() => {
				console.log("CSV file has been written successfully");
			})
			.catch((error) => {
				console.error("Error writing CSV file:", error);
			});
		res.status(200).json({ message: "success" });
	} else {
		res.status(405).json({ status: 405, message: "Method not allowed" });
	}
}
