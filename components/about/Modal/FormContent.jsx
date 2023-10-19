import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FormQuestions } from "./FormQuestions";

function FormContent() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [questions, setQuestions] = useState([]);
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");

    const validateForm = () => {
        let isValid = true;
        if (!firstName) {
            setNameError("Please enter your name");
            isValid = false;
        }
        if (!lastName) {
            setNameError("Please enter your name");
            isValid = false;
        }
        if (!phone) {
            setPhoneError("Please enter your phone number");
            isValid = false;
        } else if (!/^\+1\d{10}$/.test(phone)) {
            setPhoneError(
                "Please enter a valid USA phone number (e.g., +11234567890)"
            );
            isValid = false;
        }
        if (!email) {
            setEmailError("Please enter your email address");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Please enter a valid email address");
            isValid = false;
        }
        return isValid;
    };

    const sendMail = async () => {
        try {
            const questionsAndAnswers = questions
                .map(
                    (item, idx) =>
                        `<p><strong>Question ${idx + 1}:</strong> ${
                            item.question
                        }</p>
         <p><strong>Answer ${idx + 1}:</strong> ${item.answer}</p>`
                )
                .join("\n");
            const content = `
      <h2>Applicant form details:</h2>
      <h4>Name: ${firstName} ${lastName}</h4>
      <h4>Email: ${email}</h4>
      <h4>Phone Number: ${phone}</h4>
      <h4>Questions & Answers:</h4>
      ${questionsAndAnswers}`;
            const response = await fetch("/api/mailer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipient: "support@globaluphire.com",
                    subject: "New Enrollment for Nursing Course.",
                    content,
                }),
            });
            if (response.ok) {
                document.getElementById("modal-close-button").click();
                toast.success("Erollment Mail Sent!", {
                    position: "bottom-right",
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            } else {
                toast.error("Failed to send Mail!", {
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
        } catch (error) {
            toast.error("Some Error Occured!", {
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

    const handleSubmit = async (e) => {
        // e.preventDefault();
        if (validateForm()) {
            try {
                sendMail();
                // TODO: close register popup
            } catch (err) {
                // open toast
                toast.error(
                    "System is unavailable. Please try again later or contact tech support!",
                    {
                        position: "bottom-right",
                        autoClose: 8000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    }
                );
            }
        }
    };

    const handleAnswerChange = (index, answer) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].answer = answer;
        setQuestions(updatedQuestions);
    };

    useEffect(() => {
        setQuestions(FormQuestions);
    }, []);

    return (
        <div className="default-form mt-4">
            <h3>Please fill the form!</h3>
            <div className="row mt-3">
                <div className="form-group col-6 required">
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="Global-UpHire-FirstName"
                        placeholder="Enter First name"
                        value={firstName}
                        onChange={(e) => {
                            setFirstName(e.target.value);
                            setNameError("");
                        }}
                        required
                    />
                    {nameError && <div className="error">{nameError}</div>}
                </div>
                <div className="form-group col-6 required">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="Global-UpHire-LastName"
                        placeholder="Enter Last name"
                        value={lastName}
                        onChange={(e) => {
                            setLastName(e.target.value);
                            setNameError("");
                        }}
                        required
                    />
                    {nameError && <div className="error">{nameError}</div>}
                </div>
                <div className="form-group col-6 required">
                    <label>Email Address:</label>
                    <input
                        type="email"
                        name="Global-UpHire-email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError("");
                        }}
                        placeholder="Your Email"
                        required
                    />
                    {emailError && <div className="error">{emailError}</div>}
                </div>
                <div className="form-group col-6 required">
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        name="Global-UpHire-phone"
                        value={phone === "" || phone === "+" ? "+1" : phone}
                        onChange={(e) => {
                            const numericValue = e.target.value.replace(
                                /[^0-9+]*/g,
                                ""
                            );
                            const truncatedValue = numericValue.slice(0, 12);
                            setPhone(truncatedValue);
                            setEmailError("");
                        }}
                        placeholder="Your Phone number"
                        required
                    />

                    {phoneError && <div className="error">{phoneError}</div>}
                </div>
                {questions.map((item, idx) => (
                    <div key={idx} className="form-group col-12">
                        <label>
                            {idx + 1}
                            {"."} {item.question}
                        </label>
                        <input
                            type="text"
                            name={`question-${idx}`}
                            value={item.answer}
                            onChange={(e) =>
                                handleAnswerChange(idx, e.target.value)
                            }
                            placeholder={"Your Answer"}
                            required
                        />
                    </div>
                ))}
            </div>
            {/* name */}

            <div className="form-group mt-4">
                <button
                    className="theme-btn btn-style-one"
                    type="submit"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

export default FormContent;
