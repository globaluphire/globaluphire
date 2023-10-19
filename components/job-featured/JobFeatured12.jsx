/* eslint-disable no-unused-vars */
import Link from "next/link";
import Slider from "react-slick";
import jobFeatured from "../../data/job-featured";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { supabase } from "../../config/supabaseClient";
import { setRecentJobs } from "../../features/job/jobSlice";

const JobFeatured12 = () => {
    const settings = {
        dots: true,
        speed: 1400,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const dispatch = useDispatch();
    const router = useRouter();
    const recentJobs = useSelector((state) => state.job.recentJobs);

    useEffect(() => {
        if (recentJobs.length === 0) {
            supabase
                .from("jobs")
                .select()
                .eq("status", "Published")
                .limit(10)
                .order("created_at", { ascending: false })
                .then((res) => {
                    if (res.status === 200)
                        dispatch(setRecentJobs({ jobs: res.data }));
                });
        }
    }, []);

    return (
        <>
            <Slider {...settings} arrows={false}>
                {recentJobs?.map((item) => (
                    <div className="job-block-three mb-0" key={item.job_id}>
                        <div className="inner-box">
                            <div className="content">
                                {/* <span className="company-logo">
                  <img src={item.logo} alt="brand" />
                </span> */}
                                <h4>
                                    <Link href={`/job/${item.job_id}`}>
                                        {item.job_title}
                                    </Link>
                                </h4>

                                <ul className="job-info">
                                    {/* <li>
                    <span className="icon flaticon-briefcase"></span>
                    {item.company}
                  </li> */}
                                    {/* compnay info */}
                                    <li>
                                        <span className="icon flaticon-map-locator"></span>
                                        {item.facility_name}
                                    </li>
                                    {/* location info */}
                                </ul>
                                {/* End .job-info */}
                            </div>
                            {/* End content */}

                            {/* <ul className="job-other-info">
                {item.jobType.map((val, i) => (
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
                ))}
            </Slider>
        </>
    );
};

export default JobFeatured12;
