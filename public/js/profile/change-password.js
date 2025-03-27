let isSubmit = false;

const frm = document.getElementById("frm");

const formData = {
  oldPass: "",
  newPass: "",
  newPassConfirm: "",
};

const fields = [
  {
    name: "old password",
    id: "input-field-current-password",
    textErrorElement: "#invalid_feedback_current_password div",
    isInvalidClass: "is_invalid",
  },
  {
    name: "new password",
    id: "input-field-new-password",
    textErrorElement: "#invalid_feedback_new_password div",
    isInvalidClass: "is_invalid",
  },
  {
    name: "not match",
    id: "input-field-confirm-new-password",
    textErrorElement: "#invalid_feedback_confirm_new_password div",
    isInvalidClass: "is_invalid",
  },
];
const fieldsKh = [
  {
    name: isEnglish ? "old password" : "ពាក្យសម្ងាត់ចាស់",
    id: "input-field-current-password",
    textErrorElement: "#invalid_feedback_current_password div",
    isInvalidClass: "is_invalid",
  },
  {
    name: isEnglish ? "new password" : "ពាក្យសម្ងាត់ថ្មី",
    id: "input-field-new-password",
    textErrorElement: "#invalid_feedback_new_password div",
    isInvalidClass: "is_invalid",
  },
  {
    name: isEnglish ? "must match":"ត្រូវតែត្រួតពិនិត្យគ្នា",
    id: "input-field-confirm-new-password",
    textErrorElement: "#invalid_feedback_confirm_new_password div",
    isInvalidClass: "is_invalid",
  },
];

frm.addEventListener(
  "submit",
  async (e) => {
    // alert("submitted");
    isSubmit = true;
    e.preventDefault();
    let isValid = false;

    const oldPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmNewPassword = document.getElementById(
      "confirm-new-password"
    ).value;

    formData.oldPass = oldPassword;
    formData.newPass = newPassword;
    formData.newPassConfirm = confirmNewPassword;

    const { error } = vChangePass.validate(formData);

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      handleErrorMessages(errorMessages, fieldsKh);
      return;
    }

    handleErrorMessages([], fieldsKh);

    isValid = true;

    if (!isValid) return;

    try {
      // console.log(formData);
      btnShowLoading("btnChangePassword");

      await axiosInstance.put("/profile/pass", formData);

      showToast(true, isEnglish ? "Change Password Successfully.": "ផ្លាស់ប្តូរពាក្យសម្ងាត់ដោយជោគជ័យ");

      clearInput();
    } catch (error) {
      // console.log(error);

      if (!(error.response && error.response.data &&  typeof error.response.data == "object")) {
        return showToast();
      }

      const messages = error.response.data.message;

      const errorMessages = Array.isArray(messages) ? messages : [messages];

      handleErrorMessages(errorMessages, fields);
    } finally {
      btnCloseLoading("btnChangePassword", isEnglish ? "Change Password" : "ផ្លាស់ប្តូរពាក្យសម្ងាត់");
    }
  }

  //
);

const frmData = {
  newPassword: formData.confirmNewPassword,
  confirmNewPassword: formData.newPassword,
};

// handleFieldChange("newPassword", "newPassword", frmData, vResetPass, fields);
// handleFieldChange(
//   "confirmNewPassword",
//   "confirmNewPassword",
//   frmData,
//   vResetPass,
//   fields
// );
//   handleFieldChange("sign-up-password", "password", formData, vSignUp, fields);
// handleFieldChange("sign-up-confirm-password", "confirmPassword", formData, vSignUp, fields);

function clearInput() {
  document.getElementById("current-password").value = "";
  document.getElementById("new-password").value = "";
  document.getElementById("confirm-new-password").value = "";
}
