import { useRef, useEffect } from "react";
import styles from "../../../../../styles/WidgetContentBox.module.css";


function ViewModal({ data }) {
	// console.log('data', data);
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
					border: "1px solid #ddd",
					borderRadius: "20px",
					width: "500px",
					minHeight: "400px",
					height: "400px",
					maxHeight: "500px",
					padding: "20px",
					paddingBottom: "0",
					overflowY: "scroll",
					color: "#000",
				}}
			>
				<div
					id="chatBoxContainer"
					style={{
						minHeight: "300px",
					}}
				>
					{data[0]?.length ? data.map((el) => el) : "No messages or emails..."}
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
