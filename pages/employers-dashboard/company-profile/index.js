import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
import CompanyProfile from "../../../components/dashboard-pages/employers-dashboard/company-profile";

const index = () => {
  const user = useSelector((state) => state.candidate.user);
  const isEmployer = ["SUPER_ADMIN", "ADMIN", "MEMBER"].includes(user.role);

  useEffect(() => {
    if (!isEmployer) {
      Router.push("/");
    }
  }, []);
  return (
    <>
      {" "}
      {isEmployer ? (
        <>
          {" "}
          <Seo pageTitle="Company Profile" />
          <CompanyProfile />
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
