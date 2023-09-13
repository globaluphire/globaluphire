import {  useEffect, useRef, useState } from "react";
import EmailModal from "./emailModal";
import SmsModal from "./smsModal";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { supabase } from "../../../../../config/supabaseClient";
import { MessageBox } from "react-chat-elements";
import ViewModal from "./ViewModal";

function CommunicationModal({ applicantData }) {
  const [activeTab, setActiveTab] = useState(1); // State to track the active tab (1 for SMS, 2 for Email)
  const [allMessages, setAllMessages] = useState([]);
  const [receiversPhoneNumber, setReceiversPhoneNumber] = useState("+");
  const [receiversEmail, setReceiversEmail] = useState("");
  const [receiversPhoneNumberDisabled, setReceiversPhoneNumberDisabled] = useState(false);

  const handleSetMessages = async (data) => {
    if (!data) {
      console.log("error retriving messages");
      return;
    }
    setAllMessages(() => [
      data.map((el) => {
        if (el.direction === "inbound") {
          return (
            <div 
              className="small text-start text-muted mt-3"
              style={{
                fontSize: "0.7rem"
              }}
            >
            <span className="la la-comments"></span> {" "}
            {el.sender_name} {" "}
            {new Date(el.created_at).toLocaleString()}
            <MessageBox
              className="fw-normal"
              position={"left"}
              type={"text"}
              title={el.name}
              text={<div dangerouslySetInnerHTML={{ __html: el.message }}/>}
              />
            </div>
          );
        } else {
          return (
            <div 
              className="small text-end fw-bold text-muted mt-3"
              style={{
                fontSize: "0.7rem"
              }}
            >
              {/* <span className="la la-envelope"></span> {" "} */}
              {el.type === "email" ? <span className="la la-envelope"></span> : <span className="la la-comments"></span>} {" "}
              {el.sender_name} {" "}
              {new Date(el.created_at).toLocaleString()}
              <MessageBox
                className="fw-normal"
                position={"right"}
                type={"text"}
                text={<div dangerouslySetInnerHTML={{ __html: el.message }}/>}
              />
            </div>
          );
        }
      }),
    ]);
  };

  const handleSetModalData = async (applicantData) => {
    const { data, error } = await supabase
      .from("sms_messages")
      .select()
      .match({ receiver_name: applicantData?.name });
    if (data[0]?.receiver_phone) {
      setReceiversPhoneNumber(data[0].receiver_phone);
      setReceiversEmail(data[0].receiver_email);
      setReceiversPhoneNumberDisabled(true)
    } else {
      setReceiversPhoneNumber("")
      setReceiversEmail("")
      setReceiversPhoneNumberDisabled(false)
    }
    handleSetMessages(data);
  };

  useEffect(() => {
    handleSetModalData(applicantData);
  }, [applicantData]);

  return (
    <div className="modal fade" id="communication-modal">
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="apply-modal-content modal-content">
          <button
            type="button"
            id="close-button-2"
            className="closed-modal"
            data-bs-dismiss="modal"
          ></button>
          <h3 className="modal-title">Send SMS/Email</h3>
          <div className="modal-body">
            <div className="row align-items-start" style={{
              maxHeight: "500px"
            }}>
              <ToggleButtonGroup
                type="radio"
                name="options"
                defaultValue={1}
                style={{ paddingBottom: "20px" }}
              >
                <ToggleButton 
                  id="tbg-radio-1" 
                  value={1} 
                  onClick={()=>setActiveTab(1)} 
                  style={{
                    backgroundColor:"var(--msg-primary)",
                    filter: activeTab === 1 ? "none" : "brightness(0.5)",
                    border: "none"
                  }}
                >
                  SMS
                </ToggleButton>
                <ToggleButton 
                  id="tbg-radio-2" 
                  value={2} 
                  onClick={()=>setActiveTab(2)} 
                  style={{
                    backgroundColor:"var(--msg-primary)",
                    filter: activeTab === 2 ? "none" : "brightness(0.5)",
                    border: "none"
                  }}
                >
                  Email
                </ToggleButton>
              </ToggleButtonGroup>
              {activeTab === 1 && (
                <SmsModal 
                  applicantData={applicantData}
                  setAllMessages={setAllMessages}
                  receiversPhoneNumber={receiversPhoneNumber}
                  setReceiversPhoneNumber={setReceiversPhoneNumber}
                  receiversPhoneNumberDisabled={receiversPhoneNumberDisabled}
                  setReceiversPhoneNumberDisabled={setReceiversPhoneNumberDisabled}
                />
              )}
              {activeTab === 2 && (
                <EmailModal 
                  applicantData={applicantData}
                  setAllMessages={setAllMessages}
                  receiversEmail={receiversEmail}
                  setReceiversEmail={setReceiversEmail}
                />)}
              <ViewModal data={allMessages} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunicationModal;
