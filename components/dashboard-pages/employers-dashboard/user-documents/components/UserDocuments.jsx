import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Spinner } from "react-bootstrap";

const UserDocuments = ({applicantData}) => {
  const user = useSelector((state) => state.candidate.user);
  const [allTemplates, setAllTemplates] = useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [imgData, setImgData] = useState(null);

  // Function to fetch templates and update the state
  const fetchTemplates = async () => {
    try {
      const token = await getAccessToken(user.email);
      const response = await fetch(
        `/api/ds/templates?token=${token.data.access_token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsLoading(false);
        setAllTemplates(data?.data?.envelopeTemplates); // Update the state with fetched data
      } else {
        setIsLoading(false);
        console.error("Failed to fetch templates");
      }
    } catch (error) {
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
  const fetchOnePreview = async (templateId) => {
    setImgData(false);
    try {
      const token = await getAccessToken(user.email);
      const response = await fetch(
        `/api/ds/preview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            template:{
              templateId: templateId,
              documentId: 1,
            },
            token: token.data.access_token,
          })
      }).then(res => res.json());
      setImgData({templateId, data:`data:image/${response.pages[0].mimeType};base64,${response.pages[0].imageBytes}`});
    } catch (error) {
      console.error(error);
      setImgData(null);
    }
  }
  
  useEffect(() => {
    fetchTemplates(); // Fetch templates when the component mounts
    setIsLoading(true);
  }, []);

  return (
    <form className="default-form">
      <div className="row">
        <div className="col-4">
          <div>Documents:</div>
          {isLoading ? (
            <Spinner />
          ) : allTemplates ? (
            <ListGroup as="ol" variant="numbered">
              {allTemplates?.map((template) => (
                <ListGroup.Item 
                  key={template.id} 
                  onClick={()=>fetchOnePreview(template.templateId)} 
                  style={{cursor: "pointer"}} 
                  disabled={imgData === false || imgData?.templateId === template.templateId}
                >
                  {template.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <>No templates found!</>
          )}
        </div>
        <div className="col-8">
          <div>Preview:</div>
          <ListGroup>
            {imgData === null && <>No Preview To Show</>}  
            {imgData === false ? <Spinner /> : <img src={imgData?.data}/>}
            {/* <ListGroup.Item>Cras justo odio</ListGroup.Item>
            <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
            <ListGroup.Item>Morbi leo risus</ListGroup.Item>
            <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
            <ListGroup.Item>Vestibulum at eros</ListGroup.Item> */}
          </ListGroup>
        </div>
      </div>
    </form>
  );
};

export default UserDocuments;
