/* eslint-disable no-unused-vars */
import Awards from "./Awards";
import Education from "./Education";
import Experiences from "./Experiences";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const index = () => {
    const user = useSelector((state) => state.candidate.user);

    return (
        <>
            <div className="row">
                <div className="form-group col-lg-12 col-md-12">
                    <Education />
                    {/* <!-- Resume / Education --> */}

                    <Experiences />
                    {/* <!-- Resume / Work & Experience --> */}
                </div>
                {/* <!--  education and word-experiences --> */}

                {/* <div className="form-group col-lg-6 col-md-12">
          <AddPortfolio />
        </div> */}
                {/* <!-- End more portfolio upload --> */}

                <div className="form-group col-lg-12 col-md-12">
                    {/* <!-- Resume / Awards --> */}
                    <Awards />
                </div>
                {/* <!-- End Award --> */}

                {/* <div className="form-group col-lg-6 col-md-12">
          <label>Skills </label>
          <SkillsMultiple />
        </div> */}
                {/* <!-- Multi Selectbox --> */}

                {/* <!-- Input --> */}
            </div>
            {/* End .row */}
        </>
    );
};

export default index;
