import { useRef, useEffect } from "react";
import styles from "../../../../../styles/WidgetContentBox.module.css";


function ViewModal({ data }) {
	const chatContainerRef = useRef(null);
	const focusScrollRef = useRef(null);
  
  useEffect(() => {
    focusScrollRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [data]);

	return (
		<div className="col-md-6">
			<div
				className={styles.smsMessageBox + " container"}
				ref={chatContainerRef}
				style={{
					position: "relative",
					background: "#EEEEEE",
					borderRadius: "20px",
					width: "500px",
					minHeight: "400px",
					height: "400px",
					padding: "20px",
					paddingBottom: "0",
					overflowY: "scroll",
				}}
			>
				<div
					id="chatBoxContainer"
					style={{
						minHeight: "300px",
					}}
				>
					{data.map((el) => el)}
				</div>

				<div
					ref={focusScrollRef}
					style={{
						marginBottom: "40px",
					}}
				></div>

				<div
					style={{
						position: "sticky",
						bottom: "0",
						width: "100%",
						left: "0",
						padding: "10px 0",
					}}
				></div>
			</div>
		</div>
	);
}

export default ViewModal;
