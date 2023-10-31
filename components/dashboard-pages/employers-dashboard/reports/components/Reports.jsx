/* eslint-disable no-undef */
/* eslint-disable no-lone-blocks */
/* eslint-disable no-unused-vars */

import { useEffect, useState, useMemo } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { supabase } from "../../../../../config/supabaseClient";
import { toast } from "react-toastify";

const addSearchFilters = {
    reportsTitle: "",
    reportsType: "",
};

const Reports = () => {
    const [reportItem, setReportItem] = useState([]);
    // console.log(reportItems);

    // // for search filters
    const [searchFilters, setSearchFilters] = useState(
        JSON.parse(JSON.stringify(addSearchFilters))
    );
    const { reportsTitle, reportsType } = useMemo(
        () => searchFilters,
        [searchFilters]
    );

    // // clear all filters
    const clearAll = () => {
        setSearchFilters(JSON.parse(JSON.stringify(addSearchFilters)));
        // fetchPost({ reportsTitle: "", reportsType: "" });
    };

    // Initial Function
    async function fetchPost() {
        try {
            const tmpRepo = reportItems.map(
                (x) =>
                    `
                        <p>${x.report_id}</p>
                        <p>${x.report_name}</p>
                        <p>${x.column_names}</p>
                        <p>${x.query}</p>
                        
                        `
            );
        } catch (error) {
            console.log(error);
        }
    }
    const DownloadHandler = async (applicant) => {
        const fileName = data[0].doc_dwnld_url.slice(14, -2);
        fetch(fileName, {
            method: "GET",
            headers: {
                "Content-Type": "application/pdf",
            },
        })
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            });
        // window.open(data[0].doc_dwnld_url.slice(14, -2), '_blank', 'noreferrer');
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
                                        // findJob(searchFilters);
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
                                        report_id: e.target.value,
                                    }));
                                }}
                                // value={reportsType}
                                style={{ maxWidth: "300px" }}
                            >
                                {/* {reportItems.map((item) => {
                                    return <option>{item.report_name}</option>;
                                })} */}
                                {reportItem.map((item) => {
                                    return <option>{item.reportName}</option>;
                                })}
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
                                    {
                                        reportItems.map(
                                            (item) => `${item.report_name}`
                                        );
                                    }
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

                            {/* <li onClick={() => DownloadHandler(applicant)}>
                                <Button
                                    data-text="Download CV"
                                    variant="primary"
                                >
                                    <span className="la la-download"></span>
                                </Button>
                            </li> */}
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            {/* End filter top bar */}
        </div>
    );
};

export default Reports;

{
    /*
 <div className="widget-content">
                <div className="table-outer">
                    <Table className="default-table manage-job-table">
                        <thead>
                            <tr>
                                <th>Report Id</th>
                                <th>Report Name</th>
                                <th>Column Names</th>
                                 <th>Query</th> 
                            </tr>
                        </thead>
                        {
                            <tbody>
                                {reportItems.map((x) => (
                                    <tr>
                                        <td>{x.report_id}</td>
                                        <td>{x.report_name}</td>
                                        <td>{x.column_names}</td>
                                         <td>{x.query}</td> 
                                    </tr>
                                ))}
                            </tbody>
                        }
                    </Table>
                </div>
            </div>
*/
}
