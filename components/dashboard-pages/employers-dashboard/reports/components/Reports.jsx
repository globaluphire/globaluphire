/* eslint-disable no-undef */
/* eslint-disable no-lone-blocks */
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

const addSearchFilters = {
    reportsTitle: "",
    reportsType: "",
};

const Reports = () => {
    const [reportItem, setReportItem] = useState([]);
    const [selectReportItem, setSelectReportItem] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectChanges = (e) => {
        console.log(e.target.selectedIndex);
        setSelectReportItem(e.target.selectedIndex);
    };
    const DownloadHandler = async (item) => {
        setIsLoading(true);
        // console.log(item);
        try {
            const response = await fetch(`/api/report/${item}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const res = await response.json();
            const csv = Papa.unparse(res.data);

            const blob = new Blob([csv], { type: "text/csv" });

            const url = URL.createObjectURL(blob);

            // Create a temporary link element and click it to initiate download
            const link = document.createElement("a");
            link.href = url;
            link.download = `${reportItem[selectReportItem].reportName}.csv`;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);

            URL.revokeObjectURL(url);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
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
                    Download your reports
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
                                    // setSelectReportItem(e.target.value);
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
                        <Form.Group className="chosen-single form-input chosen-container mb-3">
                            <Button
                                onClick={() =>
                                    DownloadHandler(selectReportItem)
                                }
                                data-text="Download CV"
                                variant="primary"
                                disabled={isLoading}
                            >
                                {" "}
                                {isLoading ? (
                                    <Loader />
                                ) : (
                                    <span className="la la-download"></span>
                                )}
                            </Button>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            {/* End filter top bar */}
        </div>
    );
};

export default Reports;
