// const port = 3000;
// const url = `http://localhost:${port}/api`;


document.addEventListener("DOMContentLoaded", function () {
  loadUserProfile(); // Load profile data on page load

  document
      .getElementById("btnSaveChange")
      .addEventListener("click", handleChangeInfo);

  document
      .getElementById("btnChangePassword")
      .addEventListener("click", handleChangePassword);

  document
      .getElementById("btnChangeAvatar")
      .addEventListener("click", handleChangeAvatar);
});


async function loadUserProfile() {
  try {
      const {data} = await axiosInstance.get("/auth/me");
      // console.log(data.data);
      const me = data.data.id;
      const {data: data2} = await axiosInstance.get("/profile/display/"+ me);
    //   console.log(data2);
      const profileData = data2.data; // Assuming your API returns profile data

      // Populate form fields
      document.getElementById("eng_name").value = profileData.eng_name;
      document.getElementById("kh_name").value = profileData.kh_name;
      document.getElementById("email").value = profileData.email;
      document.getElementById("phone").value = profileData.phone;
      document.getElementById("dob").value = moment(profileData.dob).format("YYYY-MM-DD");
      document.getElementById("address").value = profileData.address;

      // Set gender radio button

  } catch (error) {
      console.error("Failed to load profile:", error);
      Swal.fire("Error", "Failed to load profile data", "error");
  }
}

async function handleChangeInfo(e) {
  e.preventDefault();

  if(!document.getElementById("eng_name").value){
    Swal.fire({
        icon: "error",
        title: "Invalid Username",
        text: "Please enter a valid username.",
        confirmButtonText: "OK",
      });
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(document.getElementById("email").value)) {
    return Swal.fire({
      icon: "error",
      title: "Invalid Email",
      text: "Please enter a valid email address.",
      confirmButtonText: "OK",
    });
  }

  const profileData = {
      eng_name: document.getElementById("eng_name").value,
      kh_name: document.getElementById("kh_name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      dob: document.getElementById("dob").value,
      address: document.getElementById("address").value,
  };

  try {
      const response = await axiosInstance.put("/admin/setting/info", profileData);
      Swal.fire("Success", response.data.message, "success");
      loadUserProfile(); // Reload profile data after update
  } catch (error) {
      Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to update profile",
          "error"
      );
  }
}

async function handleChangePassword(e) {
  e.preventDefault();

  const oldPass = document.getElementById("oldPass").value;
  const newPass = document.getElementById("newPass").value;
  const passConfirm = document.getElementById("newPassConfirm").value;

  // Basic validation
  if (!oldPass || !newPass || !passConfirm) {
      return Swal.fire("Error", "Please fill in all fields", "error");
  }

  if (newPass.length < 6) { // Example: Minimum password length
      return Swal.fire("Error", "New password must be at least 6 characters", "error");
  }

  if (newPass !== passConfirm) {
      return Swal.fire("Error", "New password and confirm password do not match", "error");
  }

  const passwordData = {
      oldPass: oldPass,
      newPass: newPass,
      passConfirm: passConfirm,
  };

  try {
      const response = await axiosInstance.put("/admin/setting/pass", passwordData);
    //   console.log(response);
      
      Swal.fire("Success", response.data.message, "success");
      // Clear input fields on success (optional)
      document.getElementById("oldPass").value = "";
      document.getElementById("newPass").value = "";
      document.getElementById("newPassConfirm").value = "";
  } catch (error) {
      Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to update password",
          "error"
      );
  }
}

async function handleChangeAvatar(e) {
  e.preventDefault();

  const fileInput = document.querySelector("input[type='file']");
  if (!fileInput.files.length) {
      return Swal.fire("Error", "Please select an avatar", "error");
  }

  const formData = new FormData();
  formData.append("avatar", fileInput.files[0]);

  try {
      const response = await axiosInstance.post("/admin/setting/avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire("Success", response.data.message, "success").then(() => {
        // Reload the page after successful avatar update
        window.location.reload();
    });
  } catch (error) {
      Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to change avatar",
          "error"
      );
  }
}