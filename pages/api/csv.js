import { createObjectCsvWriter } from "csv-writer";
import { supabase } from "../../config/supabaseClient";

function convertCamelCase(str) {
	return str
		.replace(/([A-Z])/g, " $1")
		.replace(/^./, (s) => s.toUpperCase());
}

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

		const formattedHomePhone = applicantData.phn_nbr
			? `(${applicantData.phn_nbr.slice(
					0,
					3
			  )}) ${applicantData.phn_nbr.slice(
					3,
					6
			  )}-${applicantData.phn_nbr.slice(6)}`
			: "";
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

		const dataObject = {
			effectiveDate,
			payrollNumber,
			companyCode,
			displayName,
			lastName,
			firstName,
			middleInitial,
			suffix,
			employeeType,
			positionCode,
			positionDescription,
			departmentCode,
			homeCostCenter,
			badgeId,
			exemptFromPunchingStatus,
			address,
			city,
			state,
			zip,
			SSN,
			dateOfBirth,
			dateOfHire,
			terminationDate,
			formattedHomePhone,
			homePhone,
			mobilePhone,
			pager,
			fax,
			alternatePhone,
			employeeUnion,
			gender,
			race,
			payType,
			payRate,
			workHours,
			evaluationDate,
			lastIncreaseDate,
			dailyBenefitHours,
			specialConsideration,
			specialConsideration2,
		};

		const obj = {};

		for (const [key, value] of Object.entries(dataObject)) {
			obj[key] = value;
		}
		data.push(obj);

		console.log(data);

		const headers = [];

		for (const [key, value] of Object.entries(dataObject)) {
			headers.push({ id: key, title: convertCamelCase(key) });
		}

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
			header: headers, // Change to your desired headers
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
