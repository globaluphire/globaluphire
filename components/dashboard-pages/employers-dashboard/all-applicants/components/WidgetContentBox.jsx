import candidatesData from "../../../../../data/candidates";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../../config/supabaseClient";
import { toast } from "react-toastify";
import Applicants from "./Applicants";
import { Typeahead } from "react-bootstrap-typeahead";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import "react-chat-elements/dist/main.css"
import { MessageBox, Input } from "react-chat-elements";
import { useRef } from "react";

const addSearchFilters = {
    name: "",
    jobTitle: "",
    status: ""
  }

const WidgetContentBox = () => {
    const [fetchedAllApplicants, setFetchedAllApplicantsData] = useState({});
   // const [searchField, setSearchField] = useState('');
    const [applicationStatus, setApplicationStatus] = useState('');
    const [applicationStatusReferenceOptions, setApplicationStatusReferenceOptions] = useState(null);
    const [noteText, setNoteText] = useState('');
    const [applicationId, setApplicationId] = useState('');

    // for search filters
    const [searchFilters, setSearchFilters] = useState(JSON.parse(JSON.stringify(addSearchFilters)));
    const { name, jobTitle, status } = useMemo(() => searchFilters, [searchFilters])

    // global states
    const facility = useSelector(state => state.employer.facility.payload)

    // sms modal
    const [userData, setUserData] = useState();
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [allMessages, setAllMessages] = useState([]);
    const inputRef = useRef(null)
    let clearInput = () => {}
    
    async function updateApplicationStatus (applicationStatus, applicationId) {
        // save updated applicant status
        if (applicationStatus == "Hired") {
            await supabase
                .from('applications')
                .update({
                    status: applicationStatus,
                    hired_date: new Date()
                })
                .eq('application_id', applicationId)
        } else {
            await supabase
                .from('applications')
                .update({ status: applicationStatus })
                .eq('application_id', applicationId)
        }
        await supabase
            .rpc('increment', { x: 1, row_id: applicationId })

        // this will prevent the page to keep filtered if have any search filters set
        let { data, error } = await supabase
            .from('applicants_view')
            .select("*")
            .neq('status', 'Rejection')
            .neq('status', 'Hired')
            .neq('status', 'Withdraw')
            .ilike('name', '%'+name+'%')
            .ilike('job_title', '%'+jobTitle+'%')
            .ilike('status', '%'+status+'%')
            .order('created_at',  { ascending: false });

        if (facility) {
            data = data.filter(i => i.facility_name == facility)
        }

        if(data) {
            data.forEach( applicant => applicant.created_at = dateFormat(applicant.created_at))
            setFetchedAllApplicantsData(data)
        }
    }

    const dateFormat = (val) => {
      const date = new Date(val)
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric'}) + ', ' + date.getFullYear()
    }

    // clear all filters
    const clearAll = () => {
        setSearchFilters(JSON.parse(JSON.stringify(addSearchFilters)));
        fetchedAllApplicantsView({name: "", jobTitle: "", status: ""})
    };

    async function findApplicant ({ name, jobTitle, status }) {
        let { data, error } = await supabase
            .from('applicants_view')
            .select("*")
            .neq('status', 'Rejection')
            .neq('status', 'Hired')
            .neq('status', 'Withdraw')
            .ilike('name', '%'+name+'%')
            .ilike('job_title', '%'+jobTitle+'%')
            .ilike('status', '%'+status+'%')
            .order('created_at',  { ascending: false });

        if(data) {
            data.forEach( applicant => applicant.created_at = dateFormat(applicant.created_at))

            if (facility) {
                data = data.filter(i => i.facility_name == facility)
            }

            setFetchedAllApplicantsData(data)
        }
    };

    async function fetchedAllApplicantsView ({ name, jobTitle, status }) {
      try{
        const localSearchFilters = localStorage.getItem("status")

        // call reference to get applicantStatus options
        let { data, error: e } = await supabase
            .from('reference')
            .select("*")
            .eq('ref_nm',  'applicantStatus');

        if (data) {
            setApplicationStatusReferenceOptions(data)
        }

        let { data: allApplicantsView, error } = await supabase
            .from('applicants_view')
            .select("*")
            .neq('status', 'Rejection')
            .neq('status', 'Hired')
            .neq('status', 'Withdraw')
            .ilike('name', '%'+name+'%')
            .ilike('job_title', '%'+jobTitle+'%')
            .ilike('status', '%'+status+'%')
            .order('created_at',  { ascending: false });
    
        if (localSearchFilters) {
            setSearchFilters((previousState) => ({ 
                ...previousState,
                status: localSearchFilters
            }))
            allApplicantsView = allApplicantsView.filter(i => i.status == localSearchFilters)
            localStorage.removeItem("status")
        }

        if (facility) {
            allApplicantsView = allApplicantsView.filter(i => i.facility_name == facility)
        }

        if (allApplicantsView) {
            allApplicantsView.forEach( i => i.created_at = dateFormat(i.created_at))
            setFetchedAllApplicantsData(allApplicantsView)
        }
      } catch(e) {
        toast.error('System is unavailable.  Please try again later or contact tech support!', {
          position: "bottom-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        console.warn(e)
      }
    };
  
    useEffect(() => {
      fetchedAllApplicantsView(searchFilters)
      if (facility) {
        localStorage.setItem("facility", facility);
      } else {
        localStorage.setItem("facility", '');
      }
    }, [facility]);


    const setNoteData = async (applicationId) => {
        // reset NoteText
        setNoteText('');
        setApplicationId('');

        const { data, error } = await supabase
              .from('applicants_view')
              .select('*')
              .eq('application_id', applicationId);

        if (data) {
            setNoteText (data[0].notes);
            setApplicationId(data[0].application_id)
        }
    }

    const ViewCV = async (applicationId) => {
        const { data, error } = await supabase
              .from('applicants_view')
              .select('*')
              .eq('application_id', applicationId);

        if (data) {
            window.open(data[0].doc_dwnld_url.slice(14, -2), '_blank', 'noreferrer');
        }
        if (error) {
            toast.error('Error while retrieving CV.  Please try again later or contact tech support!', {
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
    }

    const DownloadHandler = async (applicant) => {
        const { data, error } = await supabase
            .from('applicants_view')
            .select('*')
            .eq('application_id', applicant.application_id);

        if (data) {
            let fileName = data[0].doc_dwnld_url.slice(14, -2);
            fetch(fileName, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/pdf',
                },
              })
                .then(response => response.blob())
                .then(blob => {
                  const url = window.URL.createObjectURL(new Blob([blob]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = fileName;
                  document.body.appendChild(link);
                  link.click();
                  link.parentNode.removeChild(link);
                });
            //window.open(data[0].doc_dwnld_url.slice(14, -2), '_blank', 'noreferrer');
        }
        if (error) {
            toast.error('Error while retrieving CV.  Please try again later or contact tech support!', {
                position: "bottom-right",
                autoClose: true,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    }

    const addNotes = async () => {
        await supabase
            .from('applications')
            .update({
                'notes': noteText
            })
            .eq('application_id', applicationId)

        await supabase
            .rpc('increment', { x: 1, row_id: applicationId })

        // open toast
        toast.success('Applicant notes has been saved!', {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });

        // fetching for refresh the data
        // fetchedAllApplicantsView();

        // close popup
        document.getElementById('notesCloseButton').click();

        // reset NoteText
        setNoteText('');
        setApplicationId('');
        
    }

    const handleSetUserData = (applicantData) => {
        setUserData(applicantData);
        console.log(applicantData);
      };

    const handleButtonClick = () => {
        // Your button click logic here
        const message = inputRef.current.value
            if (message != "") {

                
                setAllMessages((previous)=>
                [...previous,
                    <MessageBox
                        position={"right"}
                        type={"text"}
                        title={"You"}
                        text={message}
                    />
                ]);
                clearInput()
      
            } else {
                return;
            }
        };
    const chatInputButton = (
        <Button
        className="theme-btn btn-style-one"
        onClick={handleButtonClick}
        >
            Send
        </Button>
    );

    useEffect(() => {
        console.log("Message", message)
        console.log("Messageall", allMessages)
      }, [message, allMessages]);

    return (
        <div className="tabs-box">
            <div className="widget-title" style={{ fontSize: '1.5rem', fontWeight: '500' }}>
                <b>All Applicants!</b>
            </div>
            { applicationStatusReferenceOptions != null ?
                <Form>
                    <Form.Label className="optional" style={{ marginLeft: '32px', letterSpacing: '2px', fontSize: '12px' }}>SEARCH BY</Form.Label>
                    <Row className="mx-1" md={4}>
                        <Col>
                            <Form.Group className="mb-3 mx-3">
                                <Form.Label className="chosen-single form-input chosen-container">Applicant Name</Form.Label>
                                <Form.Control
                                    className="chosen-single form-input chosen-container"
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setSearchFilters((previousState) => ({ 
                                            ...previousState,
                                            name: e.target.value
                                        }))
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            findApplicant(searchFilters)
                                        }
                                    }}
                                    style={{ maxWidth: '300px' }}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3 mx-3">
                                <Form.Label className="chosen-single form-input chosen-container">Job Title</Form.Label>
                                <Form.Control
                                    className="chosen-single form-input chosen-container"
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) => {
                                        setSearchFilters((previousState) => ({ 
                                            ...previousState,
                                            jobTitle: e.target.value
                                        }))
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            findApplicant(searchFilters)
                                        }
                                    }}
                                    style={{ maxWidth: '300px' }}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3 mx-3">
                                <Form.Label className="chosen-single form-input chosen-container">Applicant Status</Form.Label>
                                <Form.Select className="chosen-single form-select"
                                    onChange={(e) => {
                                        setSearchFilters((previousState) => ({ 
                                            ...previousState,
                                            status: e.target.value
                                        }))
                                    }}
                                    value={status}
                                    style={{ maxWidth: '300px' }}
                                >
                                    <option value=''></option>
                                    {applicationStatusReferenceOptions.map((option) => (
                                        <option value={option.ref_dspl}>{option.ref_dspl}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mx-3">
                        <Col>
                            <Form.Group className="chosen-single form-input chosen-container mb-3">
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        findApplicant(searchFilters);
                                    }}
                                    className="btn btn-sm text-nowrap m-1 btn-submit"
                                    >
                                    Filter
                                </Button>
                                <Button variant="primary" onClick={clearAll}
                                    className="btn btn-secondary btn-sm text-nowrap mx-2"
                                    style= {{ minHeight: '40px', padding: '0 20px' }}>
                                    Clear
                                </Button>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form> : ''
            }
            {/* End filter top bar */}

            {/* Start table widget content */}
            <div className="optional" style={{ textAlign: 'right', marginRight: '50px', marginBottom: '10px' }}>Showing ({fetchedAllApplicants.length}) Applicants Applied</div>
            <div className="widget-content">
                <div className="table-outer">
                    <Table className="default-table manage-job-table">
                        <thead>
                            <tr>
                            <th>Name</th>
                            <th>Applied On</th>
                            <th>Job Title</th>
                            <th>Facility</th>
                            <th>Status</th>
                            <th>Notes</th>
                            <th>Actions</th>
                            </tr>
                        </thead>
                        {fetchedAllApplicants.length == 0 ? <tbody style={{ fontSize: '1.5rem', fontWeight: '500' }}><tr><td><b>No results found!</b></td></tr></tbody>: 
                            <tbody>
                                {Array.from(fetchedAllApplicants).map((applicant) => (
                                    <tr key={applicant.application_id}>
                                        <td>
                                        {/* <!-- Job Block --> */}
                                        <div className="job-block">
                                            <div>
                                                {/* <span className="company-logo">
                                                <img src={item.logo} alt="logo" />
                                                </span> */}
                                                <h4>
                                                {/* <Link href={`/employers-dashboard/edit-job/${applicant.user_id}`}>
                                                    {applicant.name}
                                                </Link> */}
                                                {applicant.name}
                                                </h4>
                                            </div>
                                        </div>
                                        </td>
                                        <td>
                                        {/* <Link href="/employers-dashboard/all-applicants/${item.job_id}">3+ Applied</Link> */}
                                            <span>{applicant.created_at}</span>
                                        </td>
                                        <td>
                                            {applicant.job_title}
                                        </td>
                                        <td>
                                            {applicant.facility_name}
                                        </td>
                                        <td>
                                            <select className="chosen-single form-select" 
                                                value={applicant.status}
                                                onChange={(e) => {
                                                    updateApplicationStatus(e.target.value, applicant.application_id)
                                                }}>
                                                {applicationStatusReferenceOptions.map((option) => (
                                                    <option value={option.ref_dspl}>{option.ref_dspl}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <ul className="option-list">
                                                {applicant.notes ?
                                                    <li>
                                                        <button data-text="Add, View, Edit, Delete Notes">
                                                        <a
                                                            href="#"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#addNoteModal"
                                                            onClick = { () => {setNoteData(applicant.application_id) }}
                                                        >
                                                            <span className="la la-comment-dots"></span>
                                                        </a>
                                                        </button>
                                                    </li> : 
                                                    <li>
                                                        <button data-text="Add, View, Edit, Delete Notes">
                                                        <a
                                                            href="#"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#addNoteModal"
                                                            onClick = { () => {setNoteData(applicant.application_id) }}
                                                        >
                                                            <span className="la la-comment-alt"></span>
                                                        </a>
                                                        </button>
                                                    </li>}
                                            </ul>
                                        </td>
                                        <td>
                                            <div className="option-box">
                                                <ul className="option-list">
                                                <li onClick = { () => { ViewCV(applicant.application_id) }}>
                                                    <button data-text="View CV">
                                                        <span className="la la-file-download"></span>
                                                    </button>
                                                </li>
                                                <li onClick={() => DownloadHandler(applicant)}>
                                                    <button data-text="Download CV">
                                                        <span className="la la-download"></span>
                                                    </button>
                                                </li>
                                                <li>
                                                    <button data-text="Send Message">
                                                    <a
                                                        href="#"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#sendSmsModal"
                                                        onClick={() => handleSetUserData(applicant)}
                                                        >
                                                        <span className="la la-send"></span>
                                                    </a>
                                                    </button>
                                                </li>
                                                {/* <li onClick={()=>{ Qualified(applicant.application_id, applicant.status) }} >
                                                    <button data-text="Qualified">
                                                    <span className="la la-check"></span>
                                                    </button>
                                                </li>
                                                <li onClick={()=>{ NotQualified(applicant.application_id, applicant.status) }} >
                                                    <button data-text="Not Qualified">
                                                    <span className="la la-times-circle"></span>
                                                    </button>
                                                </li>
                                                <li onClick={()=>{ ResetStatus(applicant.application_id, applicant.status) }} >
                                                    <button data-text="Reset Status">
                                                    <span className="la la-undo-alt"></span>
                                                    </button>
                                                </li> */}
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        }
                    </Table>

                        {/* Add Notes Modal Popup */}
                        <div
                            className="modal fade"
                            id="addNoteModal"
                            tabIndex="-1"
                            aria-hidden="true"
                        >
                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div className="apply-modal-content modal-content">
                                <div className="text-center">
                                <h3 className="title">Add Notes</h3>
                                <button
                                    type="button"
                                    id="notesCloseButton"
                                    className="closed-modal"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                                </div>
                                {/* End modal-header */}
                                <form>
                                    <textarea 
                                        value={noteText}
                                        id="notes"
                                        cols="45"
                                        rows="10"
                                        onChange={(e) => {
                                            setNoteText(e.target.value)
                                        }}
                                        style={{resize: 'vertical', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px'}}></textarea>
                                    <br/>
                                    <div className="form-group text-center">
                                        <button
                                            className="theme-btn btn-style-one"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addNotes();
                                            }}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                                {/* End PrivateMessageBox */}
                            </div>
                            {/* End .send-private-message-wrapper */}
                            </div>
                        </div>

                        {/* Send SMS Modal Popup */}
                        
                        <div className="modal fade" id="sendSmsModal">
                            <div className="modal-dialog modal-dialog-centered modal-xl">
                                <div className="apply-modal-content modal-content">
                                    <button
                                        type="button"
                                        id="close-button-2"
                                        className="closed-modal"
                                        data-bs-dismiss="modal"
                                    ></button>
                                    {/* End close modal btn */}
                                    <h3 className="modal-title">Send SMS</h3>
                                    <div className="modal-body">
                                        {/* <div class="toggle-button-cover">
                                            <div class="button r" id="button-1">
                                                <input type="checkbox" class="checkbox" />
                                                <div class="knobs"></div>
                                                <div class="layer"></div>
                                            </div>
                                        </div> */}
                                        <div class="row align-items-start">
                                            <div class="col-md-6">
                                                <form>
                                                    <div className="form-group">
                                                        <label htmlFor="name">Name:</label>
                                                        <input
                                                            type="text"
                                                            id="name"
                                                            className="form-control"
                                                            value={userData?.name}
                                                            onChange={(e) => {
                                                                setUserName(e.target.value);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="form-group mt-3">
                                                        <label htmlFor="phoneNumber">Phone Number:</label>
                                                        <input
                                                            type="text"
                                                            id="phoneNumber"
                                                            className="form-control"
                                                            value={phoneNumber}
                                                            onChange={(e) => {
                                                                setPhoneNumber(e.target.value);
                                                            }}
                                                        />
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="col-md-6">
                                                <div 
                                                    className="container" 
                                                    style={{ 
                                                        position:"relative", 
                                                        background:"#EEEEEE", 
                                                        borderRadius: "20px", 
                                                        width:"500px",
                                                        height: "400px",
                                                        padding:"20px", 
                                                        paddingBottom:"0", 
                                                        overflowY:"scroll"}}
                                                >
                                                    {allMessages.map((el)=>el)}
                                                    
                                                    <div style={{position:"sticky", bottom:"0", width:"100%", left:"0", margin:"0"}}>
                                                        <Input
                                                            placeholder="Type here..."
                                                            multiline={true}
                                                            // className="mt-3"
                                                            rightButtons={chatInputButton}
                                                            referance={inputRef}
                                                            clear={(clear)=>(clearInput = clear)}
                                                            autoHeight={true}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End modal-body */}
                                </div>
                                {/* End modal-content */}
                            </div>
                        </div>
                    </div>
                </div>
            {/* End table widget content */}
        </div>
    );
};

export default WidgetContentBox;
