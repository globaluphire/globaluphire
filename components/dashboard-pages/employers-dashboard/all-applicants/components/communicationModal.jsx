import {  useState } from "react";
import EmailModal from "./emailModal";
import SmsModal from "./smsModal";
import { ToggleButtonGroup, ToggleButton } from "react-bootstrap";

function CommunicationModal({ applicantData }) {
  const [activeTab, setActiveTab] = useState(1); // State to track the active tab (1 for SMS, 2 for Email)

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
            <div className="row align-items-start">
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
              {activeTab === 1 && <SmsModal applicantData={applicantData} />}
              {activeTab === 2 && <EmailModal applicantData={applicantData} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunicationModal;
