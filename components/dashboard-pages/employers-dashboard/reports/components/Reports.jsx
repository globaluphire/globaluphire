/* eslint-disable no-unused-vars */

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../../../../../config/supabaseClient";
import { toast, ToastContainer } from "react-toastify";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Table } from "react-bootstrap";
// import reports from "../../../../../../../../../data/reports";

const addSearchFilters = {
    reportsTitle: "",
    reportsType: "",
};

const Reports = () => {
    const [jobs, setjobs] = useState([]);

    // for search filters
    const [searchFilters, setSearchFilters] = useState(
        JSON.parse(JSON.stringify(addSearchFilters))
    );
    const { reportsTitle, reportsType } = useMemo(
        () => searchFilters,
        [searchFilters]
    );

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
        fetchPost({ reportsTitle: "", reportsType: "" });
    };

    // Search function
    async function findJob({ reportsTitle, reportsType }) {
        let { data, error } = await supabase
            .from("manage_jobs_view")
            .select()
            .eq("status", "Unpublished")
            .ilike("report_name", "%" + reportsTitle + "%")
            .ilike("report_type", "%" + reportsType + "%")
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
    async function fetchPost({ reportsTitle, reportsType }) {
        let { data, error } = await supabase
            .from("manage_jobs_view")
            .select()
            .eq("status", "Unpublished")
            .ilike("job_title", "%" + reportsTitle + "%")
            .ilike("job_type", "%" + reportsType + "%")
            .order("unpublished_date", { ascending: true });

        if (facility) {
            data = data.filter((i) => i.facility_name === facility);
        }
        setjobs(data);
    }

    useEffect(() => {
        fetchPost({ reportsTitle, reportsType });
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
                <b>Reports!</b>
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
                                Report Title
                            </Form.Label>
                            <Form.Control
                                className="chosen-single form-input chosen-container"
                                type="text"
                                value={reportsTitle}
                                onChange={(e) => {
                                    setSearchFilters((previousState) => ({
                                        ...previousState,
                                        reportsTitle: e.target.value,
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
                                Reports Type
                            </Form.Label>
                            <Form.Select
                                className="chosen-single form-select"
                                onChange={(e) => {
                                    setSearchFilters((previousState) => ({
                                        ...previousState,
                                        reportsType: e.target.value,
                                    }));
                                }}
                                // value={reportsType}
                                style={{ maxWidth: "300px" }}
                            >
                                <option value=""></option>
                                <option value="Weekly">Weekly Reports</option>
                                <option value="Monthly">Monthly Reports</option>
                                <option value="Yearly">Yearly Reports</option>
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
                {/* Showing ({jobs.length}) Published Reports(s) */}
            </div>
            <div className="widget-content">
                <div className="table-outer">
                    <Table className="default-table manage-job-table">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                            </tr>
                        </thead>
                        {<tbody></tbody>}
                    </Table>
                </div>
            </div>
            {/* End table widget content */}
        </div>
    );
};

export default Reports;
