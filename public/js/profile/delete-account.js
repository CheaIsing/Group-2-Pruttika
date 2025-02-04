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
      handleErrorMessages(errorMessages, fields);
      return;
    }

    handleErrorMessages([], fields);

    isValid = true;

    if (!isValid) return;

    try {
      // console.log(formData);
      btnShowLoading("btnDeleteAccount");

      await axiosInstance.post("/profile/delete-acc", formData);

      showToast(true, "Account Deleted Successfully.");

      // clearInput();
    } catch (error) {
      console.log(error);

      if (typeof error.response.data == "string") {
        return showToast();
      }

      const messages = error.response.data.message;

      const errorMessages = Array.isArray(messages) ? messages : [messages];

      handleErrorMessages(errorMessages, fields);
    } finally {
      btnCloseLoading("btnDeleteAccount", "Delete Account");
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


