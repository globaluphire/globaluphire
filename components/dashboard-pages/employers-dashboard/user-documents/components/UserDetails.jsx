const PostJobSteps = () => {
  let applicant = {};
  const params = new URLSearchParams(window.location.href);
  for(var value of params.keys()) {
    applicant[value] = params.get(value);
  }
  console.log("paramObj", applicant)
  return (
    <div className="post-job-steps">
      <div className="step">
        <span className="icon flaticon-user"></span>
        <h5>{applicant?.name}</h5>
      </div>

      <div className="step">
        <span className="icon flaticon-briefcase"></span>
        <h5>{applicant?.job_title}</h5>
      </div>

      <div className="step">
        <span className="icon flaticon-map-locator"></span>
        <h5>{applicant?.facility_name}</h5>
      </div>
    </div>
  );
};

export default PostJobSteps;
