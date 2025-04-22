const userEmail = sessionStorage.getItem("email");
const userOtp = sessionStorage.getItem("otp");
const isVerifiedOtp = sessionStorage.getItem("isVerifiedOtp");
let isSubmit = false;
let btnText = document.getElementById("btnResetPass").innerText;

if (userEmail && userOtp) {
  if (isVerifiedOtp == "true") {
    showToast(true, getText("msgReset"));
    sessionStorage.removeItem("isVerifiedOtp");
  }

  const resetPasswordForm = document.getElementById("reset-password-form");

  const formData = {
    email: userEmail,
    otp: userOtp,
    newPassword: "",
    confirmNewPassword: "",
  };

  const fields = [
    {
      name: "password",
      id: "input-field-new-password",
      textErrorElement: "#invalid_feedback_new_password div",
      isInvalidClass: "is_invalid",
    },
    {
      name: "must match",
      id: "input-field-confirm-new-password",
      textErrorElement: "#invalid_feedback_confirm_new_password div",
      isInvalidClass: "is_invalid",
    },
  ];
  const fieldsKh = [
    {
      name: isEnglish ? "password" : "ពាក្យសម្ងាត់",
      id: "input-field-new-password",
      textErrorElement: "#invalid_feedback_new_password div",
      isInvalidClass: "is_invalid",
    },
    {
      name: isEnglish ? "must match" : "ត្រូវតែត្រួតពិនិត្យគ្ន",
      id: "input-field-confirm-new-password",
      textErrorElement: "#invalid_feedback_confirm_new_password div",
      isInvalidClass: "is_invalid",
    },
  ];

  resetPasswordForm.addEventListener(
    "submit",
    async (e) => {
      // alert("submitted");
      isSubmit = true;
      e.preventDefault();
      let isValid = false;

      const newPassword = document.getElementById("newPassword").value;
      const confirmNewPassword =
        document.getElementById("confirmNewPassword").value;

      formData.confirmNewPassword = confirmNewPassword;
      formData.newPassword = newPassword;

      const { error } = vResetPass.validate({
        newPassword: formData.confirmNewPassword,
        confirmNewPassword: formData.newPassword,
      });

      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        handleErrorMessages(errorMessages, fieldsKh);
        return;
      }

      handleErrorMessages([], fieldsKh);

      isValid = true;

      if (!isValid) return;

      try {
        console.log(formData);
        btnShowLoading("btnResetPass");

        await axiosInstance.post("/auth/reset-password", formData);
        sessionStorage.removeItem("otp");
        sessionStorage.removeItem("email");
        sessionStorage.setItem("isResetedPass", true);
        location.href = "/auth/signin";
      } catch (error) {
        console.log(error);

        if (
          !(
            error.response &&
            error.response.data &&
            typeof error.response.data == "object"
          )
        ) {
          return showToast();
        }

        const messages = error.response.data.message;

        const errorMessages = Array.isArray(messages) ? messages : [messages];

        handleErrorMessages(errorMessages, fields);
      } finally {
        btnCloseLoading("btnResetPass", btnText);
      }
    }

    //
  );

  const frmData = {
    newPassword: formData.confirmNewPassword,
    confirmNewPassword: formData.newPassword,
  };

  handleFieldChange(
    "newPassword",
    "newPassword",
    frmData,
    vResetPass,
    fieldsKh
  );
  handleFieldChange(
    "confirmNewPassword",
    "confirmNewPassword",
    frmData,
    vResetPass,
    fieldsKh
  );
  //   handleFieldChange("sign-up-password", "password", formData, vSignUp, fields);
  // handleFieldChange("sign-up-confirm-password", "confirmPassword", formData, vSignUp, fields);
} else {
  location.href = "/auth/forgot-password";
}
