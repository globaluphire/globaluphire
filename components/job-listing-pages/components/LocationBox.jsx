/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../../config/supabaseClient";
import { addLocation, addFacility } from "../../../features/filter/filterSlice";

const LocationBox = () => {
    const { jobList } = useSelector((state) => state.filter);
    // const [getLocation, setLocation] = useState(jobList.location);
    const [getFacility, setFacility] = useState(jobList.facility);
    const dispath = useDispatch();
    const searchFacility = useSelector((state) => state.search.searchFacility);

    // location handler
    // const locationHandler = (e) => {
    //     dispath(addLocation(e.target.value));
    // };

    // useEffect(() => {
    //     setLocation(jobList.location);
    // }, [setLocation, jobList]);

    const [facilityNames, setFacilityNames] = useState([]);
    const [facilitySingleSelections, setFacilitySingleSelections] = useState(
        []
    );

    async function getFacilityNames() {
        // call reference to get applicantStatus options
        const { data: refData, error: e } = await supabase
            .from("reference")
            .select("*")
            .eq("ref_nm", "facilityName");

        if (refData) {
            // setFacilityNames(refData)
            const facilities = [];
            for (let i = 0; i < refData.length; i++) {
                facilities.push(refData[i].ref_dspl);
            }
            facilities.sort();
            setFacilityNames(facilities);
        }
    }

    useEffect(() => {
        if (searchFacility === "") {
            setFacilitySingleSelections([]);
        }
        getFacilityNames();
    }, [searchFacility]);

    useEffect(() => {
        getFacilityNames();
    }, []);

    useEffect(() => {
        dispath(addFacility(facilitySingleSelections[0]));
    }, [facilitySingleSelections]);

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
