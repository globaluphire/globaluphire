import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Button, Form, ListGroup, ListGroupItem } from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

const UserDocuments = ({ applicantData }) => {
  const user = useSelector((state) => state.candidate.user);
  const [allTemplates, setAllTemplates] = useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imgData, setImgData] = useState(null);
  const applicantForm = useRef(null);
  const [sendDocumentsForSigningLoading, setSendDocumentsForSigningLoading] = useState(false);
  const [refreshDisabled, setRefreshDisabled ] = useState(false);

  // Function to fetch templates and update the state
  const sendDocumentsForSigning = async () => {
    setSendDocumentsForSigningLoading(true);
    try {
      if (!applicantForm.current) {
        return;
      }
      const applicantEmail = applicantForm.current.querySelector("#applicantEmail").value;
      const applicantName = applicantForm.current.querySelector("#applicantName").value;
      const applicantroleName = applicantForm.current.querySelector("#applicantroleName").value;
    if(!applicantEmail || !applicantName || !applicantroleName){
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
        roleName: applicantroleName,
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
        const data = await response.json();
      } else {
        setIsLoading(false);
        console.error("Failed to fetch templates");
      }
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
        setAllTemplates(data?.data); // Update the state with fetched data
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
      // setImgData({
      //   templateId: template.templateId,
      //   data: `data:image/${response.pages[0].mimeType};base64,${response.pages[0].imageBytes}`,
      // });
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
      // setImgData({
      //   templateId: template.templateId,
      //   data: `data:image/${response.pages[0].mimeType};base64,${response.pages[0].imageBytes}`,
      // });
    } catch (error) {
      console.error(error);
      setImgData(null);
    }
  };

  useEffect(() => {
    if (applicantData) {
      fetchTemplates(applicantData);
    }
  }, [applicantData]);

  const handleCheckChange = (template, checked) => {
    if (checked) {
      if (!selectedTemplates.some(t => t.templateId === template.templateId)) {
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
            return 'orange'
        case 'delivered':
            return 'sky'
        case 'read':
            return 'sky'
        case 'signed':
            return 'green'
        case 'completed':
            return 'green'
        case 'not sent':
            return 'red'
        default:
            return 'red'
    }
}

  return (
    <form className="default-form">
      <div className="row">
        <div className="col-6">
          <h5 className="mb-3" style={{display:"flex"}}>Documents          
            <span style={{marginLeft:"15px"}}>
              <span 
                className="flaticon-reload" 
                style={{
                  cursor: refreshDisabled ? "not-allowed" :"pointer",
                }} 
                onClick={()=>fetchTemplates(applicantData)}
                disabled={refreshDisabled}
              >
              </span>
            </span>
          </h5>

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
                height: "40rem",
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
                        backgroundColor: determineBadgeColor(template?.envelope?.status),
                      }}
                      >
                      {template?.envelope?.status
                        ? template?.envelope?.status
                        : "not sent"}
                    </span>
                    </div>
                    {!(template?.envelope?.status) && 
                      <input
                        type="checkbox"
                        // defaultChecked={template.shared !== "false"}
                        disabled={
                          template?.envelope?.status === "sent" ||
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
                <Form.Group className="form-group">
                  <Form.Label htmlFor="applicantroleName">Role</Form.Label>
                  <Form.Control
                    className="form-control form-control-sm"
                    type="text"
                    defaultValue="Signer"
                    id="applicantroleName"
                    required
                  />
                </Form.Group>
              </Form>
              <Button
                onClick={() => {
                  sendDocumentsForSigning();
                }}
                className="w-100 mb-5"
                disabled={sendDocumentsForSigningLoading}
                style={{
                  backgroundColor: "var(--primary-hover-bg-color)",
                }}
              >
                {sendDocumentsForSigningLoading ? <Spinner /> : "Send"}
              </Button>
            </ListGroup>
          ) : (
            <>No templates found!</>
          )}
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
