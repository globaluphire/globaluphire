/* eslint-disable no-unused-vars */
import { useSelector } from "react-redux";
import Router from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../../../../../config/supabaseClient";
import { Tooltip } from "react-tooltip";

const ContactInfoBox = () => {
    const user = useSelector((state) => state.candidate.user);
    const [address, setAddress] = useState("");

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
                    setAddress(customer[0].address);
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

    const submitContactInfo = async () => {
        try {
            await supabase
                .from("users_dtl")
                .update({
                    address,
                    change_dttm: new Date(),
                })
                .eq("user_id", user.id);

            // open toast
            toast.success("Contact info updated successfully", {
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
                "Error while saving your contact info, Please try again later or contact tech support",
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
                <div className="form-group col-lg-12 col-md-12">
                    <label>Complete Address</label>
                    <a
                        data-tooltip-id="address-tooltip"
                        data-tooltip-content="Address should be in: 123 Stree Name, City, State ZipCode"
                    >
                        <span
                            className="lar la-question-circle"
                            style={{ fontSize: "14px", margin: "5px" }}
                        ></span>
                    </a>
                    <Tooltip id="address-tooltip" />
                    <input
                        type="text"
                        name="candidate-address"
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
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
                            submitContactInfo();
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ContactInfoBox;
