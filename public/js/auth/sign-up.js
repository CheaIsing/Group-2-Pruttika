const signUpForm = document.getElementById("sign-up-form");
// console.log(signUpForm);


let isSubmit = false;

const formData = {
  eng_name: "",
  email: "",
  password: "",
  confirmPassword: ""
};

const fields = [
  {
    name: "name",
    id: "input-field-name",
    textErrorElement: "#invalid_feedback_name div",
    isInvalidClass: "is_invalid",
  },
  {
    name: "email",
    id: "input-field-email",
    textErrorElement: "#invalid_feedback_email div",
    isInvalidClass: "is_invalid",
  },
  {
    name: "password",
    id: "input-field-password",
    textErrorElement: "#invalid_feedback_password div",
    isInvalidClass: "is_invalid",
  },
  {
    name: "must match",
    id: "input-field-confirm-password",
    textErrorElement: "#invalid_feedback_confirm_password div",
    isInvalidClass: "is_invalid",
  },
];

signUpForm.addEventListener(
  "submit",
  async (e) => {
    // alert("submitted");
    isSubmit = true;
    e.preventDefault();
    let isValid = false;

    const name = document.getElementById("sign-up-name").value;
    const email = document.getElementById("sign-up-email").value;
    const password = document.getElementById("sign-up-password").value;
    const confirmPassword = document.getElementById("sign-up-confirm-password").value;

    formData.eng_name = name;
    formData.email = email;
    formData.password = password;
    formData.confirmPassword = confirmPassword;

    const { error } = vSignUp.validate(formData);

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      handleErrorMessages(errorMessages, fields);
      return;
    }

    handleErrorMessages([], fields);

    isValid = true;

    if (!isValid) return;

    try {
      btnShowLoading("btnSignUp")
      const res = await axiosInstance.post("/auth/signup", formData);

      showToast(true, "Sign Up Successfully.");
    } catch (error) {
      console.log(error.response.data);
      if (typeof error.response.data == "string") {
        return showToast(); 
      }

      const messages = error.response.data.message;

      const errorMessages = Array.isArray(messages) ? messages : [messages];

      handleErrorMessages(errorMessages, fields);
    }
    finally{
      btnCloseLoading("btnSignUp", "Sign Up");
    }
  }
  //
);

handleFieldChange("sign-up-name", "eng_name", formData, vSignUp, fields);
handleFieldChange("sign-up-email", "email", formData, vSignUp, fields);
handleFieldChange("sign-up-password", "password", formData, vSignUp, fields);
handleFieldChange("sign-up-confirm-password", "confirmPassword", formData, vSignUp, fields);
