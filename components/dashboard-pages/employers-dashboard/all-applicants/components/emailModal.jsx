import { useEffect, useState, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import QuillTextEditor from "./quillTextEditor";
import { toast, ToastContainer } from "react-toastify";

function EmailModal({ applicantData }) {
  // const user = useSelector((state) => state.candidate.user);
  const [receiversName, setReceiversName] = useState("");
  const [receiversEmail, setReceiversEmail] = useState("");
  const [mailSubject, setMailSubject] = useState("");
  // const [emailDisabled, setEmailDisabled] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");

  const handleSendEmail = async (recipient, subject, content) => {
    try {
      const response = await fetch("/api/mailer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient,
          subject,
          content,
        }),
      });
      if (response.ok) {
        toast.success("Mail Sent!", {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error("Failed to send Mail!", {
          position: "bottom-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error("Some Error Occured!", {
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const handleSetModalData = async (applicantData) => {
    setReceiversName(applicantData?.name);
    if (applicantData?.email) {
      setReceiversEmail(applicantData?.email);
      // setEmailDisabled(true)
    } else {
      setReceiversEmail("");
    }
  };

  useEffect(() => {
    handleSetModalData(applicantData);
  }, [applicantData]);

  return (
    <>
      <form>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={receiversName}
                onChange={(e) => {
                  setReceiversName(e.target.value);
                }}
                disabled
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={receiversEmail}
                placeholder="user@example.com"
                onChange={(e) => {
                  setReceiversEmail(e.target.value);
                }}
                // disabled={emailDisabled}
              />
            </div>
          </div>
        </div>
        <div className="form-group mt-3">
          <label htmlFor="text">Subject:</label>
          <input
            type="text"
            id="subject"
            className="form-control"
            value={mailSubject}
            placeholder="Write subject here..."
            onChange={(e) => {
              setMailSubject(e.target.value);
            }}
          />
        </div>
        <div id="text-editor" className="mt-3">
          <label htmlFor="text">Content:</label>
          <QuillTextEditor
            emailMessage={emailMessage}
            setEmailMessage={setEmailMessage}
          />
        </div>
        <chatInputButton />
        <Button
          style={{ marginTop: "20px" }}
          className="theme-btn btn-style-one btn-submit"
          onClick={() => {
            handleSendEmail(receiversEmail, mailSubject, emailMessage);
          }}
          disabled={!receiversEmail && !emailMessage}
        >
          Send
        </Button>
      </form>
    </>
  );
}

export default EmailModal;
