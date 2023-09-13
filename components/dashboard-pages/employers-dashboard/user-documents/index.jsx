import { useState, useEffect } from "react";
import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import BreadCrumb from "../../BreadCrumb";
import CopyrightFooter from "../../CopyrightFooter";
import UserDetails from "./components/UserDetails";
import UserDocuments from "./components/UserDocuments";
import MenuToggler from "../../MenuToggler";
import { supabase } from "../../../../config/supabaseClient";

const index = () => {
  const [applicantData, setApplicantData] = useState()
  
  async function getApplicant(){
    const params = new URLSearchParams(window.location.search);
    const applicationId = params.get("applicationId");
    let { data, error } = await supabase
    .from('applicants_view')
    .select("*")
    .eq('status', 'Hired')
    .eq('application_id', applicationId)
    .single();
    setApplicantData(data)
  }

  useEffect(()=>{
    getApplicant()
  },[])

  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>
      {/* <!-- Header Span for hight --> */}

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DashboardHeader />
      {/* End Header */}

      <MobileMenu />
      {/* End MobileMenu */}

      <DashboardEmployerSidebar />
      {/* <!-- End User Sidebar Menu --> */}

      {/* <!-- Dashboard --> */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="" />
          {/* breadCrumb */}

          <MenuToggler />
          {/* Collapsible sidebar button */}

          <div className="row">
            <div className="col-lg-12">
              {/* <!-- Ls widget --> */}
              <div className="ls-widget">
                <div className="tabs-box">
                  <div className="widget-title">
                    <h4>Applicant Information</h4>
                  </div>

                  <div className="widget-content">
                    <UserDetails applicantData={applicantData} />
                    {/* End job steps form */}
                    <UserDocuments applicantData={applicantData} />
                    {/* End post box form */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
        {/* End dashboard-outer */}
      </section>
      {/* <!-- End Dashboard --> */}

      <CopyrightFooter />
      {/* <!-- End Copyright --> */}
    </div>
    // End page-wrapper
  );
};

export default index;
