import { useEffect, useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { useDispatch, useSelector } from "react-redux";
import { addLocation, addFacility } from "../../../features/filter/filterSlice";

const LocationBox = () => {
    const { jobList } = useSelector((state) => state.filter);
    // const [getLocation, setLocation] = useState(jobList.location);
    const [getFacility, setFacility] = useState(jobList.facility);
    const dispath = useDispatch();

    // location handler
    // const locationHandler = (e) => {
    //     dispath(addLocation(e.target.value));
    // };

    // useEffect(() => {
    //     setLocation(jobList.location);
    // }, [setLocation, jobList]);

    const [facilitySingleSelections, setFacilitySingleSelections] = useState([]);

    const facilityNames = [
        "Keizer Nursing and Rehabilitation",
        "French Prairie Nursing & Rehabilitation",
        "Green Valley Rehabilitation Health",
        "Hearthstone Nursing & Rehabilitation",
        "Highland House Nursing & Rehabilitation",
        "Rose Haven Nursing",
        "Royale Gardens Health & Rehabilitation",
        "South Hills Rehabilitation",
        "Umpqua Valley Nursing & Rehabilitation",
        "Corvallis Manor Nursing & Rehabilitation",
        "Hillside Heights Rehabilitation",
        "Hale Nani Rehab & Nursing",
        "Eugene Home Office",
        "Louisville Home Office",
        "Chateau Napoleon Caring",
        "Cypress at Lake Providence",
        "Lakeshore Manor Nursing and Rehab",
        "St. Bernard Nursing & Rehab"
    ]
    

    useEffect(() => {
        dispath(addFacility(facilitySingleSelections[0]))
    }, [facilitySingleSelections])

    useEffect(() => {
        setFacility(jobList.facility);
    }, [setFacility, jobList]);

    return (
        <>
            <Typeahead
                onChange={setFacilitySingleSelections}
                id="facilityName"
                className="form-group"
                placeholder="Facility Name"
                options={facilityNames}
                selected={facilitySingleSelections}
            />
            {/* <input
                type="text"
                name="listing-search"
                placeholder="City or postcode"
                value={getLocation}
                onChange={locationHandler}
            /> */}
            <span className="icon flaticon-map-locator"></span>
        </>
    );
};

export default LocationBox;
