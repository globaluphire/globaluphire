import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import QuillTextEditor from "./quillTextEditor";

function EmailModal({ applicantData }) {
  const user = useSelector((state) => state.candidate.user);
  const [receiversName, setReceiversName] = useState("");
  const [receiversEmail, setReceiversEmail] = useState("");
  const [phoneNumberDisabled, setPhoneNumberDisabled] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");

  const handleSendEmail = async (content, recipient) => {
    try {
      const response = await fetch("/api/sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          recipient,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error("Failed to send SMS");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetModalData = async (applicantData) => {
    setReceiversName(applicantData?.name);
    if (applicantData?.email) {
      setReceiversEmail(applicantData?.email);
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
                type="text"
                id="email"
                className="form-control"
                maxLength={13}
                minLength={11}
                value={receiversEmail}
                placeholder="user@example.com"
                onChange={(e) => {
                  setReceiversEmail(e.target.value);
                }}
                disabled={phoneNumberDisabled}
              />
            </div>
          </div>
        </div>
        <div id="text-editor" className="mt-3">
          <QuillTextEditor
            emailMessage={emailMessage}
            setEmailMessage={setEmailMessage}
          />
        </div>
        <chatInputButton />
        <Button
          style={{ marginTop: "20px" }}
          className="theme-btn btn-style-one btn-submit"
          // onClick={handleSendEmail}
          disabled={!receiversEmail}
        >
          Send
        </Button>
      </form>
    </>
  );
}

export default EmailModal;
