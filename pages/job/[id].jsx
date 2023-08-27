import dynamic from "next/dynamic";
import LoginPopup from "../../components/common/form/login/LoginPopup";
import FooterDefault from "../../components/footer/common-footer";
import DefaulHeader from "../../components/header/DefaulHeader";
import MobileMenu from "../../components/header/MobileMenu";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Seo from "../../components/common/Seo";
import RelatedJobs from "../../components/job-single-pages/related-jobs/RelatedJobs";
import SocialTwo from "../../components/job-single-pages/social/SocialTwo";
import JobDetailsDescriptions from "../../components/job-single-pages/shared-components/JobDetailsDescriptions";
import ApplyJobModalContent from "../../components/job-single-pages/shared-components/ApplyJobModalContent";
import JobOverView from "../../components/job-single-pages/job-overview/JobOverView";
// import ApplyInstantView from "../../components/job-single-pages/job-overview/ApplyInstantView";
import JobSkills from "../../components/job-single-pages/shared-components/JobSkills";
import CompnayInfo from "../../components/job-single-pages/shared-components/CompanyInfo";
import MapJobFinder from "../../components/job-listing-pages/components/MapJobFinder";
import { collection, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../components/common/form/firebase";
import Social from "../../components/footer/common-footer/Social";
import DefaulHeader2 from "../../components/header/DefaulHeader2";
import { useSelector } from "react-redux";
import DashboardHeader from "../../components/header/DashboardHeader";
// import Footer from "../../components/home-15/Footer"
import { ToastContainer, toast } from 'react-toastify';
import { supabase } from "../../config/supabaseClient";
import ApplyInstantView from "../../components/job-single-pages/job-overview/ApplyInstantView";
import Header from "../../components/home-9/Header";

const JobSingleDynamicV1 = () => {
  const [isUserApplied, setIsUserApplied] = useState([]);
  const [isJobShortlisted, setIsJobShortlisted] = useState();
  const user = useSelector(state => state.candidate.user)
  const showLoginButton = useMemo(() => !user?.id, [user])
  const router = useRouter();
  const [company, setCompany] = useState({});
  const id = router.query.id;

  const fetchCompany = async () => {
    try{
      if (id) {
        let { data: jobs, error } = await supabase
            .from('users_jobs_view')
            .select("*")

            // Filters
            .eq('job_id', id)

        if (jobs) {
          setCompany(jobs[0])
        }
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

  const fetchPostForLoggedInUser = async () => {
    // TODO: skip this check for employer login
    if (id && !showLoginButton) {
        let { data: application, error } = await supabase
            .from('applications')
            .select("*")

            // Filters
            .eq('email', user.email)
            .eq('job_id', id)

        if (application?.length > 0) {
            setIsUserApplied(true);
        } else {
            setIsUserApplied(false);
        }
    } else {
        setIsUserApplied(false);
    }
  };

  const fetchJobShortlisted = async () => {
    if (id && user) {
        let { data, error } = await supabase
          .from('shortlisted_jobs')
          .select("*")

          // Filters
          .eq('job_id', id)
          .eq('user_id', user.id)

        if (data?.length > 0) {
          setIsJobShortlisted(true);
        } else {
          setIsJobShortlisted(false);
        }
    } else {
      setIsJobShortlisted(false);
    }
  };

  useEffect(() => {
    setIsUserApplied(false);
    fetchCompany();
    fetchPostForLoggedInUser();
    fetchJobShortlisted();
  }, [id]);

  // short list job action
  const shortListJob = async () => {
    await supabase
      .from('shortlisted_jobs')
      .insert([{ 
        job_id: id,
        user_id: user.id
      }])

    setIsJobShortlisted(true)

    toast.success('Job Shortlisted!', {
      position: "bottom-right",
      autoClose: '4000',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  // unShortList job action
  const unShortListJob = async () => {
    await supabase
      .from('shortlisted_jobs')
      .delete()
      .eq('job_id', id)
      .eq('user_id', user.id)

    setIsJobShortlisted(false)

    toast.success('Job Unshortlisted!', {
      position: "bottom-right",
      autoClose: '4000',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  }

  return (
    <>
      <Seo pageTitle="Job" />

      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}

      {showLoginButton ? <Header /> : <DashboardHeader />}
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      {/* <!-- Job Detail Section --> */}
      <section className="job-detail-section style-three">
        <div className="upper-box">
          <div className="auto-container">
            <div className="job-block-seven style-three">
              <div className="inner-box">
                <div className="content">
                  {/* <span className="company-logo">
                    <img src={company?.logo} alt="logo" />
                  </span> */}
                  <h4>{company?.job_title}</h4>

                  <ul className="job-info">
                    {/* <li>
                      <span className="icon flaticon-briefcase"></span>
                      {company?.company}
                    </li> */}
                    {/* compnay info */}
                    <li>
                      <span className="icon flaticon-map-locator"></span>{" "}
                      {company?.job_comp_add}
                    </li>
                    {/* location info */}
                    <li>
                      <span className="icon flaticon-clock-3"></span>{" "}
                      {company?.job_type}
                    </li>
                    {/* time info */}
                    {company?.salary ? 
                      <li>
                        <span className="icon flaticon-money"></span>{" "}
                        {company?.salary}
                      </li> 
                    : ""}
                    {/* salary info */}
                  </ul>
                  {/* End .job-info */}

                  {/* <ul className="job-other-info">
                    {company?.jobType?.map((val, i) => (
                      <li key={i} className={`${val.styleClass}`}>
                        {val.type}
                      </li>
                    ))}
                  </ul> */}
                  {/* End .job-other-info */}
                </div>
                {/* End .content */}
                <div style={{display: "flex"}}>
                  { !showLoginButton && isUserApplied ?
                      <span className="btn-box theme-btn btn-style-nine">
                          ✓ Applied
                      </span>
                      : ''}

                  { !showLoginButton && !isUserApplied ?
                      <a
                        href="#"
                        className="theme-btn btn-style-one"
                        data-bs-toggle="modal"
                        data-bs-target="#applyJobModal"
                      >
                        Apply For Job
                      </a>
                      : ''}
                  {/* End apply for job btn */}
                  {!showLoginButton ?
                    <span>
                      { isJobShortlisted ? 
                          <button className="bookmark-btn-filled" onClick={() => { unShortListJob() }}>
                            <i className="las la-bookmark"></i>
                          </button>
                        :
                          <button className="bookmark-btn" onClick={() => { shortListJob() }}>
                            <i className="la la-bookmark"></i>
                          </button>
                      }
                    </span>
                  : ''}

                </div>
                {/* <!-- Modal --> */}
                <div
                  className="modal fade"
                  id="applyJobModal"
                  tabIndex="-1"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="apply-modal-content modal-content">
                      <div className="text-center">
                        <h3 className="title">Apply for this job</h3>
                        <button
                          type="button"
                          id="applyJobCloseButton"
                          className="closed-modal"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      {/* End modal-header */}

                      <ApplyJobModalContent company={company} />
                      {/* End PrivateMessageBox */}
                    </div>
                    {/* End .send-private-message-wrapper */}
                  </div>
                </div>
                {/* End .modal */}
              </div>
            </div>
            {/* <!-- Job Block --> */}
          </div>
        </div>
        {/* <!-- Upper Box --> */}

        <div className="job-detail-outer">
          <div className="auto-container">
            
            { showLoginButton ?
                <div className="row">
                  <div className="sidebar-widget col-md-4">
                    {/* <!-- Job Overview --> */}
                    <h4 className="widget-title">APPLY AS A GUEST</h4>
                    <ApplyInstantView company={company} />
                  </div>
                  <div className="content-column col-md-8">
                    <JobDetailsDescriptions  company={company} />
                  </div>
                  </div>
                : 
                <div className="row">
                  <div className="content-column col-lg-8 offset-2 col-md-12 col-sm-12">
                
                <JobDetailsDescriptions  company={company} />
                {/* End jobdetails content */}

                {/* <div className="other-options">
                  <div className="social-share">
                    <h5>Share this job</h5>
                    <SocialTwo />
                  </div>
                </div> */}
                {/* <!-- Other Options --> */}

                {/* <div className="related-jobs">
                  <div className="title-box">
                    <h3>Related Jobs</h3>
                    <div className="text">
                      2020 jobs live - 293 added today.
                    </div>
                  </div> */}
                  {/* End title box */}

                  {/* <RelatedJobs /> */}
                {/* </div> */}
                {/* <!-- Related Jobs --> */}
              </div>
              </div>
                  }              
              {/* End .content-column */}
          </div>
        </div>
        {/* <!-- job-detail-outer--> */}
      </section>
      {/* <!-- End Job Detail Section --> */}

      <FooterDefault footerStyle="alternate5" />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default dynamic(() => Promise.resolve(JobSingleDynamicV1), {
  ssr: false,
});
