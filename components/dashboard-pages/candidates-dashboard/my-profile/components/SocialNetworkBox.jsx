/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux";
import Router from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../../../../../config/supabaseClient";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

const SocialNetworkBox = () => {
    const user = useSelector((state) => state.candidate.user);

    const [facebookUrl, setFacebookUrl] = useState("");
    const [linkedinUrl, setLinkedinUrl] = useState("");

    useEffect(() => {
        fetchCustomer(user.id);
    }, []);

    const fetchCustomer = async (userID) => {
        try {
            if (userID) {
                const { data: customer, error } = await supabase
                    .from("users_dtl")
                    .select("*")
                    .eq("user_id", userID);

                if (customer) {
                    setFacebookUrl(customer[0].facebook_url);
                    setLinkedinUrl(customer[0].linkedin_url);
                }
            }
        } catch (e) {
            toast.error(
                "System is unavailable.  Please try again later or contact tech support!",
                {
                    position: "bottom-right",
                    autoClose: true,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                }
            );
            console.warn(e);
        }
    };

    const submitSocialLinks = async () => {
        try {
            await supabase
                .from("users_dtl")
                .update({
                    facebook_url: facebookUrl,
                    linkedin_url: linkedinUrl,
                    change_dttm: new Date(),
                })
                .eq("user_id", user.id);

            // open toast
            toast.success("Social Network Links Updated successfully", {
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
                Router.push("/candidates-dashboard/my-profile");
            }, 1000);
        } catch (err) {
            // open toast
            toast.error(
                "Error while saving your social media links, Please try again later or contact tech support",
                {
                    position: "bottom-right",
                    autoClose: true,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                }
            );
        }
    };

    return (
        <form className="default-form">
            <div className="row">
                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Facebook</label>
                    <input
                        type="text"
                        value={facebookUrl}
                        onChange={(e) => {
                            setFacebookUrl(e.target.value);
                        }}
                    />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Linkedin</label>
                    <input
                        type="text"
                        value={linkedinUrl}
                        onChange={(e) => {
                            setLinkedinUrl(e.target.value);
                        }}
                    />
                </div>

                {/* <!-- Input --> */}
                <div className="form-group col-lg-12 col-md-12">
                    <button
                        type="submit"
                        className="theme-btn btn-style-one"
                        onClick={(e) => {
                            e.preventDefault();
                            submitSocialLinks();
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SocialNetworkBox;
