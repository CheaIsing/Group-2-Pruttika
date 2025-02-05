const isResetedPass = sessionStorage.getItem("isResetedPass");

if (isResetedPass == "true") {
  showToast(
    true,
    "Password reset successful! Please sign in with your new password."
  );
  sessionStorage.removeItem("isResetedPass");
}

const signInForm = document.getElementById("sign-in-form");

let isSubmit = false;

const formData = {
  email: "",
  password: "",
  rememberMe: false
};

const fields = [
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
];

signInForm.addEventListener(
  "submit",
  async (e) => {
    // alert("submitted");
    isSubmit = true;
    e.preventDefault();
    let isValid = false;

    const email = document.getElementById("sign-in-email").value;
    const password = document.getElementById("sign-in-password").value;
    const rememberMe = document.getElementById("rememberMe").checked;


    formData.email = email;
    formData.password = password;
    formData.rememberMe = rememberMe;

    const { error } = vSignIn.validate(formData);

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      handleErrorMessages(errorMessages, fields);
      return;
    }

    handleErrorMessages([], fields);

    isValid = true;

    if (!isValid) return;

    try {
      btnShowLoading("btnSignIn");
      await axiosInstance.post("/auth/signin", formData);

      showToast(true, "Sign In Successfully.");
    } catch (error) {
      console.log(error);

      if (typeof error.response.data == "string") {
        return showToast();
      }

      const messages = error.response.data.message;

      const errorMessages = Array.isArray(messages) ? messages : [messages];

      handleErrorMessages(errorMessages, fields);
    } finally {
      btnCloseLoading("btnSignIn", "Sign In");
    }
  }

  //
);

handleFieldChange("sign-in-email", "email", formData, vSignIn, fields);
handleFieldChange("sign-in-password", "password", formData, vSignIn, fields);

