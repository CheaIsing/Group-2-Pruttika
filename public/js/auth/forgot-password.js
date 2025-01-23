const forgotPassForm = document.getElementById("forgot-password-form");

let isSubmit = false;

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
      handleErrorMessages(errorMessages, fields);
      return;
    }

    handleErrorMessages([], fields);

    isValid = true;

    if (!isValid) return;

    try {
      await axiosInstance.post("/auth/forgot-password", formData);
      sessionStorage.setItem('email', formData.email)
      sessionStorage.setItem('isForgotPass', true)
      location.href = "/verify-otp";

    } catch (error) {
      console.log(error.response.data);

      if (typeof error.response.data == "string") {
        return showToast();
      }

      const messages = error.response.data.message;

      const errorMessages = Array.isArray(messages) ? messages : [messages];

      handleErrorMessages(errorMessages, fields);
    }
  }

  //
);

handleFieldChange("email", "email", formData, vSignIn, fields);
