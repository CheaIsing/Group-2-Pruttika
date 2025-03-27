let isSubmit = false;

const frm = document.getElementById("frm");

const formData = {
  currentPass: ""
};

const fields = [
  {
    name: "current password",
    id: "input-field-current-password",
    textErrorElement: "#invalid_feedback_current_password div",
    isInvalidClass: "is_invalid",
  },
];

const fieldsKh = [
  {
    name: isEnglish ? "current password" : "ពាក្យសម្ងាត់​បច្ចុប្បន្ន​",
    id: "input-field-current-password",
    textErrorElement: "#invalid_feedback_current_password div",
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

    const currentPassword = document.getElementById("current-password").value;


    formData.currentPass = currentPassword;

    const { error } = vDeleteAcc.validate(formData);

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
      btnShowLoading("btnDeleteAccount");

      await axiosInstance.post("/profile/delete-acc", formData);

      showToast(true, isEnglish ? "Account Deleted Successfully." : "គណនីត្រូវបានលុបដោយជោគជ័យ");

      setTimeout(()=>{
        window.location.href = "/"
      }, 1000)

      // clearInput();
    } catch (error) {
      // console.log(error);

      if (!(error.response && error.response.data &&  typeof error.response.data == "object")) {
        return showToast();
      }


      const messages = error.response.data.message;

      const errorMessages = Array.isArray(messages) ? messages : [messages];

      handleErrorMessages(errorMessages, fields);
    } finally {
      btnCloseLoading("btnDeleteAccount", isEnglish ? "Delete Account" : "លុបគណនី");
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


