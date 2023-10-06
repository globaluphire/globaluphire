import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from "react-bootstrap";
import dynamic from "next/dynamic";
import { supabase } from "../../../../../config/supabaseClient";
import "suneditor/dist/css/suneditor.min.css";
import { MessageBox } from "react-chat-elements";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

function EmailModal({ applicantData, setAllMessages, receiversEmail, setReceiversEmail }) {
  const user = useSelector((state) => state.candidate.user);
  const [receiversName, setReceiversName] = useState("");
  const [receiversEmailDisabled, setReceiversEmailDisabled] = useState(false);
  const [mailSubject, setMailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async (recipient, subject, content, applicantData) => {
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
        const messageObj = {
          application_id: applicantData?.application_id,
          sender_name: user.name,
          sender_user_id: user.id,
          sender_email: user.email,
          receiver_name: receiversName,
          receiver_email: receiversEmail,
          // receiver_phone: receiversPhoneNumber,
          message: emailMessage,
          direction: "outbound",
          type: "email",
        };
        applicantData.last_contacted_at = new Date();
        await supabase.from("applications")
          .update({ last_contacted_at: new Date() })
          .eq('application_id', applicantData?.application_id);
        await supabase.from("sms_messages").insert(messageObj);
        setAllMessages((prev) => [...prev, 
          <div 
              className="small text-end fw-bold text-muted mt-3"
              style={{
                fontSize: "0.7rem"
              }}
            >
              <span className="la la-envelope"></span> {" "}
              {user.name} {" "}
              {new Date().toLocaleString()}
              <MessageBox
                className="fw-normal email"
                position={"right"}
                type={"text"}
                text={<div dangerouslySetInnerHTML={{ __html: `
                to: ${receiversEmail} <br/>
                message:&#x2408;${emailMessage}
              ` }}/>}
              />
            </div>,
        ]);
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
        setIsLoading(false);
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
        setIsLoading(false);
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
      setIsLoading(false);
    }
  };

  const handleSetModalData = async () => {
    if (receiversEmail) {
      setReceiversEmailDisabled(true);
    } else {
      setReceiversEmailDisabled(false);
    }
    setReceiversName(applicantData?.name);
    if (setAllMessages[0]?.email) {
      setReceiversEmail(applicantData?.email);
    } else {
      setReceiversEmail("");
    }
  };

  useEffect(() => {
    handleSetModalData();
  }, [applicantData]);

  return (
    <>
    <div className="col-md-6">
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
                disabled={receiversEmailDisabled}
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
          <SunEditor
            setOptions={{
              buttonList: [
                ["fontSize", "formatBlock"],
                [
                  "bold",
                  "underline",
                  "italic",
                  "strike",
                  "subscript",
                  "superscript",
                ],
                ["align", "horizontalRule", "list", "table"],
                ["fontColor", "hiliteColor"],
                ["outdent", "indent"],
                ["undo", "redo"],
                ["removeFormat"],
                ["outdent", "indent"],
                ["link"],
                ["preview", "print"],
                ["fullScreen", "showBlocks", "codeView"],
              ],
            }}
            height={60}
            setDefaultStyle="color:black;"
            placeholder="Write from here..."
            onChange={(e) => {
              setEmailMessage(e);
            }}
          />
        </div>
        <chatInputButton />
        <Button
          style={{ 
            marginTop: "20px",
            backgroundColor: "var(--primary-hover-bg-color)",
            border: "none",
            color: "#fff"
          }}
          className="theme-btn btn-style-one btn-submit"
          onClick={() => {
            handleSendEmail(receiversEmail, mailSubject, emailMessage, applicantData);
            setIsLoading(true);
          }}
          disabled={!receiversEmail && !emailMessage}
        >
          {isLoading ? (
            <>
              <div>Sending...</div>
              <div style={{ 
                paddingLeft: "20px", 
                alignItems: "center",
                backgroundColor: "var(--primary-hover-bg-color)",
                border: "none",
                color: "#fff"
              }}>
                <Spinner />
              </div>
            </>
          ) : (
            "Send"
          )}
        </Button>
      </form>
    </div>
    </>
  );
}

export default EmailModal;
