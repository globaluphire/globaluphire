import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Spinner } from "react-bootstrap";

const UserDocuments = () => {
  const user = useSelector((state) => state.candidate.user);
  const [allTemplates, setAllTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
                <ListGroup.Item key={template.id}>
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
            <ListGroup.Item>Cras justo odio</ListGroup.Item>
            <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
            <ListGroup.Item>Morbi leo risus</ListGroup.Item>
            <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
            <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
          </ListGroup>
        </div>
      </div>
    </form>
  );
};

export default UserDocuments;
