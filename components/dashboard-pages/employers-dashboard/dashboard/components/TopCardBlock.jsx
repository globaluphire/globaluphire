import { supabase } from "../../../../../config/supabaseClient";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { BallTriangle } from 'react-loader-spinner';
import Link from "next/link";

const TopCardBlock = () => {

  // global states
  const facility = useSelector(state => state.employer.facility.payload)
  const user = useSelector(state => state.candidate.user);

  const [isLoading, setIsLoading] = useState(false);

  // states for Jobs
  const [totalPostedJobs, setTotalPostedJobs] = useState(0);
  const [totalPublishedJobs, setTotalPublishedJobs] = useState(0);
  const [totalUnpublishedJobs, setTotalUnpublishedJobs] = useState(0);

  // states for Applications
  const [totalApplications, setTotalApplications] = useState(0);
  const [totalNewApplications, setTotalNewApplications] = useState(0);
  const [totalHiredApplications, setTotalHiredApplications] = useState(0);
  const [totalWithdrawedApplications, setTotalWithdrawedApplications] = useState(0);
  const [totalRejectedApplications, setTotalRejectedApplications] = useState(0);

  // states for Messages
  const [totalMessages, setTotalMessages] = useState(0);

  // states for Shortlisted Applications
  const [totalShortlist, setTotalShortlist] = useState(0);

  useEffect(() => {
    fetchDashboardData();
    if (facility) {
      localStorage.setItem("facility", facility);
    } else {
      localStorage.setItem("facility", '');
    }
  }, [facility]);

  const fetchDashboardData = async () => {
    setIsLoading(true);

    if (facility) {
      // fetch data for Jobs
      let countTotalPostedJobs = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('facility_name', facility)
        //.eq('user_id', user.id)
        setTotalPostedJobs(countTotalPostedJobs.count);

      let countTotalPublishedJobs = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('facility_name', facility)
        //.eq('user_id', user.id)
        .eq('status', 'Published');
        setTotalPublishedJobs(countTotalPublishedJobs.count);

      let countTotalUnpublishedJobs = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('facility_name', facility)
        //.eq('user_id', user.id)
        .eq('status', 'Unpublished');
        setTotalUnpublishedJobs(countTotalUnpublishedJobs.count);
      

      /**
       * fetch data for Applications
       */
      let countTotalApplications = await supabase
        .from('applicants_view')
        .select('*', { count: 'exact', head: true })
        .eq('facility_name', facility)
        //.eq('user_id', user.id)
        //.is('deleted', null);
      //console.log("countTotalApplications", countTotalApplications);
        setTotalApplications(countTotalApplications.count);

      /**
       * fetch data for New Applications
       */
      let countTotalNewApplications = await supabase
        .from('applicants_view')
        .select('*', { count: 'exact', head: true })
        .eq('facility_name', facility)
        .eq('status', 'New')
        //.eq('user_id', user.id)
        //.is('deleted', null);
      //console.log("countTotalApplications", countTotalApplications);
        setTotalNewApplications(countTotalNewApplications.count);

      /**
       * fetch data for Applications
       */
      let countTotalHiredApplications = await supabase
        .from('applicants_view')
        .select('*', { count: 'exact', head: true })
        .eq('facility_name', facility)
        .eq('status', 'Hired')
        //.eq('user_id', user.id)
        //.is('deleted', null);
      //console.log("countTotalApplications", countTotalApplications);
        setTotalHiredApplications(countTotalHiredApplications.count);

      /**
       * fetch data for Applications
       */
      let countTotalWithrawedApplications = await supabase
        .from('applicants_view')
        .select('*', { count: 'exact', head: true })
        .eq('facility_name', facility)
        .eq('status', 'Withdraw')
        //.eq('user_id', user.id)
        //.is('deleted', null);
      //console.log("countTotalApplications", countTotalApplications);
        setTotalWithdrawedApplications(countTotalWithrawedApplications.count);

      // fetch data for Applications
      let countTotalRejectedApplications = await supabase
        .from('applicants_view')
        .select('*', { count: 'exact', head: true })
        .eq('facility_name', facility)
        .eq('status', 'Rejection')
        //.eq('user_id', user.id)
        //.is('deleted', null);
      //console.log("countTotalApplications", countTotalApplications);
        setTotalRejectedApplications(countTotalRejectedApplications.count);
    } else {

      // fetch data for Jobs
      let countTotalPostedJobs = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        //.eq('user_id', user.id)
        setTotalPostedJobs(countTotalPostedJobs.count);

      let countTotalPublishedJobs = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        //.eq('user_id', user.id)
        .eq('status', 'Published');
        setTotalPublishedJobs(countTotalPublishedJobs.count);

      let countTotalUnpublishedJobs = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        //.eq('user_id', user.id)
        .eq('status', 'Unpublished');
        setTotalUnpublishedJobs(countTotalUnpublishedJobs.count);
      

      /**
       * fetch data for Applications
       */
      let countTotalApplications = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        //.eq('user_id', user.id)
        //.is('deleted', null);
      //console.log("countTotalApplications", countTotalApplications);
      if (countTotalApplications.count > 0) {
        setTotalApplications(countTotalApplications.count);
      }

      /**
       * fetch data for New Applications
       */
      let countTotalNewApplications = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'New')
        //.eq('user_id', user.id)
        //.is('deleted', null);
      //console.log("countTotalApplications", countTotalApplications);
      if (countTotalNewApplications.count > 0) {
        setTotalNewApplications(countTotalNewApplications.count);
      }

      /**
       * fetch data for Applications
       */
      let countTotalHiredApplications = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Hired')
        //.eq('user_id', user.id)
        //.is('deleted', null);
      //console.log("countTotalApplications", countTotalApplications);
      if (countTotalHiredApplications.count > 0) {
        setTotalHiredApplications(countTotalHiredApplications.count);
      }

      /**
       * fetch data for Applications
       */
      let countTotalWithrawedApplications = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Withdraw')
        //.eq('user_id', user.id)
        //.is('deleted', null);
      //console.log("countTotalApplications", countTotalApplications);
      if (countTotalWithrawedApplications.count > 0) {
        setTotalWithdrawedApplications(countTotalWithrawedApplications.count);
      }

      // fetch data for Applications
      let countTotalRejectedApplications = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Rejection')
        //.eq('user_id', user.id)
        //.is('deleted', null);
      //console.log("countTotalApplications", countTotalApplications);
      if (countTotalRejectedApplications.count > 0) {
        setTotalRejectedApplications(countTotalRejectedApplications.count);
      }
    }

    // fetch data for Messages
    // let total_unread = 0;
    // 
    // const fetchToData = await supabase
    //   .from('messages')
    //   .select('*', { count: 'exact', head: true })
    //   .is('seen_time', null)
    //   .eq('to_user_id', user.id);

    // if (fetchToData.count > 0) {
    //   total_unread += fetchToData.count;
    // }
    // if (total_unread > 0) {
    //   setTotalMessages(total_unread);
    // }


    // fetch data for Shortlist Applications
    // let countTotalShortlist = await supabase
    //   .from('applications')
    //   .select('*', { count: 'exact', head: true })
    //   //.eq('user_id', user.id)
    //   .is('deleted', null);
    // if (countTotalShortlist.count > 0) {
    //   setTotalShortlist(countTotalShortlist.count);
    // }
    
    setIsLoading(false);
  }

  const postJobcardContent = [
    {
      id: 1,
      icon: "flaticon-briefcase",
      countNumber: totalPostedJobs,
      metaName: "Total Posted",
      uiClass: "ui-blue",
    },
    {
      id: 2,
      icon: "flaticon-briefcase",
      countNumber: totalPublishedJobs,
      metaName: "Published",
      link: "/employers-dashboard/manage-jobs",
      uiClass: "ui-green",
    },
    {
      id: 3,
      icon: "flaticon-briefcase",
      countNumber: totalUnpublishedJobs,
      metaName: "Unublished",
      link: "/employers-dashboard/unpublished-jobs",
      uiClass: "ui-red",
    }
  ];

  const applicationCardContent = [
    {
      id: 1,
      icon: "la-file-invoice",
      countNumber: totalApplications,
      metaName: "Total Applications Received",
      uiClass: "ui-blue",
    },
    {
      id: 2,
      icon: "la-file-invoice",
      countNumber: totalNewApplications,
      metaName: "New Applications",
      link: "/employers-dashboard/all-applicants",
      uiClass: "ui-yellow",
    },
    {
      id: 3,
      icon: "la-file-invoice",
      countNumber: totalHiredApplications,
      metaName: "Hired",
      link: "/employers-dashboard/hired-applications",
      uiClass: "ui-green",
    },
    {
      id: 4,
      icon: "la-file-invoice",
      countNumber: totalWithdrawedApplications,
      metaName: "Withdrawn",
      link: "/employers-dashboard/withdrawal-applications",
      uiClass: "ui-red",
    },
    {
      id: 5,
      icon: "la-file-invoice",
      countNumber: totalRejectedApplications,
      metaName: "Rejected",
      link: "/employers-dashboard/rejected-applications",
      uiClass: "ui-red",
    }
  ];

  return (
    <>
      {
        isLoading &&
        <div style={{ width: '20%', margin: "auto" }}>
          <BallTriangle
            height={100}
            width={100}
            radius={5}
            color="#000"
            ariaLabel="ball-triangle-loading"
            wrapperClass={{}}
            wrapperStyle=""
            visible={true}
          />
        </div>
      }

      {isLoading == false ?
        <div>
          <h4 className="optional mx-1 mb-2" style={{ letterSpacing: '2px', fontSize: '1.25rem' }}>Total Posted Jobs!</h4>
        </div> : ''}

      {isLoading == false && postJobcardContent.map((item) => (
        
          <div
            className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12"
            key={item.id}
          >
            <Link href={item.link? item.link : '#'}>
              <div className={`ui-item ${item.uiClass}`} style={{ boxShadow: "0 0 11px rgba(33,33,33,.2)" }}>
                <div className="left">
                  <i className={`icon la ${item.icon}`}></i>
                </div>
                <div className="right">
                
                  <h4>{item.countNumber}</h4>
                  <p>{item.metaName}</p>
                </div>
              </div>
            </Link>
          </div>
      ))}

      {isLoading == false ?
        <div>
          <h4 className="optional mx-1 mb-2" style={{ letterSpacing: '2px', fontSize: '1.25rem' }}>Total Applications!</h4>
        </div> : ''}

      {isLoading == false && applicationCardContent.map((item) => (
          <div
            className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12"
            key={item.id}
          >
            <Link href={item.link? item.link : '#'} 
                onClick={() => {
                  if(item.metaName == "New Applications") {
                    localStorage.setItem("status", "New");
                  }
                }}
            >
              <div className={`ui-item ${item.uiClass}`} style={{ boxShadow: "0 0 11px rgba(33,33,33,.2)" }}>
                <div className="left">
                  <i className={`icon la ${item.icon}`}></i>
                </div>
                <div className="right">
                  <h4>{item.countNumber}</h4>
                  <p>{item.metaName}</p>
                </div>
              </div>
            </Link>
          </div>
      ))}
    </>
  );
};

export default TopCardBlock;
