import { useEffect, useState, useRef, use } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MessageBox, Input, MessageList } from "react-chat-elements";
import styles from "../../../../../styles/WidgetContentBox.module.css";
import Button from "react-bootstrap/Button";
import { supabase } from "../../../../../config/supabaseClient";
import { Spinner } from "react-bootstrap";
import ViewModal from "./ViewModal";
import { toast, ToastContainer } from "react-toastify";

function SmsModal({
  applicantData,
  setAllMessages,
  receiversPhoneNumber,
  setReceiversPhoneNumber,
  receiversPhoneNumberDisabled,
  setReceiversPhoneNumberDisabled,
}) {
  const user = useSelector((state) => state.candidate.user);
  const [selectedUserData, setSelectedUserData] = useState();
  const [receiversName, setReceiversName] = useState("");

  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendSms = async (content, recipient) => {
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
        setIsLoading(false);
        toast.error("Failed to send Sms!", {
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
      setIsLoading(false);
      console.error(error);
      return;
    }
  };

  const handleSetModalData = async (applicantData) => {
    setSelectedUserData(applicantData);
    setReceiversName(applicantData?.name);

    if (receiversPhoneNumber) {
      setReceiversPhoneNumberDisabled(true);
    } else {
      setReceiversPhoneNumberDisabled(false);
    }
  };

  const handleButtonClick = async () => {
    setIsLoading(true);
    const message = inputRef.current.value;
    if (message != "") {
      const messageObj = {
        sender_name: user.name,
        sender_user_id: user.id,
        sender_email: user.email,
        receiver_name: receiversName,
        receiver_email: selectedUserData.email,
        receiver_phone: receiversPhoneNumber,
        message: message,
        direction: "outbound",
        type: "sms",
      };
      // api call for twilio uncomment this code for it to work
      const smsResponse = await sendSms(message, receiversPhoneNumber);
      if (smsResponse.status !== "success") {
        toast.error("Failed to send Sms!", {
          position: "bottom-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
      await supabase.from("sms_messages").insert(messageObj);
      setAllMessages((previous) => [
        ...previous,
        <div
          className="small text-end fw-bold text-muted mt-3"
          style={{
            fontSize: "0.7rem",
          }}
        >
          {/* <span className="la la-envelope"></span> {" "} */}
          <span className="la la-comments"></span> {user.name}{" "}
          {new Date().toLocaleString()}
          <MessageBox
            className="fw-normal"
            position={"right"}
            type={"text"}
            text={message}
          />
        </div>,
      ]);

      toast.success("SMS Sent!", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      inputRef.current.value = "";
    }
    setIsLoading(false);
  };
  const chatInputButton = (
    <Button
      className="theme-btn btn-style-one btn-submit"
      onClick={() => {
        handleButtonClick();
      }}
      disabled={receiversPhoneNumber.match("^\\+[0-9]{10,13}$") ? false : true}
      style={{
        backgroundColor: "var(--primary-hover-bg-color)",
        border: "none",
        color: "#fff" 
      }}
    >
      {isLoading ? (
        <div>
          <Spinner />
        </div>
      ) : (
        "Send"
      )}
    </Button>
  );

  useEffect(() => {
    handleSetModalData(applicantData);
  }, [applicantData]);
  return (
    <>
      <div className="col-md-6">
        <form>
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
          <div className="form-group mt-3">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="text"
              id="phoneNumber"
              className="form-control"
              maxLength={13}
              minLength={11}
              value={receiversPhoneNumber}
              placeholder="+1 123 456 7890"
              onChange={(e) => {
                if (e.target.value.trim() === "") {
                  setReceiversPhoneNumber("+1");
                  return;
                }
                const number = e.target.value.replace("+1", "");
                if (isNaN(number)) return;
                if (e.target.value.length <= 13) {
                  setReceiversPhoneNumber(e.target.value.trim());
                }
              }}
              disabled={receiversPhoneNumberDisabled}
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="phoneNumber">Your Message:</label>
            <Input
              placeholder="Type Here..."
              multiline={true}
              className="input rounded px-2 form-control"
              rightButtons={chatInputButton}
              referance={inputRef}
              autoHeight={true}
              height={100}
              maxlength={10}
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default SmsModal;
