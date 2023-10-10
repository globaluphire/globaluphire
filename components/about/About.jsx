import Link from "next/link";
import DetailsModal from "./Modal/DetailsModal";

const About = () => {
  return (
    <>
      <div className="content-column col-lg-12 col-md-12 col-sm-12 order-1">
        <div className="inner-column " data-aos="fade-left">
          <div className="sec-title">
            <h3>
              OUR NURSE ASSISTANT TRAINING COURSES ARE NOW OPEN FOR ENROLLMENT
              IN (City) CLASSES RUN EVERY 6 WEEKS
            </h3>
            <div className="mt-3" style={{ textAlign: "justify" }}>
              Are you Passionate, Caring and interested in working in the
              nursing field? Are you driven to provide excellent care? We are
              looking for eager individuals that want to provide superb care to
              our Long-Term Care Residents! <br />
              <br />
              Volare Health Care Management is now offering a state approved
              Nursing Assistant Training Program. Successful completion of this
              course will enable you to take the state exam to become a
              Certified Nursing Assistant. We offer day classes and at some
              locations evening classes.
            </div>
          </div>
          {/* <ul className="list-style-one">
            <li>Bring to the table win-win survival</li>
            <li>Capitalize on low hanging fruit to identify</li>
            <li>But I must explain to you how all this</li>
          </ul> */}
        </div>
        <span
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Link
            href="#"
            className="theme-btn btn-style-one bg-blue"
            data-bs-toggle="modal"
            data-bs-target="#details-modal"
          >
            <span className="btn-title">Click to Learn More</span>
          </Link>
        </span>
      </div>
      <DetailsModal />
      {/* End .col about left content */}

      {/* <div className="image-column col-lg-6 col-md-12 col-sm-12">
        <figure className="image" data-aos="fade-right">
          <img src="images/resource/image-2.jpg" alt="about" />
        </figure>

        <!-- Count Employers -->
        <div className="count-employers " data-aos="flip-right">
          <div className="check-box">
            <span className="flaticon-tick"></span>
          </div>
          <span className="title">300k+ Employers</span>
          <figure className="image">
            <img src="images/resource/multi-logo.png" alt="resource" />
          </figure>
        </div>
      </div> */}
      {/* <!-- Image Column --> */}
    </>
  );
};

export default About;
