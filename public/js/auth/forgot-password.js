const forgotPassForm = document.getElementById("forgot-password-form");

let isSubmit = false;
let btnText = document.getElementById("btnForgotPass").innerText
const formData = {
  email: ""
};

const fields = [
  {
    name: "email",
    id: "input-field-email",
    textErrorElement: "#invalid_feedback_email div",
    isInvalidClass: "is_invalid",
  }
];
const fieldsKh = [
  {
    name: isEnglish ? "email" : "អ៊ីមែល",
    id: "input-field-email",
    textErrorElement: "#invalid_feedback_email div",
    isInvalidClass: "is_invalid",
  }
];

forgotPassForm.addEventListener(
  "submit",
  async (e) => {
    // alert("submitted");
    isSubmit = true;
    e.preventDefault();
    let isValid = false;

    const email = document.getElementById("email").value;

    formData.email = email;

    const { error } = vForgotPassword.validate(formData);

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      handleErrorMessages(errorMessages, fieldsKh);
      return;
    }

    handleErrorMessages([], fieldsKh);

    isValid = true;

    if (!isValid) return;

    try {
      btnShowLoading("btnForgotPass");
      await axiosInstance.post("/auth/forgot-password", formData);
      sessionStorage.setItem('email', formData.email)
      sessionStorage.setItem('isForgotPass', true)
      location.href = "/auth/verify-otp";

    } catch (error) {
      console.log(error);
      

      if (!(error.response && error.response.data &&  typeof error.response.data == "object")) {
        return showToast();
      }

      const messages = error.response.data.message;

      const errorMessages = Array.isArray(messages) ? messages : [messages];

      handleErrorMessages(errorMessages, fields);
    }finally{
      btnCloseLoading("btnForgotPass", btnText);
    }
  }

  //
);

handleFieldChange("email", "email", formData, vSignIn, fieldsKh);
