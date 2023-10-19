/* eslint-disable no-unused-vars */
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { db } from "../../../../common/form/firebase";
// import jobs from "../../../../../data/job-featured.js";
import { supabase } from "../../../../../config/supabaseClient";
import { toast, ToastContainer } from "react-toastify";
import { Typeahead } from "react-bootstrap-typeahead";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Table } from "react-bootstrap";

const addSearchFilters = {
    jobTitle: "",
    jobType: "",
};

const UnpublishedJobListingsTable = () => {
    const [jobs, setjobs] = useState([]);

    // for search filters
    const [searchFilters, setSearchFilters] = useState(
        JSON.parse(JSON.stringify(addSearchFilters))
    );
    const { jobTitle, jobType } = useMemo(() => searchFilters, [searchFilters]);

    // const [jobStatus, setJobStatus] = useState('');
    const user = useSelector((state) => state.candidate.user);
    const router = useRouter();

    // global states
    const facility = useSelector((state) => state.employer.facility.payload);

    const dateFormat = (val) => {
        if (val) {
            const date = new Date(val);
            return (
                date.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                }) +
                ", " +
                date.getFullYear()
            );
        }
    };

    // Publish job action
    const publishJob = async (jobId, status) => {
        if (status !== "Published") {
            const { data, error } = await supabase
                .from("jobs")
                .update({
                    status: "Published",
                    published_date: new Date(),
                })
                .eq("job_id", jobId);

            // open toast
            toast.success("Job successfully published!", {
                position: "bottom-right",
                autoClose: 8000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            // fetching all posts to refresh the data in Job Listing Table
            fetchPost(searchFilters);
        } else {
            // open toast
            toast.error("Job is already published!", {
                position: "bottom-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    };

    // clear all filters
    const clearAll = () => {
        setSearchFilters(JSON.parse(JSON.stringify(addSearchFilters)));
        fetchPost({ jobTitle: "", jobType: "" });
    };

    // Search function
    async function findJob({ jobTitle, jobType }) {
        let { data, error } = await supabase
            .from("manage_jobs_view")
            .select()
            .eq("status", "Unpublished")
            .ilike("job_title", "%" + jobTitle + "%")
            .ilike("job_type", "%" + jobType + "%")
            .order("unpublished_date", { ascending: false });

        if (facility) {
            data = data.filter((i) => i.facility_name === facility);
        }

        data.forEach((job) => (job.created_at = dateFormat(job.created_at)));
        data.forEach(
            (job) => (job.unpublished_date = dateFormat(job.unpublished_date))
        );
        setjobs(data);
    }

    // Initial Function
    async function fetchPost({ jobTitle, jobType }) {
        let { data, error } = await supabase
            .from("manage_jobs_view")
            .select()
            .eq("status", "Unpublished")
            .ilike("job_title", "%" + jobTitle + "%")
            .ilike("job_type", "%" + jobType + "%")
            .order("unpublished_date", { ascending: true });

        if (facility) {
            data = data.filter((i) => i.facility_name === facility);
        }

        data.forEach((job) => (job.created_at = dateFormat(job.created_at)));
        data.forEach(
            (job) => (job.unpublished_date = dateFormat(job.unpublished_date))
        );
        setjobs(data);
    }

    useEffect(() => {
        fetchPost({ jobTitle, jobType });
        if (facility) {
            localStorage.setItem("facility", facility);
        } else {
            localStorage.setItem("facility", "");
        }
    }, [facility]);

    return (
        <div className="tabs-box">
            <div
                className="widget-title"
                style={{ fontSize: "1.5rem", fontWeight: "500" }}
            >
                <b>All Unpublished Jobs!</b>
            </div>
            <Form>
                <Form.Label
                    className="optional"
                    style={{
                        marginLeft: "32px",
                        letterSpacing: "2px",
                        fontSize: "12px",
                    }}
                >
                    SEARCH BY
                </Form.Label>
                <Row className="mx-1" md={4}>
                    <Col>
                        <Form.Group className="mb-3 mx-3">
                            <Form.Label className="chosen-single form-input chosen-container">
                                Job Title
                            </Form.Label>
                            <Form.Control
                                className="chosen-single form-input chosen-container"
                                type="text"
                                value={jobTitle}
                                onChange={(e) => {
                                    setSearchFilters((previousState) => ({
                                        ...previousState,
                                        jobTitle: e.target.value,
                                    }));
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        findJob(searchFilters);
                                    }
                                }}
                                style={{ maxWidth: "300px" }}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3 mx-3">
                            <Form.Label className="chosen-single form-input chosen-container">
                                Job Type
                            </Form.Label>
                            <Form.Select
                                className="chosen-single form-select"
                                onChange={(e) => {
                                    setSearchFilters((previousState) => ({
                                        ...previousState,
                                        jobType: e.target.value,
                                    }));
                                }}
                                value={jobType}
                                style={{ maxWidth: "300px" }}
                            >
                                <option value=""></option>
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Both">Both</option>
                                <option value="Per Diem">Per Diem</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mx-3">
                    <Col>
                        <Form.Group className="chosen-single form-input chosen-container mb-3">
                            <Button
                                variant="primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    findJob(searchFilters);
                                }}
                                className="btn btn-submit btn-sm text-nowrap m-1"
                            >
                                Filter
                            </Button>
                            <Button
                                variant="primary"
                                onClick={clearAll}
                                className="btn btn-secondary btn-sm text-nowrap mx-2"
                                style={{ minHeight: "40px", padding: "0 20px" }}
                            >
                                Clear
                            </Button>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            {/* End filter top bar */}

            {/* Start table widget content */}
            <div
                className="optional"
                style={{
                    textAlign: "right",
                    marginRight: "50px",
                    marginBottom: "10px",
                }}
            >
                Showing ({jobs.length}) Published Job(s)
            </div>
            <div className="widget-content">
                <div className="table-outer">
                    <Table className="default-table manage-job-table">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Facility</th>
                                <th>Applications</th>
                                <th>Unpublished On</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        {jobs.length === 0 ? (
                            <tbody
                                style={{
                                    fontSize: "1.5rem",
                                    fontWeight: "500",
                                }}
                            >
                                <tr>
                                    <td>
                                        <b>No results found!</b>
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {jobs.map((item) => (
                                    <tr key={item.job_id}>
                                        <td>
                                            {/* <!-- Job Block --> */}
                                            <div className="job-block">
                                                <div>
                                                    <div>
                                                        {/* <span className="company-logo">
                            <img src={item.logo} alt="logo" />
                          </span> */}
                                                        <h4>
                                                            <Link
                                                                href={`/employers-dashboard/edit-job/${item.job_id}`}
                                                            >
                                                                {item.job_title}
                                                            </Link>
                                                        </h4>
                                                        <ul className="job-info">
                                                            {item?.job_type ? (
                                                                <li>
                                                                    <i className="flaticon-clock-3"></i>{" "}
                                                                    {
                                                                        item?.job_type
                                                                    }
                                                                </li>
                                                            ) : (
                                                                ""
                                                            )}
                                                            {item?.job_address ? (
                                                                <li>
                                                                    <span className="flaticon-map-locator"></span>{" "}
                                                                    {
                                                                        item?.job_address
                                                                    }
                                                                </li>
                                                            ) : (
                                                                ""
                                                            )}
                                                            {/* location info */}
                                                            {item?.salary ? (
                                                                <li>
                                                                    <span className="flaticon-money"></span>{" "}
                                                                    $
                                                                    {
                                                                        item?.salary
                                                                    }{" "}
                                                                    {
                                                                        item?.salary_rate
                                                                    }
                                                                </li>
                                                            ) : (
                                                                ""
                                                            )}
                                                            {/* salary info */}
                                                        </ul>
                                                        {/* End .job-info */}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{item.facility_name}</td>
                                        <td>
                                            {/* <Link href="/employers-dashboard/all-applicants/${item.job_id}">3+ Applied</Link> */}
                                            {item.total_applicants > 0 ? (
                                                <a
                                                    className="applied"
                                                    onClick={() => {
                                                        router.push(
                                                            `/employers-dashboard/all-applicants-view/${item.job_id}`
                                                        );
                                                    }}
                                                >
                                                    {item.total_applicants}{" "}
                                                    applied
                                                </a>
                                            ) : (
                                                <span>-</span>
                                            )}
                                        </td>
                                        <td>
                                            {item.unpublished_date ? (
                                                <span>
                                                    {item.unpublished_date}
                                                </span>
                                            ) : (
                                                <span>-</span>
                                            )}
                                        </td>
                                        {item?.status === "Published" ? (
                                            <td className="status">
                                                {item.status}
                                            </td>
                                        ) : (
                                            <td
                                                className="status"
                                                style={{ color: "red" }}
                                            >
                                                {item.status}
                                            </td>
                                        )}
                                        <td>
                                            <div className="option-box">
                                                <ul className="option-list">
                                                    <li
                                                        onClick={() => {
                                                            router.push(
                                                                `/employers-dashboard/clone-job/${item.job_id}`
                                                            );
                                                        }}
                                                    >
                                                        <button data-text="Clone Job">
                                                            <span className="la la-copy"></span>
                                                        </button>
                                                    </li>
                                                    <li
                                                        onClick={() => {
                                                            router.push(
                                                                `/job/${item.job_id}`
                                                            );
                                                        }}
                                                    >
                                                        <button data-text="Preview Job">
                                                            <span className="la la-file-alt"></span>
                                                        </button>
                                                    </li>
                                                    <li
                                                        onClick={() => {
                                                            publishJob(
                                                                item.job_id,
                                                                item.status
                                                            );
                                                        }}
                                                    >
                                                        <button data-text="Publish Job">
                                                            <span className="la la-eye"></span>
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </Table>
                </div>
            </div>
            {/* End table widget content */}
        </div>
    );
};

export default UnpublishedJobListingsTable;
