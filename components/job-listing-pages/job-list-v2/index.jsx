import FooterDefault from "../../footer/common-footer";
import LoginPopup from "../../common/form/login/LoginPopup";
import DefaulHeader2 from "../../header/DefaulHeader2";
import MobileMenu from "../../header/MobileMenu";
import Breadcrumb from "../../common/Breadcrumb";
import FilterSidebar from "./FilterSidebar";
import FilterJobBox from "./FilterJobBox";
import CallToAction from "../../call-to-action/CallToAction";
import JobSearchForm from "./JobSearchForm";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import DashboardHeader from "../../header/DashboardHeader";
import Header from "../../home-9/Header";

const index = () => {
  const user = useSelector((state) => state.candidate.user);
  const showLoginButton = useMemo(() => !user?.id, [user]);
  return (
    <>
      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}

      {showLoginButton ? <Header /> : <DashboardHeader />}
      {/* End Header with upload cv btn */}

      <MobileMenu />
      {/* End MobileMenu */}

      <section className="page-title style-two">
        <div className="auto-container">
          <JobSearchForm />
          {/* <!-- Job Search Form --> */}
        </div>
      </section>

      <section className="ls-section">
        <div className="auto-container">
          <div className="row mb-5">
            <div
              className="offcanvas offcanvas-start"
              tabIndex="-1"
              id="filter-sidebar"
              aria-labelledby="offcanvasLabel"
            >
              <div className="filters-column hide-left">
                <FilterSidebar />
              </div>
            </div>
            {/* <!-- End Filters Column --> */}

            <div className="content-column col-lg-12">
              <FilterJobBox />
            </div>
            {/* <!-- End Content Column --> */}
          </div>
          {/* End row */}

          <CallToAction />
          {/* End calltoAction */}
        </div>
        {/* End container */}
      </section>
      {/* <!--End Listing Page Section --> */}

      <FooterDefault footerStyle="alternate5" />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default index;
