import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import FormContent from "./FormContent";

function DetailsModal() {
  const [buttonState, setButtonState] = useState(false);

  useEffect(() => {}, [buttonState]);

  return (
    <div className="modal fade" id="details-modal">
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="apply-modal-content modal-content">
          <button
            type="button"
            id="close-button-2"
            className="closed-modal"
            data-bs-dismiss="modal"
            onClick={()=>{setButtonState(false)}}
          ></button>
          <h2 className="modal-title">Program Information</h2>

          <div className="modal-body" style={{ textAlign: "justify" }}>
            <div>
              This nursing assistant course is a 117-hour course. It meets the
              Oregon State Board of Nursing hours for nursing assistant training
              requirements. The standard (1:8 or 1:10 depending on location)
              ratio course has 68 classroom hours, 49 clinical hours. This
              course includes instruction in basic nursing skills, basic
              restorative services, psychosocial needs, personal care, and
              resident rights.
            </div>
            <h4 className="mt-3">Prerequisites:</h4>
            <ul className="list-style-one mt-3">
              <li>Must be 18 years old by the training graduation date.</li>
              <li>Pass a Criminal Background Check</li>
              <li>
                Must be able to read and understand simple and verbal
                instructions in English{" "}
              </li>
              <li>Must be eligible to work in the US </li>
              <li>
                Must be fully vaccinated against COVID-19 OR provide information
                about a qualified exemption based on religious belief or
                disability. *{" "}
              </li>
              <li>
                Must hold an American Heart Association – BLS (Basic Life
                Support) certification. If you do not currently hold one, please
                review the following options below to obtain it: (Offered during
                class in Eugene and Grants Pass){" "}
              </li>
              <a href="https://cpr.heart.org/en/courses/basic-life-support-course-options">
                Click here to find BLS Certification courses near you
              </a>
            </ul>
            <div>
              $80-$100 BLS Certification in Springfield:{" "}
              <a href="https://www.oregoncprtraining.com/">
                https://www.oregoncprtraining.com/
              </a>
              <br />
              $60 – Andy Hatfield, you can reach him at(541) 784-6820. You are
              welcome to call or text to get it set up! <br /> <br />* Oregon
              State mandates require employees to either be fully vaccinated
              against COVID-19 OR comply by providing information about a
              qualifying exemption based on religious belief or disability to
              work in a health care facility. Upon acceptance into the Nurse
              Assistant training course, you will be required to provide
              evidence of vaccine records and/or submit an exemption request
              along with your attestation for qualifying reason to complete
              clinical rotations in the facility. Volare Health Care follows the
              recommendations of the CDC in regards to COVID-19 employee testing
              and safety procedures.
            </div>
            <h4 className="mt-3">Costs:</h4>

            <div className="mt-3">
              For a limited time, Volare Health Care-Oregon is offering this
              course with FREE tuition to accepted applicants. <br /> This{" "}
              <strong>FREE</strong> class includes:
              <ul className="list-style-one">
                <li>Classroom/Lab instruction </li>
                <li>Clinical instruction </li>
                <li>Textbook </li>
                <li>Name badge </li>
                <li>Clinical instruction </li>
                <li>Clinical instruction </li>
              </ul>
              Students are responsible for purchasing:
              <ul className="list-style-one">
                <li>Scrubs </li>
                <li>Closed toed shoes </li>
                <li>Watch (with a second hand) </li>
                <li>
                  Pen and paper (blue or black ink pen's recommended/preferred){" "}
                </li>
                <li>Flash Cards </li>
              </ul>
            </div>
            <strong>
              Students are responsible for Oregon State Board of Nursing Exam
              Fees:{" "}
            </strong>
            <div>
              Once the course is successfully completed, the student is eligible
              to take the state certification exam. Oregon State Board of
              Nursing charges each candidate a fee of $106.00 for the exam, plus
              $70.50 for the fingerprint processing. The student is responsible
              for the cost of the state exam fee and fingerprinting fee. If
              accepted into our class and hired at one of our locations, you
              will be reimbursed for the cost once you are officially on our
              payroll. We will require a receipt to provide the reimbursement.
            </div>

            {buttonState ? (
              <FormContent />
            ) : (
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  className="theme-btn btn-style-one bg-blue mt-3"
                  onClick={() => {
                    setButtonState(true);
                  }}
                >
                  <span className="btn-title">
                    Enroll today!
                  </span>
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailsModal;
