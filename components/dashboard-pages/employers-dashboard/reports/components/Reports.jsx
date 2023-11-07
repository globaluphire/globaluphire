/* eslint-disable no-unused-vars */

import { useEffect, useState, useMemo } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Papa from "papaparse";
import { supabase } from "../../../../../config/supabaseClient";
import { toast } from "react-toastify";
import { Loader } from "react-bootstrap-typeahead";

const Reports = () => {
    const [reportItem, setReportItem] = useState([]);
    const [selectReportItem, setSelectReportItem] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectChanges = (e) => {
        setSelectReportItem(e.target.selectedIndex);
    };

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

    const SendMailHandler = async (item) => {
        try {
            setIsLoading(true);
            const response = await getReport(item);
            const responseData = await response.json();
            const csv = Papa.unparse(responseData.data);

            // Create a FormData object and append the CSV file as a Blob
            const formData = new FormData();
            formData.append("recipient", "aniket17112000@gmail.com");
            formData.append(
                "subject",
                `Your Report for "${reportItem[selectReportItem].reportName}" is ready`
            );
            formData.append(
                "content",
                "<h1>Please check the attached report!</h1>"
            );
            formData.append(
                "reportName",
                reportItem[selectReportItem].reportName
            );
            formData.append(
                "attachments",
                new Blob([csv], { type: "text/csv" })
            );

            const mailResponse = await fetch("/api/report/mail", {
                method: "POST",
                body: formData,
            });

            if (!mailResponse.ok) {
                setIsLoading(false);
                toast.error("Some error occurred, try again after some time!", {
                    position: "bottom-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            } else {
                setIsLoading(false);
                toast.success("Report send to mail!", {
                    position: "bottom-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
        } catch (error) {
            throw new Error("Failed to fetch data!");
        }
    };

    const DownloadHandler = async (item) => {
        try {
            setIsLoading(true);
            const response = await getReport(item);
            if (!response.ok) {
                toast.error("Some error occurred, try again after some time!", {
                    position: "bottom-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
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

            setIsLoading(false);

            toast.success("Report generated!", {
                position: "bottom-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        } catch (error) {
            throw new Error("Failed to fetch data!");
        }
    };

    async function fetchReportItems() {
        const response = await fetch("/api/report/getReportItems", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        // setReportItem(await response.json());
        const reportItems = await response.json();
        setReportItem(reportItems.data);
    }

    useEffect(() => {
        // fetchPost(reportItems);
        fetchReportItems();
    }, []);

    return (
        <div className="tabs-box">
            <div
                className="widget-title"
                style={{ fontSize: "1.5rem", fontWeight: "500" }}
            >
                <b>Rejected Applicants!</b>
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
                    DOWNLOAD YOUR REPORTS
                </Form.Label>
                <Row className="mx-1" md={4}>
                    <Col>
                        <Form.Group className="mb-3 mx-3">
                            <Form.Label className="chosen-single form-input chosen-container">
                                Reports Type
                            </Form.Label>
                            <Form.Select
                                className="chosen-single form-select"
                                onChange={(e) => {
                                    handleSelectChanges(e);
                                }}
                                style={{ maxWidth: "300px" }}
                            >
                                {reportItem.map((item) => {
                                    return (
                                        <option
                                            key={item.reportId}
                                            value={item.reportName}
                                        >
                                            {item.reportName}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mx-3">
                    <Col>
                        <Form.Group className="chosen-single form-input chosen-container mt-3">
                            <Button
                                onClick={() =>
                                    DownloadHandler(selectReportItem)
                                }
                                data-text="Download CV"
                                variant="primary"
                                disabled={isLoading}
                                className="btn btn-submit btn-sm text-nowrap m-1"
                            >
                                {isLoading ? (
                                    <Loader />
                                ) : (
                                    <span className="la la-download"></span>
                                )}
                            </Button>
                            <Button
                                onClick={() =>
                                    SendMailHandler(selectReportItem)
                                }
                                data-text="Send to mail" // Change button text
                                variant="primary"
                                disabled={isLoading}
                                style={{
                                    minHeight: "40px",
                                    padding: "0 20px",
                                }}
                                className="btn btn-submit btn-sm text-nowrap mx-2"
                            >
                                {isLoading ? (
                                    <Loader />
                                ) : (
                                    <>
                                        <span className="la la-send"></span>
                                        <span style={{ marginLeft: "0.5em" }}>
                                            Send to mail
                                        </span>
                                    </>
                                )}
                            </Button>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            {/* End filter top bar */}
            {/* Start table widget content */}
            <div className="widget-content">
                <div className="table-outer"></div>
            </div>
            {/* End table widget content */}
        </div>
    );
};

export default Reports;
