/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
import FormContentEducation from "./FormContentEducation";

const EditEducation = (props) => {
    const type = props.type;
    const title = props.title;
    const sub_title = props.subtitle;
    const description = props.description;
    const title_value = props.title_value;
    const subtitle_value = props.subtitle_value;
    const description_value = props.description_value;
    const from_date_value = props.from_date_value;
    const to_date_value = props.to_date_value;
    return (
        <>
            <div
                className="modal fade"
                id={"loginPopupModalEduEdit" + props.id}
            >
                <div className="modal-dialog modal-lg modal-dialog-centered login-modal modal-dialog-scrollable">
                    <div className="modal-content">
                        <button
                            type="button"
                            id="close-button"
                            className="closed-modal"
                            data-bs-dismiss="modal"
                        ></button>

                        <div className="modal-body">
                            <div id="login-modal">
                                <div className="login-form default-form">
                                    <FormContentEducation
                                        type={type}
                                        title={title}
                                        sub_title={sub_title}
                                        description={description}
                                        id={props.id}
                                        title_value={title_value}
                                        subtitle_value={subtitle_value}
                                        description_value={description_value}
                                        from_date_value={from_date_value}
                                        to_date_value={to_date_value}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditEducation;
