import Map from "../../../Map";
import Select from "react-select";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../../../../../config/supabaseClient";
import dynamic from "next/dynamic";
// import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import { Typeahead } from "react-bootstrap-typeahead";
// import docusign from "docusign-esign";

const UserDocuments = async () => {
  // let dsApiClient = new docusign.ApiClient();
  // dsApiClient.setBasePath(process.env.NEXT_DOCUSIGN_API_URL);
  // const results = await dsApi.requestJWTUserToken(
  //   process.env.NEXT_DOCUSIGN_INTEGRATION_KEY,
  //   process.env.NEXT_DOCUSIGN_USER_ID,
  //   "signature",
  //   process.env.NEXT_DOCUSIGN_RSA_KEY,
  //   5000
  // );
  return (
    <form className="default-form">
      <div className="row">test</div>
    </form>
  );
};

export default UserDocuments;
