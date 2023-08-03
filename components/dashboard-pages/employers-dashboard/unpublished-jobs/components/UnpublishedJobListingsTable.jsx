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
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const addSearchFilters = {
    jobTitle: "",
    jobType: ""
  }


const UnpublishedJobListingsTable = () => {
  const [jobs, setjobs] = useState([]);
  const [searchField, setSearchField] = useState('');
  const [facilitySingleSelections, setFacilitySingleSelections] = useState([]);

  // for search filters
  const [searchFilters, setSearchFilters] = useState(JSON.parse(JSON.stringify(addSearchFilters)));
  const { name, jobTitle, jobType } = useMemo(() => searchFilters, [searchFilters])

  //const [jobStatus, setJobStatus] = useState('');
  const user = useSelector(state => state.candidate.user)
  const router = useRouter();

  // const fetchPost = async () => {
  //   const userJoblistQuery  = query(collection(db, "jobs"), where("user", "==", user.id))
  //   await getDocs(userJoblistQuery).then((querySnapshot) => {
  //     const newData = querySnapshot.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id,
  //     }));
  //     setjobs(newData);
  //   });
  // };

  const facilityNames = [
    "Keizer",
    "French Prairie",
    "Green Valley",
    "HearthStone",
    "Highland House",
    "Rose Haven",
    "Royal Garden",
    "South Hills",
    "Umpqua Valley",
    "Corvallis",
    "HillSide Heights",
    "Hale Nani",
    "Eugene Home Office",
    "Louisville Home Office",
]
  const dateFormat = (val) => {
    const date = new Date(val)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric'}) + ', ' + date.getFullYear()
  }

  // Publish job action
  const publishJob = async (jobId, status) => {
    if (status !== 'Published') {
      const { data, error } = await supabase
          .from('jobs')
          .update({ status: 'Published' })
          .eq('job_id', jobId)

      // open toast
      toast.success('Job successfully published!', {
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
      fetchPost();
    } else {
      // open toast
      toast.error('Job is already published!', {
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

  // Unpublish job action
  const unpublishJob = async (jobId, status) => {
    if (status !== 'Unpublished') {
      const { data, error } = await supabase
          .from('jobs')
          .update({ status: 'Unpublished' })
          .eq('job_id', jobId)

      // open toast
      toast.success('Job successfully unpublished!', {
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
      fetchPost();
    } else {
      // open toast
      toast.error('Job is already unpublished!', {
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

  // clear all filters
  const clearAll = () => {
    setSearchFilters(JSON.parse(JSON.stringify(addSearchFilters)));
    setFacilitySingleSelections([])
    fetchPost()
  };

  // Search function
  async function findJob () {
    let { data, error } = await supabase
    .from('manage_jobs_view')
    .select()
    .eq('status', 'Published')
    .ilike('job_title', '%'+jobTitle+'%')
    .ilike('job_type', '%'+jobType+'%')
    .order('created_at',  { ascending: false });

    data.forEach( job => job.created_at = dateFormat(job.created_at))
    setjobs(data) 

    if (facilitySingleSelections.length > 0) {
      setjobs(data.filter((job) => job.facility_name?.includes(facilitySingleSelections[0])))
    }
  };

  // Initial Function
  const fetchPost = async () => {
    let { data, error } = await supabase
      .from('manage_jobs_view')
      .select()
      .eq('status', 'Unpublished')
      .order('created_at',  { ascending: false });

      data.forEach( job => job.created_at = dateFormat(job.created_at))
      setjobs(data)
  }
  

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <div className="tabs-box">
      <div className="widget-title mb-3" style={{ fontSize: '1.5rem', fontWeight: '500' }}>
          <b>All Unpublished Jobs!</b>
      </div>
      <Form className='search-filter-form'>
          <Form.Label className="optional" style={{ marginLeft: '32px', letterSpacing: '2px', fontSize: '12px' }}>SEARCH BY</Form.Label>
          <Row className="mx-1" md={4}>
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
                          style={{ maxWidth: '300px' }}/>
                  </Form.Group>
              </Col>
              <Col>
                  <Form.Group className="mb-3 mx-3">
                      <Form.Label className="chosen-single form-input chosen-container">Facility Name</Form.Label>
                      <Typeahead
                          onChange={setFacilitySingleSelections}
                          id="facilityName"
                          className="chosen-single form-input chosen-container"
                          placeholder="select"
                          options={facilityNames}
                          selected={facilitySingleSelections}
                          style={{ maxWidth: '300px' }}
                          required
                      />
                  </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3 mx-3">
                    <Form.Label className="chosen-single form-input chosen-container">Job Type</Form.Label>
                    <Form.Select className="chosen-single form-select"
                        onChange={(e) => {
                            setSearchFilters((previousState) => ({ 
                                ...previousState,
                                jobType: e.target.value
                            }))
                            }}
                        value={jobType}
                        style={{ maxWidth: '300px' }}
                    >
                        <option value=''></option>
                        <option value='Full Time'>Full Time</option>
                        <option value='Part Time'>Part Time</option>
                        <option value='Both'>Both</option>
                        <option value='Per Diem'>Per Diem</option>
                    </Form.Select>
                </Form.Group>
              </Col>
          </Row>
          <Row className="mx-3">
              <Col>
                  <Form.Group className="chosen-single form-input chosen-container mt-3">
                      <Button variant="primary"
                          onClick={(e) => {
                              e.preventDefault();
                              findJob(searchFilters);
                          }}
                          className="btn btn-primary btn-sm text-nowrap m-1"
                          style= {{ minHeight: '40px', padding: '0 30px'}}>
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
      </Form>
      {/* End filter top bar */}

      {/* Start table widget content */}
      <div className="optional" style={{ textAlign: 'right', marginRight: '50px', marginBottom: '10px' }}>Showing ({jobs.length}) Published Job(s)</div>
      <div className="widget-content">
      <div className="table-outer">
        <table className="default-table manage-job-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Facility</th>
              <th>Applications</th>
              <th>Published On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          {jobs.length == 0 ? <tbody style={{ fontSize: '1.5rem', fontWeight: '500' }}><tr><td><b>No results found!</b></td></tr></tbody>: 
            <tbody>
              {jobs.map((item) => (
                <tr key={item.job_id}>
                  <td>
                    {/* <!-- Job Block --> */}
                    <div className="job-block">
                      <div className="inner-box">
                        <div>
                          {/* <span className="company-logo">
                            <img src={item.logo} alt="logo" />
                          </span> */}
                          <h4>
                            <Link href={`/employers-dashboard/edit-job/${item.job_id}`}>
                              {item.job_title}
                            </Link>
                          </h4>
                            <ul className="job-info">
                              { item?.job_type ?
                                  <li>
                                    <i className="flaticon-clock-3"></i>{" "}
                                    {item?.job_type}
                                  </li>
                                  : '' }
                              { item?.job_address ?
                                  <li>
                                    <span className="flaticon-map-locator"></span>{" "}
                                    {item?.job_address}
                                  </li>
                                  : '' }
                              {/* location info */}
                              { item?.salary ?
                                  <li>
                                    <span className="flaticon-money"></span>{" "}
                                  ${item?.salary} {item?.salary_rate}
                                  </li>
                                  : '' }
                              {/* salary info */}
                            </ul>
                            {/* End .job-info */}

                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                      {item.facility_name}
                  </td>
                  <td className="applied">
                    {/* <Link href="/employers-dashboard/all-applicants/${item.job_id}">3+ Applied</Link> */}
                    <a onClick={()=>{
                      router.push(`/employers-dashboard/all-applicants-view/${item.job_id}`)
                    }}>
                      {item.total_applicants > 0 ? `${item.total_applicants} applied` : 'No applications yet'}
                    </a>
                  </td>
                  <td>
                  {item?.created_at}
                  </td>
                  { item?.status == 'Published' ?
                    <td className="status">{item.status}</td>
                    : <td className="status" style={{ color: 'red' }}>{item.status}</td> }
                  <td>
                    <div className="option-box">
                      <ul className="option-list">
                        <li onClick={()=>{
                          router.push(`/employers-dashboard/clone-job/${item.job_id}`)
                        }}>
                          <button data-text="Clone Job">
                            <span className="la la-copy"></span>
                          </button>
                        </li>
                        <li onClick={()=>{
                          router.push(`/job/${item.job_id}`)
                        }}>
                          <button data-text="Preview Job">
                            <span className="la la-file-alt"></span>
                          </button>
                        </li>
                        <li onClick={()=>{ publishJob(item.job_id, item.status) }} >
                          <button data-text="Publish Job">
                            <span className="la la-eye"></span>
                          </button>
                        </li>
                        <li onClick={()=>{ unpublishJob(item.job_id, item.status) }}>
                          <button data-text="Unpublish Job" disabled>
                            <span className="la la-trash"></span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          }
        </table>
      </div>
      </div>
      {/* End table widget content */}
    </div>
  );
};

export default UnpublishedJobListingsTable;
