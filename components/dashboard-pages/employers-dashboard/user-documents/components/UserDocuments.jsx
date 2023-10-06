import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Button, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { supabase } from "../../../../../config/supabaseClient";

const UserDocuments = ({ applicantData }) => {
  const user = useSelector((state) => state.candidate.user);
  const [allTemplates, setAllTemplates] = useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imgData, setImgData] = useState(null);
  const applicantForm = useRef(null);
  const [sendDocumentsForSigningLoading, setSendDocumentsForSigningLoading] = useState(true);
  const [refreshDisabled, setRefreshDisabled ] = useState(false);
  const [selectAllDisabled, setSelectAllDisabled ] = useState(false);

  // Function to send documents for signing
  const sendDocumentsForSigning = async (user) => {
    setSendDocumentsForSigningLoading(true);
    try {
      if (!applicantForm.current) {
        return;
      }
      const applicantEmail = applicantForm.current.querySelector("#applicantEmail").value;
      const applicantName = applicantForm.current.querySelector("#applicantName").value;
    if(!applicantEmail || !applicantName){
      toast.error('Please Fill the form!', {
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setSendDocumentsForSigningLoading(false)
      return;
    }

    if(!selectedTemplates.length){
      toast.error('Please Select at least one doucment!', {
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setSendDocumentsForSigningLoading(false)
      return;
    }
      const applicant = {
        email: applicantEmail,
        name: applicantName,
      };
      const token = await getAccessToken(user.email);
      const response = await fetch(`/api/ds/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token?.data?.access_token,
          user,
          applicant: applicantData,
          // send selectedTemplates here
          template: selectedTemplates,
          recipient: applicant,
        }),
      });
      if (response.ok) {
        toast.success('Documents sent for Signing!', {
          position: "bottom-right",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        setIsLoading(false);
        toast.error('Some error occured! Please try again later.', {
          position: "bottom-right",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
      fetchTemplates(applicantData)
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
    setSendDocumentsForSigningLoading(false);
  };

  // Function to fetch templates and update the state
  const fetchTemplates = async (applicantData) => {
    setIsLoading(true);
    setRefreshDisabled(true);
    try {
      const token = await getAccessToken(user.email);
      const response = await fetch(
        `/api/ds/templates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token?.data?.access_token,
            user,
            applicant: applicantData,
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRefreshDisabled(false)
        setIsLoading(false);
        setAllTemplates(data?.data);
        const hasNotSent = data?.data?.every((item) => item?.envelope?.status === "not sent");
        let newStatus = ""
        if(hasNotSent){
          newStatus = "Not Sent"
        }
        const hasSent = data?.data?.some((item) => item?.envelope?.status === "sent");
        const hasDelivered = data?.data?.some((item) => item?.envelope?.status === "delivered");
        const hasCompleted = data?.data?.some((item) => item?.envelope?.status === "completed");
        if (hasDelivered || hasSent || hasCompleted) {
          const allItemsCompleted = data?.data.every((item) => item?.envelope?.status === "completed");
          newStatus = allItemsCompleted ? "Signed" : hasDelivered ? "Read" : "Sent";
          // update onboarding_status in table applications
        }
        await supabase
          .from("applications")
          .update({ onboarding_status: newStatus })
          .eq("application_id", applicantData.application_id);
      } else {
        setRefreshDisabled(false)
        setIsLoading(false);
        console.error("Failed to fetch templates");
      }
    } catch (error) {
      setRefreshDisabled(false)
      setIsLoading(false);
      console.error(error);
    }
  };

  // Function to get Docusign access token
  const getAccessToken = async (email) => {
    try {
      const response = await fetch(`/api/ds/accessToken?email=${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Failed to get access token");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to fetch one preview
  const fetchOnePreview = async (template) => {
    setImgData(false);
    try {
      const token = await getAccessToken(user.email);
      const response = await fetch(`/api/ds/preview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template,
          token: token.data.access_token,
        }),
      }).then((res) => res.json());
      const imageArray = response.pages.map((page, index) => ({
        templateId: template.templateId,
        data: `data:image/${page.mimeType};base64,${page.imageBytes}`,
        pageId: index,
      }));
      
      setImgData(imageArray);
    } catch (error) {
      console.error(error);
      setImgData(null);
    }
  };

  // Function to fetch signed document preview
  const fetchSignedPreview = async (envelope, template) => {
    setImgData(false);
    try {
      const token = await getAccessToken(user.email);
      const response = await fetch(`/api/ds/previewCompleted`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token.data.access_token,
          envelope,
          pageCount: template.pageCount,
        }),
      }).then((res) => res.json());
      const imageArray = response.pages.map((page, index) => ({
        templateId: template.templateId,
        data: `data:image/${page.mimeType};base64,${page.imageBytes}`,
        pageId: index,
      }));

      setImgData(imageArray);
    } catch (error) {
      console.error(error);
      setImgData(null);
    }
  };

  useEffect(() => {
    setSelectedTemplates([])
    console.log(selectedTemplates)
    if (applicantData) {
      fetchTemplates(applicantData);
    }
  }, [applicantData]);

  const handleCheckChange = (template, checked) => {
    if (checked) {
      if (!selectedTemplates?.some(t => t.templateId === template.templateId)) {
        setSelectedTemplates([...selectedTemplates, template]);
      }
    } else {
      setSelectedTemplates(
        selectedTemplates.filter((t) => t.templateId !== template.templateId)
      );
    }
  }

  const determineBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'sent':
            return {color: 'orange', tag: 'Sent'}
        case 'delivered':
            return {color: '#87CEEB', tag: 'Read'}
        case 'completed':
            return {color: 'green', tag: 'Signed'}
        default:
            return {color: 'red', tag: 'Not Sent'}
    }
  }

  const handleAllTemplatesSelect = () => {
    if (allTemplates.every(template => {
      const status = template?.envelope?.status;
      return status === "sent" || status === "delivered" || status === "completed";
    })) {
      setSelectAllDisabled(true);
      setSelectedTemplates([]);
    } else {
      const notSentTemplates = allTemplates.filter(template => !template?.envelope?.status);
      setSelectedTemplates(notSentTemplates);
      setSelectAllDisabled(false);
    }
  };

  return (
    <form className="default-form">
      <div className="row">
        <div className="col-6">
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <h5 className="mb-3" style={{display:"flex"}}>Documents          
              <span style={{marginLeft:"15px"}}>
                <span 
                  className="flaticon-reload" 
                  style={{
                    fontWeight: "bold",
                    color: refreshDisabled ? "grey" : "var(--primary-hover-bg-color)",
                    cursor: refreshDisabled ? "not-allowed" :"pointer",
                  }} 
                  onClick={()=>fetchTemplates(applicantData)}
                  disabled={refreshDisabled}
                >
                </span>
              </span>
            </h5>
            <span style={{ cursor: "pointer" }}>
              <label htmlFor="selectAll">
                Select All
              </label>
              {" "}
              <input 
                type="checkbox" 
                id="selectAll" 
                className="form-check-input" 
                onChange={(e) => { handleAllTemplatesSelect(e.target.checked) }} 
                style={{
                  marginTop: "0.3rem",
                  cursor: "pointer",
                }}
                disabled={selectAllDisabled}
              />
            </span>
          </div>
          {isLoading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Spinner />
            </div>
          ) : allTemplates ? (
            <ListGroup
              as="ol"
              variant="numbered"
              style={{
                height: "300px",
                overflow: "auto",
              }}
            >
              {allTemplates?.map((template) => (
                <ListGroup.Item
                  key={template.id}
                  onClick={() =>
                    template?.envelope?.status === "completed"
                      ? !(
                          imgData === false ||
                          imgData?.templateId === template.templateId
                        ) &&
                        fetchSignedPreview(
                          template?.envelope,
                          template
                        )
                      : !(
                          imgData === false ||
                          imgData?.templateId === template.templateId
                        ) && fetchOnePreview(template)
                  }
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      imgData?.templateId === template.templateId
                        ? "#e8f0fa"
                        : "white",
                    color: "black",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                  }}
                >
                  <span
                    disabled={
                      imgData === false ||
                      imgData?.templateId === template.templateId
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "1rem"
                      }}
                    >
                    {template.name}
                    <span 
                      className={`badge`}
                      style={{
                        backgroundColor: determineBadgeColor(template?.envelope?.status).color,
                      }}
                      >
                      {determineBadgeColor(template?.envelope?.status).tag}
                    </span>
                    </div>
                    {!(template?.envelope?.status) && 
                      <input
                        type="checkbox"
                        // defaultChecked={template.shared !== "false"}
                        checked={selectedTemplates?.some(t => t.templateId === template.templateId)}
                        disabled={
                          template?.envelope?.status === "sent" ||
                          template?.envelope?.status === "delivered" ||
                          template?.envelope?.status === "completed"
                        }
                        aria-label="Checkbox for following text input"
                        className="form-check-input float-right"
                        onChange={(e) =>
                          handleCheckChange(template, e.target.checked)
                        }
                      />
                    }
                  </span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <>No templates found!</>
          )}
          <Form ref={applicantForm} className="mt-5">
                <Form.Group className="form-group">
                  <Form.Label htmlFor="applicantEmail">Email</Form.Label>
                  <Form.Control
                    className="form-control form-control-sm"
                    type="email"
                    defaultValue={applicantData?.email ? applicantData?.email : ""}
                    id="applicantEmail"
                    required
                  />
                </Form.Group>
                <Form.Group className="form-group">
                  <Form.Label htmlFor="applicantName"> Name</Form.Label>
                  <Form.Control
                    className="form-control form-control-sm"
                    type="text"
                    defaultValue={applicantData?.name}
                    id="applicantName"
                    required
                  />
                </Form.Group>
                {/* <Form.Group className="form-group">
                  <Form.Label htmlFor="applicantroleName">Role</Form.Label>
                  <Form.Control
                    className="form-control form-control-sm"
                    type="text"
                    defaultValue="Signer"
                    id="applicantroleName"
                    required
                  />
                </Form.Group> */}
              </Form>
              <Button
                onClick={() => {
                  sendDocumentsForSigning(user);
                }}
                className="w-100 mb-5"
                disabled={sendDocumentsForSigningLoading}
                style={{
                  backgroundColor: "var(--primary-hover-bg-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {sendDocumentsForSigningLoading 
                ? 
                <>
                  <Spinner /> 
                  <span 
                    style={{marginLeft:"10px"}}
                  >Please wait, the documents are being sent!
                  </span>
                </> 
                : "Send"}
              </Button>
        </div>
        <div className="col-6">
          <h5>Preview</h5>
          <ListGroup
            className="border"
            style={{
              height: "40rem",
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: `${imgData === null ? "center" : "flex-start"}`
            }}
          >
            {imgData === null && <>No Preview To Show</>}
            {imgData === false ? (
              <Spinner />
            ) : (
              <div>
                {imgData?.map((el, index) => (
                  <img
                    key={index}
                    src={el.data}
                    style={{
                      width: "100%",
                      marginBottom: "20px",
                    }}
                    alt={`Page ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </ListGroup>
          {/* <Button
            onClick={() => {
              sendDocumentsForSigning();
            }}
          >
            {" "}
            send
          </Button> */}
        </div>
      </div>
    </form>
  );
};

export default UserDocuments;
