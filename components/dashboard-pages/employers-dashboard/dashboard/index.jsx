import MobileMenu from "../../../header/MobileMenu";
import DashboardHeader from "../../../header/DashboardHeader";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardEmployerSidebar from "../../../header/DashboardEmployerSidebar";
import BreadCrumb from "../../BreadCrumb";
import TopCardBlock from "./components/TopCardBlock";
import ProfileChart from "./components/ProfileChart";
import Notification from "./components/Notification";
import Applicants from "./components/Applicants";
import CopyrightFooter from "../../CopyrightFooter";
import MenuToggler from "../../MenuToggler";
import moment from 'moment';
import Link from "next/link";

const Index = () => {
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
          <BreadCrumb title="Dashboard!" />
          {/* breadCrumb */}

          <MenuToggler />
          {/* Collapsible sidebar button */}

          <div className="row">
            <TopCardBlock />
          </div>
          {/* End .row top card block */}

          {/* End .row profile and notificatins */}
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

export default Index;
