// const port = 3000;
// const url = `http://localhost:${port}/api`;

// const axiosInstance = axios.create({
//   baseURL: url,
//   timeout: 10000,
//   withCredentials: true,
// });
let currentPage = 1;

async function fetchUsers(
  role = "",
  search = "",
  page = 1,
  perPage = 4,
  sortCol = "created_at",
  sortDir = "asc"
) {
  try {
    page = parseInt(page) || 1;
    perPage = parseInt(perPage) || 4;

    const roles = document.getElementById("role").value;
    

    const response = await axiosInstance.get("/admin/user/display", {
      params: {
        page,
        per_page: perPage,
        sort_col: sortCol,
        sort_dir: sortDir,
        role : (role ? role : roles),
        search,
      },
    });

    const result = response.data.data.users;
    const totalPages = response.data.data.pagination.total_pages;
    currentPage = response.data.data.pagination.current_page;

    // if (!result || result.length === 0) {
    //   throw new Error("No users found or failed to fetch users.");
    // }



    displayUsers(result);
    updatePagination(page, totalPages, perPage, fetchUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

function updatePagination(currentPage, totalPages, perPage, fetchFunction) {
  const paginationContainer = document.querySelector(".pagination");
  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";

  function createPageButton(page, label, isDisabled) {
    const pageItem = document.createElement("li");
    pageItem.classList.add("page-item");
    if (isDisabled) pageItem.classList.add("disabled");

    const pageLink = document.createElement("a");
    pageLink.classList.add("page-link");
    pageLink.href = "";
    pageLink.innerHTML = label;

    pageLink.addEventListener("click", (event) => {
      event.preventDefault();
      if (!isDisabled) {
        fetchFunction("", "", page, perPage, "created_at", "asc"); 
      }
    });

    pageItem.appendChild(pageLink);
    return pageItem;
  }

  paginationContainer.appendChild(
    createPageButton(currentPage - 1, `<i class="fa-solid fa-chevron-left"></i>`, currentPage === 1)
  );

  for (let i = 1; i <= totalPages; i++) {
    let pageItem = createPageButton(i, i, currentPage === i);
    if (currentPage === i) pageItem.classList.add("active");
    paginationContainer.appendChild(pageItem);
  }

  paginationContainer.appendChild(
    createPageButton(currentPage + 1, `<i class="fa-solid fa-chevron-right"></i>`, currentPage === totalPages)
  );
}

window.addEventListener("load", function () {
  const urlParams = new URLSearchParams(window.location.search);
  let page = parseInt(urlParams.get("page")) || 1;
  let perPage = parseInt(urlParams.get("per_page")) || 4;

  fetchUsers("", "", page, perPage);
});


function displayUsers(users) {
  const tableBody = document.getElementById("usersTableBody");
  if (!tableBody) return;

  // users = users.filter((user => user.role != 3));

  if(users.length ==0){
    return tableBody.innerHTML = `
    <tr>
    <td colspan="9" class="text-center">No User Found</td>
    </tr>`
  }

  tableBody.innerHTML = users
    .map(
      (user, i) => {
        const serialNumber = (currentPage - 1) * 4 + (i + 1);
        return`
          <tr>
              <td>${serialNumber}</td>
              <td><img class="rounded-circle object-fit-cover" width="35" height="35" src="/uploads/${
                user.avatar? user.avatar : "default.jpg"
              }"></td>
              <td>${user.kh_name ? user.kh_name : "N/A"}</td>
              <td>${user.eng_name ? user.eng_name : "N/A"}</td>
              <td>${user.email}</td>
              <td>${user.phone ? user.phone : "N/A"}</td>
              
              <td>
                <span class="badge ${
                  user.role === 1
                    ? "badge-info"
                    : user.role === 2
                    ? "badge-warning"
                    : user.role === 3
                    ? "badge-primary"
                    : "badge-default"
                }">
                  ${getRoleName(user.role)}
                </span>
              </td>

              <td>
               <div class="d-flex gap-1"><a class="btn btn-primary py-1 px-2 btn-icon " style="height: auto !important;border-radius: 4px;" role="button"
                             onclick="fetchUserDetail(${user.id})" 
                             data-bs-toggle="modal" data-bs-target="#viewDetail">
                             <i class="fa-regular fa-eye"></i>
                          </a>
                          <a  class="btn btn-success py-1 px-2 btn-icon " style="height: auto !important;border-radius: 4px;" role="button"
                             onclick="editUser(${user.id})" 
                             data-bs-toggle="modal" data-bs-target="#editUser">
                             <i class="fa-regular fa-pen-to-square"></i>
                          </a>
                          <a class="btn btn-danger py-1 px-2 btn-icon " style="height: auto !important;border-radius: 4px;" role="button"
                             onclick="removeUser(${user.id})">
                             <i class="fa-regular fa-trash-can"></i>
                          </a>
                </div>
              </td>
          </tr>
              `}
    )
    .join("");
}

async function fetchUserDetail(userId) {
  const detailContainer = document.getElementById("userDetailContent");
  if (!detailContainer) return;

  detailContainer.innerHTML = "Loading...";

  try {
    const response = await axiosInstance.get(
      `/admin/user/userDetail/${userId}`
    );
    const user = response.data.data;

    detailContainer.innerHTML = `
          <div class="card p-3 border-0 shadow-sm">
              <img src="/uploads/${
                user.avatar
              }" class="rounded-circle mx-auto mb-3" width="120" height="120">
              <h4 class="fw-bold">${user.eng_name} </h4>
              <p class="text-muted">${user.email}</p>
              <hr>
              <div class="text-start">
                  <p><strong>Phone : </strong> ${user.phone ? user.phone : "N/A"}</p>
                  <p><strong>Date of Birth : </strong> ${ user.dob ? new Date(
                    user.dob
                  ).toLocaleDateString("en-CA"): "N/A" }</p>
                  <p><strong>Gender:</strong> ${
                    user.gender === 1 ? "Male" : "Female"
                  }</p>
                  <p><strong>Address : </strong> ${user.address ? user.address : "N/A"}</p>
                  <p><strong>Role : </strong> <span class="badge bg-primary">${getRoleName(
                    user.role
                  )}</span></p>
                  
              </div>
          </div>
      `;
  } catch (error) {
    detailContainer.innerHTML = "Failed to load user details.";
    console.error("Error fetching user detail:", error.message);
  }
}

async function editUser(userId) {
  const editContainer = document.getElementById("editContent");
  editContainer.innerHTML = "Loading...";

  try {
    const response = await axiosInstance.get(
      `/admin/user/userDetail/${userId}`
    );
    const user = response.data.data;

    const dobFormatted = new Date(user.dob).toISOString().split("T")[0];

    editContainer.innerHTML = `
      <form id="editUserForm">
        <div class="mb-3 row">
          <div class="col-6">
            <label for="editKhName" class="form-label">Khmer Name</label>
            <input type="text" id="editKhName" class="form-control" value="${
              user.kh_name
            }">
          </div>
          <div class="col-6">
            <label for="editEngName" class="form-label">English Name</label>
            <input type="text" id="editEngName" class="form-control" value="${
              user.eng_name
            }">
          </div>
        </div>
        <div class="mb-3 row">
          <div class="col-6">
            <label for="editEmail" class="form-label">Email</label>
            <input type="email" id="editEmail" class="form-control" value="${
              user.email
            }">
          </div>
          <div class="col-6">
            <label for="editPhone" class="form-label">Phone</label>
            <input type="text" id="editPhone" class="form-control" value="${
              user.phone
            }">
          </div>
        </div>
        <div class="mb-3 row">
          <div class="col-6">
            <label for="editDob" class="form-label">Date of Birth</label>
            <input type="date" id="editDob" class="form-control" value="${dobFormatted}">
          </div>
          <div class="col-6">
            <label for="editGender" class="form-label">Gender</label>
            <select id="editGender" class="form-select">
              <option value="Male" ${
                user.gender === "1" ? "selected" : ""
              }>Male</option>
              <option value="2" ${
                user.gender === "Female" ? "selected" : ""
              }>Female</option>
            </select>
          </div>
        </div>
        <div class="mb-3">
          <label for="editAddress" class="form-label">Address</label>
          <input type="text" id="editAddress" class="form-control" value="${
            user.address
          }">
        </div>
        <div class="text-end">
          <button type="submit" class="btn btn-primary">Update User</button>
        </div>
      </form>
    `;

    document
      .getElementById("editUserForm")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const updatedUser = {
          kh_name: document.getElementById("editKhName").value,
          eng_name: document.getElementById("editEngName").value,
          email: document.getElementById("editEmail").value,
          phone: document.getElementById("editPhone").value,
          dob: document.getElementById("editDob").value,
          gender: document.getElementById("editGender").value,
          address: document.getElementById("editAddress").value,
        };

        try {
          const updateResponse = await axiosInstance.put(
            `/admin/user/editUser/${userId}`,
            updatedUser
          );

          if (updateResponse.data.result) {
            Swal.fire({
              icon: "success",
              title: "User Updated Successfully!",
              text: "The user has been updated.",
            });

            const modalElement = document.getElementById("editUser");
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
              modalInstance.hide();
            }

            fetchUsers();
          } else {
            Swal.fire({
              icon: "error",
              title: "Update Failed",
              text: "Failed to update user.",
              confirmButtonText: "OK",
            });
          }
        } catch (error) {
          console.error("Error updating user:", error.message);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while updating the user.",
            confirmButtonText: "OK",
          });
        }
      });
  } catch (error) {
    editContainer.innerHTML = "Failed to load user details.";
    console.error("Error fetching user details:", error.message);
  }
}

const removeUser = async (userId) => {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const response = await axiosInstance.delete(
        `/admin/user/remove/${userId}`
      );

      if (response.data && response.data.result) {
        Swal.fire({
          icon: "success",
          title: "User Deleted Successfully!",
          text: "The user has been removed.",
        });
        fetchUsers();
      } else {
        console.error(
          "Deletion failed:",
          response.data.message || "Unknown error"
        );
        Swal.fire({
          icon: "error",
          title: "Error Deleting User",
          text:
            response.data.message || "There was an issue deleting the user.",
        });
      }
    }
  } catch (error) {
    console.error("Error deleting user:", error.message);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while trying to delete the user.",
    });
  }
};

function getRoleName(role) {
  return role === 1
    ? "Guest"
    : role === 2
    ? "Organizer"
    : role === 3
    ? "Admin"
    : "Unknown";
}

fetchUsers();

document.getElementById("search")?.addEventListener("keyup", () => {
  fetchUsers(
    document.getElementById("role")?.value,
    document.getElementById("search")?.value
  );
});

document.getElementById("role")?.addEventListener("change", () => {
  fetchUsers(
    document.getElementById("role")?.value,
    document.getElementById("search")?.value
  );
});

document.getElementById("example6_paginate").style.display = "none";
