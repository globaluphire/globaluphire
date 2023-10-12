import Pagination from "../components/Pagination";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../../config/supabaseClient";
import {
  addCategory,
  addDatePosted,
  addDestination,
  addKeyword,
  addLocation,
  addPerPage,
  addSalary,
  addSort,
  addTag,
  clearExperience,
  clearJobType,
} from "../../../features/filter/filterSlice";
import {
  clearDatePostToggle,
  clearExperienceToggle,
  clearJobTypeToggle,
} from "../../../features/job/jobSlice";
import { setSearchFields } from "../../../features/search/searchSlice";

const FilterJobBox = () => {
  const { jobList, jobSort } = useSelector((state) => state.filter);
  const searchFacility = useSelector((state) => state.search.searchFacility);
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const pageSize = useSelector((state) => state.filter.jobSort.perPage.end);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [hidePagination, setHidePagination] = useState(false);
  const {
    keyword,
    location,
    destination,
    category,
    jobType,
    datePosted,
    experience,
    salary,
    tag,
    jobTypeSelect,
  } = jobList || {};

  const { sort, perPage } = jobSort;

  const dispatch = useDispatch();

  const searchJobs = async () => {
    let searchDate = null;
    let d = new Date();
    switch (datePosted) {
      case "last-24-hour":
        d.setDate(d.getDate() - 1);
        searchDate = d.toISOString();
        break;
      case "last-7-days":
        d.setDate(d.getDate() - 7);
        searchDate = d.toISOString();
        break;
      case "last-14-days":
        d.setDate(d.getDate() - 14);
        searchDate = d.toISOString();
        break;
      case "last-30-days":
        d.setDate(d.getDate() - 30);
        searchDate = d.toISOString();
        break;
    }
    let query = supabase.from("jobs").select("*", { count: "exact" });
    // if(searchAddress) query = query.ilike('job_address', '%'+searchAddress+'%')
    // if (searchFacility) query = query.eq("facility_name", searchFacility);
    // if (searchTerm) query = query.ilike("job_title", "%" + searchTerm + "%");
    query = query.eq("status", "Published");
    query = query.order("created_at", { ascending: sort == "des" });
    if (searchFacility) query = query.eq("facility_name", searchFacility);
    if (searchTerm) query = query.ilike("job_title", "%" + searchTerm + "%");
    if (jobTypeSelect) query = query.eq("job_type", jobTypeSelect);
    if (searchDate) query = query.gte("created_at", searchDate);
    if (pageSize <= totalRecords) {
      query = query.range(
        (currentPage - 1) * pageSize,
        currentPage * pageSize - 1
      );
    } else {
      // If pageSize exceeds totalRecords, you may want to reset currentPage to 1
      query = query.range(0, pageSize - 1);
      setCurrentPage(1); // Reset currentPage to 1
    }
    query = query.range(
      (currentPage - 1) * pageSize,
      currentPage * pageSize - 1
    );

    query.then((res) => {
      setCurrentPage(currentPage);
      setJobs(res.data);
      setTotalRecords(res.count);
    });
    // query.then((res) => {
    //   console.log(currentPage);
    //   console.log(res);
    //   setJobs(res.data);
    //   if (jobs.length + res?.data?.length > totalRecords) setJobs(res.data);
    //   else setJobs([...jobs, ...res?.data]);
    //   setTotalRecords(res.count);
    // });
  };

  useEffect(() => {
    searchJobs();
  }, [jobTypeSelect, searchFacility, searchTerm, pageSize, currentPage, datePosted]);
  // keyword filter on title
  const keywordFilter = (item) =>
    keyword !== ""
      ? item.jobTitle.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
      : item;

  // location filter
  const locationFilter = (item) =>
    location !== ""
      ? item?.location
          ?.toLocaleLowerCase()
          .includes(location?.toLocaleLowerCase())
      : item;

  // location filter
  const destinationFilter = (item) =>
    item?.destination?.min >= destination?.min &&
    item?.destination?.max <= destination?.max;

  // category filter
  const categoryFilter = (item) =>
    category !== ""
      ? item?.category?.toLocaleLowerCase() === category?.toLocaleLowerCase()
      : item;

  // job-type filter
  const jobTypeFilter = (item) =>
    jobType?.length !== 0 && item?.job_type !== undefined
      ? jobType?.includes(
          item?.job_type[0]?.type.toLocaleLowerCase().split(" ").join("-")
        )
      : item;

  // date-posted filter
  const datePostedFilter = (item) =>
    datePosted !== "all" && datePosted !== ""
      ? item?.created_at
          ?.toLocaleLowerCase()
          .split(" ")
          .join("-")
          .includes(datePosted)
      : item;

  // experience level filter
  const experienceFilter = (item) =>
    experience?.length !== 0
      ? experience?.includes(
          item?.experience?.split(" ").join("-").toLocaleLowerCase()
        )
      : item;

  // salary filter
  const salaryFilter = (item) =>
    item?.totalSalary?.min >= salary?.min &&
    item?.totalSalary?.max <= salary?.max;

  // tag filter
  const tagFilter = (item) => (tag !== "" ? item?.tag === tag : item);

  // sort filter
  const sortFilter = (a, b) =>
    sort === "des" ? a.id > b.id && -1 : a.id < b.id && -1;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  let content = jobs
    // ?.filter(keywordFilter)
    // ?.filter(locationFilter)
    // ?.filter(destinationFilter)
    // ?.filter(categoryFilter)
    ?.filter(jobTypeFilter)
    // ?.filter(datePostedFilter)
    // ?.filter(experienceFilter)
    // ?.filter(salaryFilter)
    // ?.filter(tagFilter)
    // ?.sort(sortFilter)
    ?.slice(perPage.start, perPage.end !== 0 ? perPage.end : 16)
    ?.map((item) => (
      <div className="job-block col-lg-6 col-md-12 col-sm-12" key={item.job_id}>
        <div className="inner-box" style={{ minHeight: "10em" }}>
          <div className="content">
            {/* <span className="company-logo">
              <img src={item.logo} alt="item brand" />
            </span> */}
            <h4>
              <Link href={`/job/${item.job_id}`}>{item.job_title}</Link>
            </h4>

            <ul className="job-info">
              {/* <li>
                <span className="icon flaticon-briefcase"></span>
                {item.company}
              </li> */}
              {/* compnay info */}
              {item?.job_comp_add ? (
                <li className="mb-2">
                  <i className="flaticon-map-locator"></i> {item?.job_comp_add}
                </li>
              ) : (
                ""
              )}
              {item?.job_type ? (
                <li className="time">
                  <span className="flaticon-clock-3"></span> {item?.job_type}
                </li>
              ) : (
                ""
              )}
              {/* location info */}
              {/* <li>
                <span className="icon flaticon-clock-3"></span> {item.time}
              </li> */}
              {/* time info */}
              {/* <li>
                <span className="icon flaticon-money"></span> {item.salary}
              </li> */}
              {item?.salary ? (
                <li className="privacy">
                  <i className="flaticon-money"></i> ${item?.salary}{" "}
                  {item?.salary_rate}
                </li>
              ) : (
                ""
              )}
              {/* salary info */}
            </ul>
            {/* End .job-info */}

            {/* <ul className="job-other-info">
              {item?.jobType?.map((val, i) => (
                <li key={i} className={`${val.styleClass}`}>
                  {val.type}
                </li>
              ))}
            </ul> */}
            {/* End .job-other-info */}

            {/* <button className="bookmark-btn">
              <span className="flaticon-bookmark"></span>
            </button> */}
          </div>
        </div>
      </div>
      // End all jobs
    ));
  const isContentEmpty = content?.length === 0;
  // sort handler
  const sortHandler = (e) => {
    dispatch(addSort(e.target.value));
  };

  // per page handler
  const perPageHandler = (e) => {
    const pageData = JSON.parse(e.target.value);
    dispatch(addPerPage(pageData));
  };

  // clear all filters
  const clearAll = () => {
    dispatch(addKeyword(""));
    dispatch(addLocation(""));
    dispatch(addDestination({ min: 0, max: 100 }));
    dispatch(addCategory(""));
    dispatch(clearJobType());
    dispatch(clearJobTypeToggle());
    dispatch(addDatePosted(""));
    dispatch(clearDatePostToggle());
    dispatch(clearExperience());
    dispatch(clearExperienceToggle());
    dispatch(addSalary({ min: 0, max: 20000 }));
    dispatch(addTag(""));
    dispatch(addSort(""));
    dispatch(addPerPage({ start: 0, end: 10 }));
    dispatch(setSearchFields({ searchTerm: "", searchFacility: "" }));
  };

  // const fnCall = async () => {
  //   let searchDate = null;
  //   let d = new Date();
  //   switch (datePosted) {
  //     case "last-24-hour":
  //       d.setDate(d.getDate() - 1);
  //       searchDate = d.toISOString();
  //       break;
  //     case "last-7-days":
  //       d.setDate(d.getDate() - 7);
  //       searchDate = d.toISOString();
  //       break;
  //     case "last-14-days":
  //       d.setDate(d.getDate() - 14);
  //       searchDate = d.toISOString();
  //       break;
  //     case "last-30-days":
  //       d.setDate(d.getDate() - 30);
  //       searchDate = d.toISOString();
  //       break;
  //   }
  //   let query = supabase.from("jobs").select().eq("status", "Published");
  //   if (jobTypeSelect) query = query.eq("job_type", jobTypeSelect);
  //   if (searchDate) query = query.gte("created_at", searchDate);
  //   query = query.eq("status", "Published");
  //   query = query.order("created_at", { ascending: sort == "des" });
  //   if (pageSize <= totalRecords || totalRecords == 0)
  //     query = query.range(
  //       (currentPage - 1) * pageSize,
  //       currentPage * pageSize - 1
  //     );

  //   const { data, error } = await query;
  //   if (data) {
  //     if (jobs.length + data.length > totalRecords) setJobs([...jobs, ...data]);
  //     else setJobs(data);
  //   }
  // };
  // useEffect(() => {
  //   fnCall();
  // }, [jobTypeSelect, sort, datePosted]);

  return (
    <div className="ls-outer">
      <div className="ls-switcher">
        <div className="showing-result show-filters">
          <button
            type="button"
            className="theme-btn toggle-filters d-block mr-30"
            data-bs-toggle="offcanvas"
            data-bs-target="#filter-sidebar"
          >
            <span className="icon icon-filter"></span> Filter
          </button>
          {/* Collapsible sidebar button */}

          <div className="text">
            <strong>{content?.length}</strong> jobs out of{" "}
            <strong>{totalRecords}</strong>
          </div>
        </div>
        {/* End showing results */}

        <div className="sort-by">
          {keyword !== "" ||
          location !== "" ||
          destination?.min !== 0 ||
          destination?.max !== 100 ||
          category !== "" ||
          jobType?.length !== 0 ||
          jobTypeSelect?.length !== 0 ||
          searchFacility?.length !== 0 ||
          datePosted !== "" ||
          experience?.length !== 0 ||
          salary?.min !== 0 ||
          salary?.max !== 20000 ||
          tag !== "" ||
          sort !== "" ||
          perPage.start !== 0 ||
          perPage.end !== 10 ? (
            <button
              onClick={clearAll}
              className="btn btn-danger text-nowrap me-2"
              style={{ minHeight: "45px", marginBottom: "15px" }}
            >
              Clear All
            </button>
          ) : undefined}

          <select
            value={sort}
            className="chosen-single form-select"
            onChange={sortHandler}
          >
            <option value="">Sort by (default)</option>
            <option value="asc">Newest</option>
            <option value="des">Oldest</option>
          </select>
          {/* End select */}

          <select
            onChange={perPageHandler}
            className="chosen-single form-select ms-3 "
            value={JSON.stringify(perPage)}
          >
            {/* <option
              value={JSON.stringify({
                start: 0,
                end: 0,
              })}
            >
              All
            </option> */}
            <option
              value={JSON.stringify({
                start: 0,
                end: 10,
              })}
            >
              10 per page
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 20,
              })}
            >
              20 per page
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 30,
              })}
            >
              30 per page
            </option>
          </select>
          {/* End select */}
        </div>
      </div>
      <div
        className="text"
        style={{ textAlign: "center", marginBottom: "2em" }}
      >
        {isContentEmpty ? (
          ""
        ) : (
          <strong>
            Page {currentPage} of {Math.ceil(totalRecords / pageSize)}
          </strong>
        )}
      </div>
      {/* <!-- ls Switcher --> */}

      {isContentEmpty ? (
        <div
          className="text"
          style={{ textAlign: "center", marginBottom: "2em" }}
        >
          <strong>Nothing Found!</strong>
        </div>
      ) : (
        <div className="row">{content}</div>
      )}
      {/* End .row with jobs */}
      {!hidePagination ? (
        <Pagination
          currentPage={currentPage}
          totalRecords={totalRecords}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      ) : null}

      {/* <!-- End Pagination --> */}
    </div>
  );
};

export default FilterJobBox;
