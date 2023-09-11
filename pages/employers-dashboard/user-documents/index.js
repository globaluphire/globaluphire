import dynamic from "next/dynamic";
import Router from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Seo from "../../../components/common/Seo";
import UserDocument from "../../../components/dashboard-pages/employers-dashboard/user-documents"

const index = () => {

  const user = useSelector(state => state.candidate.user)
  const isEmployer = ['SUPER_ADMIN', 'ADMIN', 'MEMBER'].includes(user.role)

  useEffect(() => {
    if (!isEmployer) {
      Router.push("/")
    }
  }, []);

  return (
    <>
      <Seo pageTitle="User Documents" />
      <UserDocument />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });