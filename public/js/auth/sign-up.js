const signUpForm = document.getElementById("sign-up-form");
// console.log(signUpForm);
let btnText = document.getElementById("btnSignUp").innerText

let isSubmit = false;

const formData = {
  name: "",
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
const fieldsKh = [
  {
    name: isEnglish ? "name" : "ឈ្មោះអ្នកប្រើ",
    id: "input-field-name",
    textErrorElement: "#invalid_feedback_name div",
    isInvalidClass: "is_invalid",
  },
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
  {
    name: isEnglish ? "must match" : "ត្រូវតែត្រួតពិនិត្យគ្ន",
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

    formData.name = name;
    formData.email = email;
    formData.password = password;
    formData.confirmPassword = confirmPassword;

    const { error } = vSignUp.validate(formData);

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      handleErrorMessages(errorMessages, fieldsKh);
      return;
    }

    handleErrorMessages([], fieldsKh);

    isValid = true;

    if (!isValid) return;

    try {
      btnShowLoading("btnSignUp")
      const res = await axiosInstance.post("/auth/signup", formData);

      showToast(true, getText("msgSignUp"));
      setTimeout(()=>{
        window.location.href = "/auth/signin"
      }, 1200)
    } catch (error) {
      console.log(error);
      if (!(error.response && error.response.data &&  typeof error.response.data == "object")) {
        return showToast();
      }

      const messages = error.response.data.message;

      const errorMessages = Array.isArray(messages) ? messages : [messages];

      handleErrorMessages(errorMessages, fields);
    }
    finally{
      btnCloseLoading("btnSignUp", btnText);
    }
  }
  //
);

handleFieldChange("sign-up-name", "name", formData, vSignUp, fieldsKh);
handleFieldChange("sign-up-email", "email", formData, vSignUp, fieldsKh);
handleFieldChange("sign-up-password", "password", formData, vSignUp, fieldsKh);
handleFieldChange("sign-up-confirm-password", "confirmPassword", formData, vSignUp, fieldsKh);
