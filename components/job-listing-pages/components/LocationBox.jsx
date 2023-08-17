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
        "Keizer",
        "French Prairie",
        "Green Valley",
        "HearthStone",
        "Highland House",
        "Rose Haven",
        "Royal Garden",
        "South Hills",
        "Umpqua Valley",
        "Corvallis",
        "Hillside Heights",
        "Hale Nani",
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
