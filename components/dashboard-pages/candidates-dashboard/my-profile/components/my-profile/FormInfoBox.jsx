import Router, { useRouter } from "next/router";
import Select from "react-select";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from '../../../../../../config/supabaseClient';
// import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import { Tooltip } from 'react-tooltip'
// import SunEditor from "suneditor-react";

const FormInfoBox = () => {
  const catOptions = [
    { value: "Banking", label: "Banking" },
    { value: "Digital & Creative", label: "Digital & Creative" },
    { value: "Retail", label: "Retail" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Managemnet", label: "Managemnet" },
    { value: "Accounting & Finance", label: "Accounting & Finance" },
    { value: "Digital", label: "Digital" },
    { value: "Creative Art", label: "Creative Art" },
  ];

  const user = useSelector(state => state.candidate.user);
  useEffect(() => {
    fetchCandidate(user.id);
  }, []);

  let arrExistingDepartments = [];
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState('+1');
  const [email, setEmail] = useState('');
  const [currentSalary, setCurrentSalary] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [experience, setExperience] = useState('');
  const [DOB, setDOB] = useState('');
  const [education, setEducation] = useState('');
  const [language, setLanguage] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');

  const handleMultipleValues = (selectedValues) => {
    let selectedString = "";
    if (selectedValues && selectedValues != false) {
      selectedValues.map((item) => {
        selectedString += item.value + ",";
      })
    }
    if (selectedString != "") {
      selectedString = selectedString.substring(0, selectedString.length - 1);
    }
    //console.log("selectedString", selectedString);
    setSkills(selectedString);
  }

  const fetchCandidate = async (userID) => {
    try {
      if (userID) {
        let userData = await supabase
          .from('users')
          .select('*')
          .eq('user_id', userID);
        if(userData){
            //set userData
            setName(userData.data[0].name);
            setEmail(userData.data[0].email);

            // fetch user details
            let userDtlData = await supabase
              .from('users_dtl')
              .select('*')
              .eq('user_id', userID);
            if (userDtlData) {
              setPhone(userDtlData.data[0].phn_nbr);
              setCurrentSalary(userDtlData.data[0].curr_sal);
              setExpectedSalary(userDtlData.data[0].expected_sal);
              setExperience(userDtlData.data[0].experience);
              setDOB(userDtlData.data[0].dob);
              setEducation(userDtlData.data[0].education);
              setLanguage(userDtlData.data[0].languages);
              setDescription(userDtlData.data[0].desc);

              // let all_departments = customer[0].departments;
              // let arrSelectedDepartments = [];
              // if (all_departments != null) {
              //   all_departments = all_departments.split(",");
              //   all_departments.map((item) => {
              //     catOptions.map((defined_item, index) => {
              //       if (defined_item.label == item) {
              //         arrSelectedDepartments.push(catOptions[index]);
              //         arrExistingDepartments.push(catOptions[index]);
              //       }
              //     })
              //   });
              //   if (arrSelectedDepartments.length > 0) {
              //     setCategoriesForm(arrSelectedDepartments);
              //   }
              // }
            }
          }
        }
      
    } catch (e) {
      console.log("Fetch user Error", e);
      toast.error('System is unavailable to fetch customer.  Please try again later or contact tech support!', {
        position: "bottom-right",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.warn(e)
    }
  };

  const submitCandidateProfile = async () => {
    if (name && phone && email && experience && education) {
      try {
          await supabase
            .from('users')
            .update({
              name: name,
              change_dttm: new Date()
            })
            .eq('user_id', user.id);

          await supabase
            .from('users_dtl')
            .update({
              phn_nbr: phone,
              curr_sal: currentSalary,
              expected_sal: expectedSalary,
              experience: experience,
              // dob: DOB,
              education: education,
              // languages: language,
              // skills: skills,
              // allow_indexig: allowSearchListingForm,
              desc: description,
              change_dttm: new Date()
            })
            .eq('user_id', user.id);

        // open toast
        toast.success('Your Profile Updated successfully', {
          position: "bottom-right",
          autoClose: true,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTimeout(() => {
          Router.push("/candidates-dashboard/my-profile")
        }, 3000);

      } catch (err) {
        // open toast
        console.log("My Profile Error", err);
        toast.error('Error while saving your company profile, Please try again later or contact tech support', {
          position: "bottom-right",
          autoClose: true,
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
      toast.error('Please fill all the required fields.', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };



  return (
    <form 
      action="#" 
      className="default-form" 
      onSubmit={(e)=>{
        e.preventDefault();
        submitCandidateProfile();
    }}>
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Full Name <span className="required">(required)</span></label>
          <input
            type="text"
            name="name"
            value={name}
            required
            onChange={(e) => { setName(e.target.value) }}
            disabled
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Phone Number <span className="required">(required)</span>
            <a data-tooltip-id="phone-tooltip" data-tooltip-content="Phone number should be in +1123456890">
              <span className="lar la-question-circle" style={{ fontSize: '14px', margin: '5px' }}></span>
            </a>
            <Tooltip id="phone-tooltip" />
          </label>
          <input
            type="text"
            name="phone"
            value={phone}
            required
            minlength="12"
            onChange={(e) => {
              if (e.target.value.trim() === "") {
                setPhone("+1");
                return;
              }
              const number = e.target.value.replace("+1", "");
              if (isNaN(number)) return;
              if (e.target.value.length <= 12) {
                setPhone(e.target.value.trim());
              }
            }}
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Email address <span className="required">(required)</span></label>
          <input
            type="email"
            name="email"
            readOnly
            value={email}
            required
            disabled
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-3 col-md-12">
          <label>Current Salary($)</label>
          <select
            className="chosen-single form-select"
            value={currentSalary}
            onChange={(e) => { setCurrentSalary(e.target.value) }}
          >
            <option></option>
            <option>40-60 K</option>
            <option>60-80 K</option>
            <option>80-100 K</option>
            <option>100-150 K</option>
            <option>150K</option>
          </select>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-3 col-md-12">
          <label>Expected Salary($)</label>
          <select
            className="chosen-single form-select"
            value={expectedSalary}
            onChange={(e) => { setExpectedSalary(e.target.value) }}
          >
            <option></option>
            <option>40-60 K</option>
            <option>60-80 K</option>
            <option>80-100 K</option>
            <option>100-150 K</option>
            <option>150K</option>
          </select>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>
            Experience <span className="required">(Required)</span>
            <a data-tooltip-id="experience-tooltip" data-tooltip-content="How many years of Experience do you have? Ex. Freshers or 5 Years">
              <span className="lar la-question-circle" style={{ fontSize: '14px', margin: '5px' }}></span>
            </a>
            <Tooltip id="experience-tooltip" />
          </label>
          <input
            type="text"
            value={experience}
            Required
            onChange={(e) => { setExperience(e.target.value) }}
          />
        </div>

        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-6 col-md-12">
          <label>Date of Birth</label>
          <select
            className="chosen-single form-select"
            value={DOB}
            onChange={(e) => { setDOB(e.target.value) }}
          >
            <option>23 - 27 Years</option>
            <option>24 - 28 Years</option>
            <option>25 - 29 Years</option>
            <option>26 - 30 Years</option>
          </select>
        </div> */}

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Education <span className="required">(required)</span></label>
          <select
            className="chosen-single form-select"
            value={education}
            onChange={(e) => {setEducation(e.target.value)}}
          >
            <option></option>
            <option>Certificate</option>
            <option>High School</option>
            <option>Associate Degree</option>
            <option>Bachelor's Degree</option>
            <option>Master's Degree</option>
          </select>
        </div>

        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-6 col-md-12">
          <label>
            Languages
            <a data-tooltip-id="facility-tooltip" data-tooltip-content="Add languages in comma separated! Ex. English, Spanish, ...">
              <span className="lar la-question-circle" style={{ fontSize: '14px', margin: '5px' }}></span>
            </a>
          </label>
          <input
            type="text"
            value={language}
            onChange={(e) => { setLanguage(e.target.value) }}
          />
        </div> */}

        {/* <!-- Search Select --> */}
        {/* <div className="form-group col-lg-6 col-md-12">
          <label>
            Skills
            <a data-tooltip-id="facility-tooltip" data-tooltip-content="Add skills in comma separated!">
              <span className="lar la-question-circle" style={{ fontSize: '14px', margin: '5px' }}></span>
            </a>
          </label>
          <Tooltip id="facility-tooltip" />
          <input
            type="text"
            name="skills"
            onChange={(e) => { setSkills(e.target.value) }}
          />
            
        </div> */}

        {/* <!-- About Candidate --> */}
        {/* <div className="form-group col-lg-12 col-md-12">
          <label>Description <span className="required">(required)</span></label>
          <a data-tooltip-id="description-tooltip" data-tooltip-content="Describe about yourself!">
            <span className="lar la-question-circle" style={{ fontSize: '14px', margin: '5px' }}></span>
          </a>
          <Tooltip id="description-tooltip" />
          <SunEditor
            setContents={description}
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
              setDescription(e)
            }}
          />
        </div> */}

        {/* <!-- About Company --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Description <span className="required">(required)</span></label>
          <a data-tooltip-id="description-tooltip" data-tooltip-content="Describe about yourself!">
            <span className="lar la-question-circle" style={{ fontSize: '14px', margin: '5px' }}></span>
          </a>
          <Tooltip id="description-tooltip" />
          <textarea
            type="text"
            value={description}
            onChange={(e) => {              
              setDescription(e.target.value)
            }}
          >
          </textarea>
        </div>


        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <button
            type="submit"
            className="theme-btn btn-style-one"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default FormInfoBox;
