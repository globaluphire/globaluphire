/* eslint-disable no-unused-vars */
import { supabase } from "../../../../../config/supabaseClient";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

const Notification = () => {
    const [recentNotifications, setRecentNotifications] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector((state) => state.candidate.user);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        const dataNotifications = await supabase
            .from("notification")
            .select("notification_text,created_at,id")
            // .eq('user_id', user.id)
            // .not('status',"eq",'Qualified');
            .is("deleted", null)
            .order("id", { ascending: false })
            .range(0, 3);
        if (dataNotifications) {
            setRecentNotifications(dataNotifications.data);
            // console.log("==",dataNotifications.data);
            setIsLoading(false);
        }
    };

    return (
        <ul className="notification-list">
            {recentNotifications && recentNotifications.length === 0 && (
                <li>
                    <div className="text-center">
                        No Notification Received !
                    </div>
                </li>
            )}
            {isLoading === false &&
                recentNotifications &&
                recentNotifications.map((item, index) => {
                    return (
                        <li key={index}>
                            <span className="icon flaticon-briefcase"></span>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: item.notification_text,
                                }}
                            ></span>
                            <b>
                                {" "}
                                {moment(item.created_at).format("MMMM D, YYYY")}
                            </b>
                        </li>
                    );
                })}
        </ul>
    );
};

export default Notification;
