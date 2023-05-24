import { useDispatch, useSelector } from "react-redux";
import { addJobType } from "../../../features/filter/filterSlice";
import { jobTypeCheck } from "../../../features/job/jobSlice";

const JobType = () => {
    const { jobTypeList } = useSelector((state) => state.job) || {};
    const dispatch = useDispatch();

    // dispatch job-type
    const jobTypeHandler = (e, id) => {
        dispatch(addJobType(e.target.value));
        dispatch(jobTypeCheck(id));
    };

    return (
        <ul className="ui-checkbox">
            {jobTypeList?.map((item) => (
                <li key={item.id}>
                    <label>
                        <input
                            type="radio"
                            value={item.value}
                            checked={item.isChecked}
                            onChange={(e) => jobTypeHandler(e, item.id)}
                        />
                        <span></span>
                        <p>{item.name}</p>
                    </label>
                </li>
            ))}
        </ul>
    );
};

export default JobType;
