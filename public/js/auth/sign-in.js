const isResetedPass = sessionStorage.getItem("isResetedPass");
let btnText = document.getElementById("btnSignIn").innerText
if (isResetedPass == "true") {
  showToast(
    true,
    getText("msgResetPass")
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

const fieldsKh = [
  {
    name: isEnglish ? "email" : "អ៊ីមែល",
    id: "input-field-email",
    textErrorElement: "#invalid_feedback_email div",
    isInvalidClass: "is_invalid",
  },
  {
    name: isEnglish ? "password" : "ពាក្យសម្ងាត់",
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
      handleErrorMessages(errorMessages, fieldsKh);
      return;
    }

    handleErrorMessages([], fieldsKh);

    isValid = true;

    if (!isValid) return;

    try {
      btnShowLoading("btnSignIn");
      await axiosInstance.post("/auth/signin", formData);

      showToast(true, getText("msgSignIn"));

      setTimeout(()=>{
        window.location.href = "/"
      }, 1200)
    } catch (error) {
      console.log(error);

      if (!(error.response && error.response.data &&  typeof error.response.data == "object")) {
        return showToast();
      }

      const messages = error.response.data.message;

      const errorMessages = Array.isArray(messages) ? messages : [messages];

      handleErrorMessages(errorMessages, fields);
    } finally {
      btnCloseLoading("btnSignIn", btnText);
    }
  }

  //
);

handleFieldChange("sign-in-email", "email", formData, vSignIn, fieldsKh);
handleFieldChange("sign-in-password", "password", formData, vSignIn, fieldsKh);

