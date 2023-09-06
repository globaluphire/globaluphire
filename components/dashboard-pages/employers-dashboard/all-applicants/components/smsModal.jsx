import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MessageBox, Input, MessageList } from "react-chat-elements";
import styles from "../../../../../styles/WidgetContentBox.module.css";
import Button from 'react-bootstrap/Button';
import { supabase } from "../../../../../config/supabaseClient";

function SmsModal({applicantData}) {
  const user = useSelector((state) => state.candidate.user);
  const [selectedUserData, setSelectedUserData] = useState();
  const [receiversName, setReceiversName] = useState("");
  const [receiversPhoneNumber, setReceiversPhoneNumber] = useState("+");
  const [phoneNumberDisabled, setPhoneNumberDisabled] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const inputRef = useRef(null);
  const [smsModalOpen, setSmsModalOpen] = useState(true);

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
        throw new Error("Failed to send SMS");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const scrollToBottom = (id) => {
    // chatBoxContainer
    const element = document.getElementById(id);
    element.scrollTop = element.scrollHeight;
  };

  const handleSetMessages = async (data) => {
    if (!data) {
      console.log("error retriving messages");
      return;
    }
    setAllMessages(() => [
      data.map((el) => {
        if (el.direction === "inbound") {
          return (
            <MessageBox
              position={"left"}
              type={"text"}
              title={el.name}
              text={el.message}
            />
          );
        } else {
          return (
            <MessageBox
              position={"right"}
              type={"text"}
              title={"You"}
              text={el.message}
            />
          );
        }
      }),
    ]);
    scrollToBottom("chatBoxContainer");
  };

  const handleSetModalData = async (applicantData) => {
    setSelectedUserData(applicantData);
    setReceiversName(applicantData?.name);
    setReceiversPhoneNumber("");

    const { data, error } = await supabase
      .from("sms_messages")
      .select()
      .match({ receiver_name: applicantData?.name });

    if (data[0]?.receiver_phone) {
      setReceiversPhoneNumber(data[0].receiver_phone);
      setPhoneNumberDisabled(true)
    } else {
        setPhoneNumberDisabled(false)
    }
    handleSetMessages(data);
  };

  const handleButtonClick = async () => {
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
      };
      // api call for twilio uncomment this code for it to work
      // await sendSms(message, receiversPhoneNumber)
      await supabase.from("sms_messages").insert(messageObj);
      setAllMessages((previous) => [
        ...previous,
        <MessageBox
          position={"right"}
          type={"text"}
          title={"You"}
          text={message}
        />,
      ]);
      inputRef.current.value = "";
    } else {
      return;
    }
  };
  const chatInputButton = (
    <Button
      className="theme-btn btn-style-one btn-submit"
      onClick={handleButtonClick}
      disabled={receiversPhoneNumber.match("^\\+[0-9]{10,13}$") ? false : true}
    >
      Send
    </Button>
  );

  useEffect(()=>{
    handleSetModalData(applicantData)
    console.log("applicantData:",applicantData)
  },[applicantData])
  return (
    <div className="modal fade" id="sendSmsModal">
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="apply-modal-content modal-content">
          <button
            type="button"
            id="close-button-2"
            className="closed-modal"
            data-bs-dismiss="modal"
          ></button>
          <h3 className="modal-title">Send SMS</h3>
          <div className="modal-body">
            <div className="row align-items-start">
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
                          setReceiversPhoneNumber("+");
                          return;
                        }
                        const number = e.target.value.replace("+", "");
                        if (isNaN(number)) return;
                        if (e.target.value.length <= 13) {
                          setReceiversPhoneNumber(e.target.value.trim());
                        }
                      }}
                      disabled={phoneNumberDisabled}
                    />
                  </div>
                </form>
              </div>
              <div className="col-md-6">
                <div
                  className={styles.smsMessageBox + " container"}
                  style={{
                    position: "relative",
                    background: "#EEEEEE",
                    borderRadius: "20px",
                    width: "500px",
                    minHeight: "400px",
                    height: "400px",
                    padding: "20px",
                    paddingBottom: "0",
                    overflowY: "scroll",
                  }}
                >
                  <div
                    id="chatBoxContainer"
                    style={{
                      minHeight: "300px",
                    }}
                  >
                    {allMessages.map((el) => el)}
                  </div>

                  <div
                    style={{
                      position: "sticky",
                      bottom: "0",
                      width: "100%",
                      left: "0",
                      padding: "10px 0",
                    }}
                  >
                    <Input
                      placeholder="Type here..."
                      multiline={true}
                      className="input rounded px-2"
                      rightButtons={chatInputButton}
                      referance={inputRef}
                      autoHeight={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmsModal;
