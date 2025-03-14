window.onload = ()=>{
  const userEmail = sessionStorage.getItem("email");
  const isForgotPass = sessionStorage.getItem('isForgotPass');

if (userEmail) {
  if(isForgotPass == "true"){
    showToast(true, "Password reset OTP has sent to your email.");
    sessionStorage.removeItem('isForgotPass')
  }

  const verifyOtpForm = document.getElementById("verify-otp-form");

  let isSubmit = false;

  const formData = {
    email: userEmail,
    verifyOtp: "",
  };

  const fields = [
    {
      name: "otp",
      id: "otp-inputs",
      textErrorElement: "#invalid_feedback_otp div",
      isInvalidClass: "is_invalid",
    },
  ];

  // let otpCode = "";

  // Select all OTP input fields
  const otpInputs = document.querySelectorAll(".otp-inputs input");
  // console.log(otpInputs);

  verifyOtpForm.addEventListener(
    "submit",
    async (e) => {
      // alert("submitted");
      isSubmit = true;
      e.preventDefault();
      let isValid = false;

      const otpCode = getOtpValue();

      formData.verifyOtp = otpCode;

      const { error } = vVerifyOtp.validate({ verifyOtp: formData.verifyOtp });

      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        handleErrorMessages(errorMessages, fields);
        return;
      }

      handleErrorMessages([], fields);

      isValid = true;

      if (!isValid) return;

      try {
        btnShowLoading("btnVerify");
        await axiosInstance.post("/auth/verify-otp", formData);
        sessionStorage.setItem("otp", formData.verifyOtp);
        sessionStorage.setItem("email", formData.email);
        sessionStorage.setItem("isVerifiedOtp", true);
        location.href = "/auth/reset-password";
      } catch (error) {
        console.log(error);

        if (!(error.response && error.response.data &&  typeof error.response.data == "object")) {
          return showToast();
        }

        const messages = error.response.data.message;

        const errorMessages = Array.isArray(messages) ? messages : [messages];

        handleErrorMessages(errorMessages, fields);
      }finally{
        btnCloseLoading("btnVerify", "Verify");
      }
    }

    //
  );

  // Add event listener to each input field
  otpInputs.forEach((input, index) => {
    input.addEventListener("keydown", function (event) {
      if (event.key.match(/^[a-zA-Z0-9]$/)) {
        otpInputs[index].value = ""; // Clear the current value for a new entry
        // Move to the next input field after entering a character
        if (index < otpInputs.length - 1) {
          setTimeout(() => otpInputs[index + 1].focus(), 10); // Move to next input after a small delay
        }
      } else if (event.key === "Backspace") {
        // If backspace is pressed, move to the previous input field
        if (index > 0) {
          setTimeout(() => otpInputs[index - 1].focus(), 10); // Move to previous input
        }
      }
    });
  });

  // Function to get the OTP value from all input fields
  function getOtpValue() {
    const otpInputs = document.querySelectorAll(".otp-inputs input");
    let otpCode = "";
    otpInputs.forEach((input) => {
      otpCode += input.value;
    });
    return otpCode;
  }

  
} else {
  location.href = "/forgot-password";
}

}