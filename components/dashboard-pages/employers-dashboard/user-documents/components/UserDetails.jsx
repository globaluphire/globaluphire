const PostJobSteps = ({applicantData}) => {
  if(!applicantData) return null;

  return (
    <div className="post-job-steps">
      <div className="step">
        <span className="icon flaticon-user"></span>
        <div>

        <h5>{applicantData?.name}</h5>
        <small>
          <a  
            href={JSON.parse(applicantData?.doc_dwnld_url)?.publicUrl}
            style={{
              display: "flex",
              gap: "0.5rem",
            }}
          >
            {applicantData?.doc_name}
          </a>
        </small>
        </div>

      </div>

      <div className="step">
        <span className="icon flaticon-briefcase"></span>
        <h5>{applicantData?.job_title}</h5>
      </div>

      <div className="step">
        <span className="icon flaticon-map-locator"></span>
        <div>
          <h5>{applicantData?.facility_name}</h5>
          <small>{applicantData?.job_comp_add}</small>
        </div>
      </div>
      
      <div className="step">
        <span className="icon flaticon-tick"></span>
        <div>
          <h5>Status</h5>
          <small>{applicantData?.status}</small>
          {applicantData?.status.toLowerCase() === "hired" && <small> @ {new Date(applicantData?.hired_date).toLocaleDateString()}</small>}
          {applicantData?.status.toLowerCase() === "reject" && <small> @ {new Date(applicantData?.rejected_date).toLocaleDateString()}</small>}
        </div>
      </div>
    </div>
  );
};

export default PostJobSteps;
