async function resendOtp(){
  try {
    // document.getElementById("resendBtn").classList.add("disabled");
    btnShowLoading("resendBtn")
    
    await axiosInstance.post("/auth/forgot-password", {email : sessionStorage.getItem("email")});
    showToast(true, isEnglish ? "OTP Resend Successfully. Please check your email.":"OTP ផ្ញើឡើងវិញដោយជោគជ័យ។ សូមពិនិត្យមើលអ៊ីមែលរបស់អ្នក")
  } catch (error) {
    // console.log(error);
    showToast()
  }finally{
    document.getElementById("resendBtn").classList.remove("disabled");
    btnCloseLoading("resendBtn", isEnglish ? "Resend": "ផ្ញើឡើងវិញ");
  }

}
document.getElementById("resendBtn").onclick = ()=>{
  resendOtp()
}
window.onload = ()=>{
  const userEmail = sessionStorage.getItem("email");
  const isForgotPass = sessionStorage.getItem('isForgotPass');
  let btnText = document.getElementById("btnVerify").innerText

if (userEmail) {
  if(isForgotPass == "true"){
    showToast(true, getText("msgOtp"));
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
        // console.log(error);

        if (!(error.response && error.response.data &&  typeof error.response.data == "object")) {
          return showToast();
        }

        const messages = error.response.data.message;

        const errorMessages = Array.isArray(messages) ? messages : [messages];

        handleErrorMessages(errorMessages, fields);
      }finally{
        btnCloseLoading("btnVerify", btnText);
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
  location.href = "/auth/forgot-password";
}

}

