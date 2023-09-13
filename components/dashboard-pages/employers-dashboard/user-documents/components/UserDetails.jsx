const PostJobSteps = ({applicantData}) => {
  return (
    <div className="post-job-steps">
      <div className="step">
        <span className="icon flaticon-user"></span>
        <h5>{applicantData?.name}</h5>
      </div>

      <div className="step">
        <span className="icon flaticon-briefcase"></span>
        <h5>{applicantData?.job_title}</h5>
      </div>

      <div className="step">
        <span className="icon flaticon-map-locator"></span>
        <h5>{applicantData?.facility_name}</h5>
      </div>
    </div>
  );
};

export default PostJobSteps;
