// const port = 3000;
// const url = `http://localhost:${port}/api`;

// const axiosInstance = axios.create({
//   baseURL: url,
//   timeout: 10000,
//   withCredentials: true,
// });

document.addEventListener("DOMContentLoaded", function () {
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

async function handleChangeInfo(e) {
  e.preventDefault();

  const profileData = {
    eng_name: document.getElementById("eng_name").value,
    kh_name: document.getElementById("kh_name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    dob: document.getElementById("dob").value,
    address: document.getElementById("address").value,
    gender: document.querySelector('input[name="gender"]:checked').value,
  };

  try {
    const response = await axiosInstance.put(
      "/admin/setting/info",
      profileData
    );
    Swal.fire("Success", response.data.message, "success");
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

  const passwordData = {
    oldPass: document.getElementById("oldPass").value,
    newPass: document.getElementById("newPass").value,
    passConfirm: document.getElementById("newPassConfirm").value,
  };

  try {
    const response = await axiosInstance.put(
      "/admin/setting/pass",
      passwordData
    );
    Swal.fire("Success", response.data.message, "success");
  } catch (error) {
    Swal.fire(
      "Error",
      error.response?.data?.message || "Failed to update profile",
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
    Swal.fire("Success", response.data.message, "success");
  } catch (error) {
    Swal.fire(
      "Error",
      error.response?.data?.message || "Failed to change avatar",
      "error"
    );
  }
}
