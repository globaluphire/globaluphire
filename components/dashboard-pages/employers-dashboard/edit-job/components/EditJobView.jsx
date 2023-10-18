import Map from "../../../Map";
import Select from "react-select";
import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from "../../../../../config/supabaseClient";
import Router, { useRouter } from "next/router";
import dynamic from "next/dynamic";
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import { Typeahead } from 'react-bootstrap-typeahead';
import { envConfig } from "../../../../../config/env";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const apiKey = envConfig.JOB_PORTAL_GMAP_API_KEY;
const mapApiJs = 'https://maps.googleapis.com/maps/api/js';

const editedJobFields = {
    editedJobTitle: "",
    editedJobDesc: "",
    editedJobType: "",
    editedSalary: "",
    editedSalaryRate: "",
    editedCareer: "",
    editedExp: "",
    editedCompleteAddress: "",
    editedFacility: ""
}

// load google map api js
function loadAsyncScript(src) {
    return new Promise(resolve => {
        const script = document.createElement("Script");
        Object.assign(script, {
            type: "text/javascript",
            async: true,
            src
        })
        script.addEventListener("load", () => resolve(script));
        document.head.appendChild(script);
    })
}

const submitJobPost = async (
  { editedJobTitle, editedJobDesc, editedJobType, editedSalary, editedSalaryRate, editedCareer, editedExp, editedAddress, editedCompleteAddress, editedFacility },
  setEditedJobData,
  user,
  fetchedJobData
) => {
    if (editedJobTitle && editedJobDesc &&
        editedJobType && editedExp) {
        try {

            const { data, error } = await supabase
            .from('jobs')
            .update(
                { job_title: editedJobTitle,
                 job_desc: editedJobDesc,
                 job_type: editedJobType,
                 experience: editedExp,
                 education: editedCareer,
                 salary: editedSalary,
                 salary_rate: editedSalaryRate,
                 change_dttm: new Date(),
                 update_ver_nbr: fetchedJobData.update_ver_nbr + 1
                }
                )
            .eq('job_id', fetchedJobData.job_id)
            // .select() -- this will return the updated record in object

            // reset all the edit form fields
            setEditedJobData(JSON.parse(JSON.stringify(editedJobFields)))

            // open toast
            toast.success('Job edited successfully', {
                position: "bottom-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            // redirect to original page where user came from
            setTimeout(() => {
                Router.push("/employers-dashboard/manage-jobs")
            }, 500)
      } catch (err) {
        // open toast
        toast.error('Error while saving your changes, Please try again later or contact tech support', {
            position: "bottom-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
        // console.warn(err);
      }
    } else {
        // open toast
        toast.error('You do not have any changes to save', {
            position: "top-center",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
};

const EditJobView = ({ fetchedJobData }) => {
  // console.log(fetchedJobData);
  const user = useSelector(state => state.candidate.user)
  const [editedJobData, setEditedJobData] = useState(JSON.parse(JSON.stringify(editedJobFields)));
  const { editedJobTitle, editedJobDesc, editedJobType, editedSalary, editedSalaryRate, editedCareer, editedExp, editedAddress, editedCompleteAddress, editedFacility } = useMemo(() => editedJobData, [editedJobData])

  const router = useRouter();
  const JobId = router.query.id;

  const searchInput = useRef(null);

  // init google map script
  const initMapScript = () => {
    // if script already loaded
    if (window.google) {
        return Promise.resolve();
    }
    const src = `${mapApiJs}?key=${apiKey}&libraries=places&v=weekly`;
    return loadAsyncScript(src);
  }

  // do something on address change
  const onChangeAddress = (autocomplete) => {
    const location = autocomplete.getPlace();
    setEditedJobData((previousState) => ({ 
      ...previousState,
      editedAddress: searchInput.current.value
  }))
  }

  // init autocomplete
  const initAutocomplete = () => {
    if (!searchInput.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(searchInput.current, {
        types: ['(cities)']
      }
    );
    autocomplete.setFields(["address_component", "geometry"]);
    autocomplete.addListener("place_changed", () => onChangeAddress(autocomplete))

  }

  // load map script after mounted
  useEffect(() => {
    initMapScript().then(() => initAutocomplete())
  }, []);

  const assignJobData = () => {
    setEditedJobData({
      editedJobTitle: fetchedJobData.job_title,
      editedJobDesc: fetchedJobData.job_desc,
      editedJobType: fetchedJobData.job_type,
      editedSalary: fetchedJobData.salary,
      editedSalaryRate: fetchedJobData.salary_rate,
      editedCareer: fetchedJobData.education,
      editedExp: fetchedJobData.experience,
      editedCompleteAddress: fetchedJobData.job_comp_add,
      editedFacility: fetchedJobData.facility_name
    })
  }

  useEffect(() => {
    assignJobData(fetchedJobData)
  }, [fetchedJobData]);

  // useEffect(() => {
  //   searchInput.current.value = fetchedJobData.job_address
  // }, [fetchedJobData.job_address]);

  return (
    <form className="default-form">
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Title <span className="required">(required)</span></label>
            <input
              type="text"
              name="globaluphire-jobTitle"
              value={editedJobTitle}
              required
              onChange={(e) => {
              setEditedJobData((previousState) => ({ 
                  ...previousState,
                  editedJobTitle: e.target.value
              }))
              }}
            />
        </div>
        {/* <!-- About Company --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Description <span className="required">(required)</span></label>
            <SunEditor 
              setContents={editedJobDesc}
              setOptions={{
              buttonList: [
                ["fontSize", "formatBlock"],
                ["bold", "underline", "italic", "strike", "subscript", "superscript"],
                ["align", "horizontalRule", "list", "table"],
                ["fontColor", "hiliteColor"],
                ["outdent", "indent"],
                ["undo", "redo"],
                ["removeFormat"],
                ["outdent", "indent"],
                ["link"],
                ["preview", "print"],
                ["fullScreen", "showBlocks", "codeView"],
              ],
            }}
            setDefaultStyle="color:black;"
            onChange={(e) => {
              setEditedJobData((previousState) => ({ 
                ...previousState,
                editedJobDesc: e
              }))
            }}
            />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Job Type <span className="required"> (required)</span></label>
            <select
                className="chosen-single form-select"
                value={editedJobType}
                required
                onChange={(e) => {
                setEditedJobData((previousState) => ({ 
                    ...previousState,
                    editedJobType: e.target.value
                }))
                }}
            >
            <option></option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Both</option>
            <option>PRN</option>
            </select>
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Experience<span className="required"> (required)</span></label>
              <select
                    className="chosen-single form-select"
                    value={editedExp}
                    required
                    onChange={(e) => {
                    setEditedJobData((previousState) => ({ 
                        ...previousState,
                        editedExp: e.target.value
                    }))
                    }}
                >
                    <option></option>
                    <option>1 year</option>
                    <option>2 years</option>
                    <option>3 years</option>
                    <option>4 years</option>
                    <option>5 years</option>
                    <option>6 years</option>
                    <option>7 years</option>
                    <option>8 years</option>
                    <option>9 years</option>
                    <option>10+ years</option>
                </select>
        </div>
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Offered Salary <span className="optional">(optional)</span></label>
          <input
            type="text"
            name="globaluphire-salary"
            value={editedSalary}
            placeholder="$100,000.00"
            onChange={(e) => {
              setEditedJobData((previousState) => ({ 
                ...previousState,
                editedSalary: e.target.value
              }))
            }}
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Salary Rate <span className="optional">(optional)</span></label>
            <select
                  className="chosen-single form-select"
                  value={editedSalaryRate}
                  onChange={(e) => {
                  setEditedJobData((previousState) => ({ 
                      ...previousState,
                      editedSalaryRate: e.target.value
                  }))
                  }}
              >
                  <option></option>
                  <option>Per hour</option>
                  <option>PRN</option>
                  <option>Per month</option>
                  <option>Per year</option>
              </select>
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <label>Education<span className="optional"> (optional)</span></label>
              <select
                    className="chosen-single form-select"
                    value={editedCareer}
                    onChange={(e) => {
                    setEditedJobData((previousState) => ({ 
                        ...previousState,
                        editedCareer: e.target.value
                    }))
                    }}
                >
                    <option></option>
                    <option>Certificate</option>
                    <option>High School</option>
                    <option>Associate Degree</option>
                    <option>Bachelor's Degree</option>
                    <option>Master's Degree</option>
                </select>
        </div>

        <div className="form-group col-lg-12 col-md-12">
          <label>Facility Name <span className="optional">(read-only)</span></label>
          {/* { !editedFacility ? 
            <Typeahead
              onChange={setFacilitySingleSelections}
              id="facilityName"
              className="form-group"
              placeholder="Facility Name"
              options={facilityNames}
              selected={fetchedJobData.facility_name}
              required
            />
            : <Typeahead
                onChange={setFacilitySingleSelections}
                id="facilityName"
                className="form-group"
                placeholder="Facility Name"
                options={facilityNames}
                selected={editedFacility}
                required
              />
          } */}
          <input
            type="text"
            name="facilityName"
            placeholder="Facility Name"
            value={editedFacility}
            disabled
          />
        </div>
        <div className="form-group col-lg-12 col-md-12">
          <label>Complete Address <span className="optional">(read-only)</span></label>
          <input
            type="text"
            name="globaluphire-address"
            value={editedCompleteAddress}
            placeholder="Address"
            disabled
          />
        </div>
        <div className="form-group col-lg-12 col-md-12 text-right">
          <button
            className="theme-btn btn-style-one"
            onClick={(e) => {
              e.preventDefault();
              submitJobPost(editedJobData, setEditedJobData, user, fetchedJobData);
            }}
          >
            Save Changes
          </button>
          <button
            className="theme-btn btn-style-one"
            onClick={()=>{
                router.push(`/employers-dashboard/manage-jobs`)
              }}
            style={{marginLeft: "10px"}}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditJobView;
