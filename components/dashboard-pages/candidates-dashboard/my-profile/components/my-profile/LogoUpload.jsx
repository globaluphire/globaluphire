/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../../../../../../config/supabaseClient";
import { useSelector } from "react-redux";
import Router from "next/router";

const LogoUpload = () => {
    const user = useSelector((state) => state.candidate.user);
    const [cloudPath, setCloudPath] = useState(
        "https://gytbjlatclocthcyugmq.supabase.co/storage/v1/object/public/applications/dp/"
    );
    const [customer, setCustomer] = useState(null);
    const [logoFilename, setLogoFilename] = useState(null);
    const [logoFile, setLogoFile] = useState(null);

    const [logImg, setLogoImg] = useState("");

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
                    setCustomer(customer[0]);
                    if (customer[0].dp !== "" && customer[0].dp != null) {
                        setLogoFilename(
                            cloudPath + encodeURIComponent(customer[0].dp)
                        );
                        if (customer[0].dp.length > 5) {
                            setLogoFile(customer[0].dp);
                        }
                    }
                }
            }
        } catch (e) {
            toast.error(
                "System is unavailable to fetch profile photo.  Please try again later or contact tech support!",
                {
                    position: "bottom-right",
                    autoClose: false,
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

    const handleFileLogoChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            let file;
            const fileTimestamp = Date.now();

            // upload document to applications/dp folder
            const { data: fileUploadSuccess, error: fileUploadError } =
                await supabase.storage
                    .from("applications")
                    .upload(
                        "dp/" + fileTimestamp + "-" + selectedFile.name,
                        selectedFile,
                        file
                    );
            if (fileUploadError) {
                if (fileUploadError.error === "Payload too large") {
                    toast.error(
                        "Failed to upload attachment.  Attachment size exceeded maximum allowed size!",
                        {
                            position: "bottom-right",
                            autoClose: false,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                        }
                    );
                } else {
                    toast.error(
                        "System is unavailable.  Please try again later or contact tech support!",
                        {
                            position: "bottom-right",
                            autoClose: false,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                        }
                    );
                }
            } else {
                // get document downloadable url
                const { data: docURL, error: docURLError } = supabase.storage
                    .from("applications")
                    .getPublicUrl(
                        "dp/" + fileTimestamp + "-" + selectedFile.name
                    );
                if (docURLError) {
                    console.warn("Failed to get download URL for file");
                }

                // save applied application
                const { dataUpdate, error } = await supabase
                    .from("users_dtl")
                    .update({
                        dp: fileTimestamp + "-" + selectedFile.name,
                        change_dttm: new Date(),
                    })
                    .eq("user_id", user.id);

                setLogoFilename(
                    cloudPath + fileTimestamp + "-" + selectedFile.name
                );
                setTimeout(() => {
                    Router.push("/candidates-dashboard/my-profile");
                }, 1000);
            }
        } else {
            toast.error("Please upload your DP before Apply.", {
                position: "bottom-right",
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

    const logImgHander = (e) => {
        setLogoImg(e.target.files[0]);
    };

    const handleDeleteLogo = async () => {
        if (confirm("Are you sure you wish to delete photo?")) {
            await supabase
                .from("users_dtl")
                .update({
                    dp: "",
                    change_dttm: new Date(),
                })
                .eq("user_id", user.id);

            toast.success("Photo deleted successfully.", {
                position: "bottom-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    };

    return (
        <>
            <div className="uploading-outer">
                <div
                    className="uploadButton"
                    style={{
                        backgroundRepeat: "no-repeat",
                        backgroundImage: "url(" + logoFilename + ")",
                        backgroundSize: "50% auto",
                        backgroundPosition: "center",
                    }}
                >
                    <input
                        className="uploadButton-input"
                        type="file"
                        name="attachments[]"
                        accept="image/*"
                        id="upload"
                        required
                        onChange={handleFileLogoChange}
                    />
                    <label
                        className="uploadButton-button ripple-effect"
                        htmlFor="upload"
                    >
                        {"Browse Photo"}
                    </label>
                    <span className="uploadButton-file-name"></span>
                </div>
                <div className="text">
                    Max file size is 1MB, Minimum dimension: 330x300 And
                    Suitable files are .jpg & .png
                    {logoFile && logoFile !== "" && (
                        <div
                            onClick={() => handleDeleteLogo()}
                            style={{ color: "#FF0000", cursor: "pointer" }}
                        >
                            Delete
                        </div>
                    )}
                    {/* {
                        logoFilename && logoFilename != "" && <img src={logoFilename} style={{ width: 100 }} />
                    } */}
                </div>
            </div>
        </>
    );
};

export default LogoUpload;
