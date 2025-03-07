// const port = 3000;
// const url = `http://localhost:${port}/api`;

// const axiosInstance = axios.create({
//   baseURL: url,
//   timeout: 10000,
//   withCredentials: true,
// });

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btnLogout").addEventListener("click", handleLogout);
});

async function handleLogout(e) {
  e.preventDefault();

  try {
    const response = await axiosInstance.delete("/auth/logout");

    Swal.fire("Success", response.data.message, "success").then(() => {
      window.location.href = "/auth/signin";
    });
  } catch (error) {
    Swal.fire(
      "Error",
      error.response?.data?.message || "Failed to logout",
      "error"
    );
  }
}