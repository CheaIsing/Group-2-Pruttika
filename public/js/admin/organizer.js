// const port = 3000;
// const url = `http://localhost:${port}/api`;

// const axiosInstance = axios.create({
//   baseURL: url,
//   timeout: 10000,
//   withCredentials: true,
// });
let currentPage1 = 1
let currentPage2 = 1
// Fetch Request Organizers
async function fetchRequestOrganizers(
  status = "",
  search = "",
  page = 1,
  perPage = 5,
  sortCol = "organization_name",
  sortDir = "asc"
) {
  try {
    const statuss = document.getElementById("status").value
    const response = await axiosInstance.get("/admin/organizer/request", {
      params: { page, per_page: perPage, sort_col: sortCol, sort_dir: sortDir, status : (status? status : statuss), search },
    });

    const result = response.data.data.data;
    const totalPages = response.data.data.pagination.total_pages;
    currentPage1 = response.data.data.pagination.current_page;
    // console.log(result);

    displayRequestOrganizer(result);
    updatePagination(page, totalPages, perPage, "paginationRequestOrganizer", fetchRequestOrganizers);
  } catch (error) {
    console.error("Error fetching request organizers:", error);
  }
}

async function fetchOrganizers(
  status = "",
  search = "",
  page = 1,
  perPage = 5,
  sortCol = "organization_name",
  sortDir = "asc"
) {
  try {
    const response = await axiosInstance.get("/admin/organizer/all", {
      params: { page, per_page: perPage, sort_col: sortCol, sort_dir: sortDir, status, search },
    });

    const result = response.data.data.data;
    const totalPages = response.data.data.pagination.total_pages;
    currentPage2 = response.data.data.pagination.current_page;

    // if (!result || result.length === 0) throw new Error("No organizers found.");

    displayOrganizers(result);
    updatePagination(page, totalPages, perPage, "paginationOrganizer", fetchOrganizers);
  } catch (error) {
    console.error("Error fetching organizers:", error);
  }
}

function updatePagination(currentPage, totalPages, perPage, id, fetchFunction) {
  const paginationContainer = document.getElementById(id);
  if (!paginationContainer) return;
  paginationContainer.innerHTML = "";

  function createPageButton(page, label, isDisabled) {
    const pageItem = document.createElement("li");
    pageItem.classList.add("page-item");
    if (isDisabled) pageItem.classList.add("disabled");

    const pageLink = document.createElement("a");
    pageLink.classList.add("page-link");
    pageLink.href = "#";
    pageLink.innerHTML = label;

    pageLink.addEventListener("click", (event) => {
      event.preventDefault();
      if (!isDisabled) {
        fetchFunction("", "", page, perPage);
      }
    });

    pageItem.appendChild(pageLink);
    return pageItem;
  }

  paginationContainer.appendChild(createPageButton(currentPage - 1, `<i class="fa-solid fa-chevron-left"></i>`, currentPage === 1));

  for (let i = 1; i <= totalPages; i++) {
    let pageItem = createPageButton(i, i, currentPage === i);
    if (currentPage === i) pageItem.classList.add("active");
    paginationContainer.appendChild(pageItem);
  }

  paginationContainer.appendChild(createPageButton(currentPage + 1, `<i class="fa-solid fa-chevron-right"></i>`, currentPage === totalPages));
}

window.addEventListener("load", function () {
  const urlParams = new URLSearchParams(window.location.search);
  
  let pageRequest = parseInt(urlParams.get("pageRequest")) || 1;
  let perPageRequest = parseInt(urlParams.get("per_pageRequest")) || 5;
  let pageOrganizer = parseInt(urlParams.get("pageOrganizer")) || 1;
  let perPageOrganizer = parseInt(urlParams.get("per_pageOrganizer")) || 5;

  fetchRequestOrganizers("", "", pageRequest, perPageRequest);
  fetchOrganizers("", "", pageOrganizer, perPageOrganizer);
});



async function fetchRequestOrganizerDetail(id) {
  const detailContainer = document.getElementById("requestDetailContent");
  if (!detailContainer) return;

  detailContainer.innerHTML = "Loading...";

  try {
    const response = await axiosInstance.get(
      `/admin/organizer/req-details/${id}`
    );
    const organizer = response.data.data;

    detailContainer.innerHTML = `
          <div class="card p-3 border-0 shadow-sm">
              <h4 class="fw-bold">${organizer.organization_name}</h4>
              <p class="text-muted">${organizer.business_email}</p>
              <p class="text-muted">${organizer.bio}</p>
              <hr>
              <div class="text-start">
                  <p><strong>Phone : </strong> ${organizer.business_phone}</p>
                  <p><strong>Address : </strong> ${organizer.location}</p>
                  <p><strong>Facebook : </strong> <a href="#">${
                    organizer.facebook
                  }<a/></p>
                  <p><strong>Telegram : </strong> <a href="#">
                  ${organizer.telegram}</a></p>
                  <p><strong>Tiktok : </strong> <a href="#">${
                    organizer.tiktok
                  }<a/></p>
                  <p><strong>Linkin : </strong> <a href="#">${
                    organizer.linkin
                  }<a/></p>
                  <p>
                    <strong>Status : </strong>
                    <span class="badge
                      ${
                        organizer.status == 1
                          ? "badge-warning"
                          : organizer.status == 2
                          ? "badge-success"
                          : organizer.status == 3
                          ? "badge-danger"
                          : "badge-secondary"
                      }">
                      ${getStatusName(organizer.status)}
                  </span>
                  </p>
                  ${
                    organizer.status === 3
                      ? `<p><strong>Reject reason : </strong> ${organizer.rejection_reason}<p>`
                      : ""
                  }
              </div>
          </div>
      `;
  } catch (error) {
    detailContainer.innerHTML = "Failed to load organizer details.";
    console.error("Error fetching organizer detail:", error.message);
  }
}

async function fetchOrganizerDetail(id) {
  const detailContainer = document.getElementById("detailContent");
  if (!detailContainer) return;

  detailContainer.innerHTML = "Loading...";

  try {
    const response = await axiosInstance.get(`/admin/organizer/details/${id}`);
    const organizer = response.data.data;

    detailContainer.innerHTML = `
          <div class="card p-3 border-0 shadow-sm">
              <h4 class="fw-bold">${organizer.organization_name}</h4>
              <p class="text-muted">${organizer.business_email}</p>
              <p class="text-muted">${organizer.bio}</p>
              <hr>
              <div class="text-start">
                  <p><strong>Phone : </strong> ${organizer.business_phone}</p>
                  <p><strong>Address : </strong> ${organizer.location}</p>
                  <p><strong>Facebook : </strong> <a href="#">${
                    organizer.facebook
                  }<a/></p>
                  <p><strong>Telegram : </strong> <a href="#">
                  ${organizer.telegram ? organizer.telegram : "N/A"}</a></p>
                  <p><strong>Tiktok : </strong> <a href="#">${
                    organizer.tiktok ? organizer.tiktok : "N/A"
                  }<a/></p>
                  <p><strong>Linkin : </strong> <a href="#">${
                    organizer.linkin ? organizer.linkin : "N/A"
                  }<a/></p>
                  <p><strong>Status : </strong> 
                      <span class="badge ${
                        organizer.status === 1 ? "bg-success" : "bg-danger"
                      }">
                          ${organizer.status === 1 ? "Active" : "Inactive"}
                      </span>
                  </p>
              </div>
          </div>
      `;
  } catch (error) {
    detailContainer.innerHTML = "Failed to load organizer details.";
    console.error("Error fetching organizer detail:", error.message);
  }
}

function displayRequestOrganizer(organizers) {
  const tableBody = document.getElementById("requestOrganizerTableBody");
  // console.log(organizers);

  if(organizers.length ==0){
    return tableBody.innerHTML = `
    <tr>
    <td colspan="7" class="text-center">No Request Organizer Found</td>
    </tr>`
  }
  
  tableBody.innerHTML = organizers
    .map(
      (organizer, i) => `
      <tr>
          <td>${(currentPage1 - 1) * 5 + (i + 1)}</td>
          <td>${organizer.organization_name}</td>
          <td>${organizer.business_email}</td>
          <td>${organizer.business_phone}</td>
          <td>${organizer.location}</td>
          <td>
              <span class="badge
                  ${
                    organizer.status == 1
                      ? "badge-warning"
                      : organizer.status == 2
                      ? "badge-success"
                      : organizer.status == 3
                      ? "badge-danger"
                      : "badge-secondary"
                  }">
                  ${getStatusName(organizer.status)}
              </span>
          </td>                
          <td>
              <div class="d-flex gap-1">
    ${
        organizer.status === 1
        ? `
            <button type="button" class="btn btn-primary  py-1 px-2 btn-icon " style="height: auto !important;border-radius: 4px;" 
                    data-bs-placement="top" title="View details" 
                    onclick="fetchRequestOrganizerDetail(${organizer.id})" 
                    data-bs-toggle="modal" data-bs-target="#viewRequestDetail">
                <i class="fa-regular fa-eye"></i>
            </button>
            <button type="button" class="btn btn-success py-1 px-2 btn-icon " style="height: auto !important;border-radius: 4px;" 
                    data-bs-placement="top" title="Approve" 
                    onclick="adminApproval(${organizer.id})">
                <i class="fa-solid fa-check"></i>
            </button>
            <button type="button" class="btn btn-danger py-1 px-2 btn-icon " style="height: auto !important;border-radius: 4px;"
                    data-bs-placement="top" title="Reject" 
                    onclick="adminRejection(${organizer.id})">
                <i class="fa-solid fa-xmark" style="margin-inline: 2px;"></i>
            </button>
        `
        : `
            <button type="button" class="btn btn-primary py-1 px-2 btn-icon " style="height: auto !important;border-radius: 4px;"
                    data-bs-placement="top" title="View details" 
                    onclick="fetchRequestOrganizerDetail(${organizer.id})" 
                    data-bs-toggle="modal" data-bs-target="#viewRequestDetail">
                <i class="fa-regular fa-eye"></i>
            </button>
        `
    }
</div>
          </td>
      </tr>`
    )
    .join("");


}

function displayOrganizers(organizers) {
  const tableBody = document.getElementById("organizerTableBody");
  if(organizers.length ==0){
    return tableBody.innerHTML = `
    <tr>
    <td colspan="7" class="text-center">No Organizer Found</td>
    </tr>`
  }
  tableBody.innerHTML = organizers
  .map(
      (organizer, i) => `
            <tr>
                <td>${(currentPage2 - 1) * 5 + (i + 1)}</td>
                <td>${organizer.organization_name}</td>
                <td>${organizer.business_email}</td>
                <td>${organizer.business_phone}</td>
                <td>${organizer.location}</td>
                    
                <td>
                 <div class="d-flex gap-1">
                  <a class="btn btn-primary py-1 px-2 btn-icon " style="height: auto !important;border-radius: 4px;" role="button"
                             onclick="fetchOrganizerDetail(${organizer.id})" 
                             data-bs-toggle="modal" data-bs-target="#viewDetail">
                             <i class="fa-regular fa-eye"></i>
                          </a>

                          <a  class="btn btn-success py-1 px-2 btn-icon " style="height: auto !important;border-radius: 4px;" role="button"
                             onclick="editOrganizer(${organizer.id})" 
                             data-bs-toggle="modal" data-bs-target="#editOrganizer">
                             <i class="fa-regular fa-pen-to-square"></i>
                          </a>
                          <a  class="btn btn-danger py-1 px-2 btn-icon " style="height: auto !important;border-radius: 4px;" role="button"
                             onclick="removeOrganizer(${organizer.id})">
                             <i class="fa-regular fa-trash-can"></i>
                          </a>
                          
                </div>
                    
                       
                </td>
            </tr>
        `
    )
    .join("");
}

async function adminApproval(id) {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, approved it!",
    });

    if (result.isConfirmed) {
      const response = await axiosInstance.put(
        `/admin/organizer/approve/${id}`
      );

      if (response.data && response.data.result) {
        Swal.fire({
          icon: "success",
          title: "Organizer Approved Successfully!",
          text: "The organizer has been apporved",
        });
        fetchRequestOrganizers();
      } else {
        console.error(
          "Apporval failed:",
          response.data.message || "Unknown error"
        );
        Swal.fire({
          icon: "error",
          title: "Error Aprroving Organizer",
          text:
            response.data.message ||
            "There was an issue approving the organizer.",
        });
      }
    }
  } catch (error) {
    console.error("Error approving organizer:", error.message);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while trying to approve the organizer.",
    });
  }
}

async function adminRejection(id) {
  try {
    const { value: rejection_reason } = await Swal.fire({
      title: "Enter Rejection Reason",
      input: "textarea",
      inputPlaceholder: "Enter reason for rejection...",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Reject",
      inputValidator: (value) => {
        if (!value) {
          return "Rejection reason is required!";
        }
      },
    });

    if (!rejection_reason) {
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it!",
    });

    if (result.isConfirmed) {
      const response = await axiosInstance.put(
        `/admin/organizer/reject/${id}`,
        {
          rejection_reason,
        }
      );

      if (response.data && response.data.result) {
        Swal.fire({
          icon: "success",
          title: "organizer Rejected Successfully!",
          text: "The organizer has been rejected.",
        });
        fetchRequestOrganizers();
      } else {

        console.error(
          "Rejection failed:",
          response.data.message || "Unknown error"
        );
        Swal.fire({
          icon: "error",
          title: "Error Rejecting Organizer",
          text:
            response.data.message ||
            "There was an issue rejecting the organizer.",
        });
      }
    }
  } catch (error) {
    console.error("Error rejecting organizer:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while trying to reject the organizer.",
    });
  }
}

async function editOrganizer(organizerId) {
  const editContainer = document.getElementById("editContent");
  editContainer.innerHTML = "Loading...";

  try {
    const response = await axiosInstance.get(
      `/admin/organizer/details/${organizerId}`
    );
    const organizer = response.data.data;

    editContainer.innerHTML = `
      <form id="editOrganizerForm">
        <div class="mb-3 row">
          <div class="col-6">
            <label for="editName" class="form-label">Organization Name</label>
            <input type="text" id="editName" class="form-control" value="${organizer.organization_name}">
          </div>
          <div class="col-6">
            <label for="editBio" class="form-label">Bio</label>
            <input type="text" id="editBio" class="form-control" value="${organizer.bio}">
          </div>
        </div>
        <div class="mb-3 row">
          <div class="col-6">
            <label for="editEmail" class="form-label">Email</label>
            <input type="email" id="editEmail" class="form-control" value="${organizer.business_email}">
          </div>
          <div class="col-6">
            <label for="editPhone" class="form-label">Phone</label>
            <input type="text" id="editPhone" class="form-control" value="${organizer.business_phone}">
          </div>
        </div>
        <div class="mb-3 row">
          <div class="col-6">
            <label for="editFb" class="form-label">Facebook</label>
            <input type="text" id="editFb" class="form-control" value="${organizer.facebook}">
          </div>
          <div class="col-6">
            <label for="editTg" class="form-label">Telegram</label>
            <input type="text" id="editTg" class="form-control" value="${organizer.telegram}">
          </div>
        </div>
        <div class="mb-3 row">
          <div class="col-6">
            <label for="editTt" class="form-label">Tiktok</label>
            <input type="text" id="editTt" class="form-control" value="${organizer.tiktok}">
          </div>
          <div class="col-6">
            <label for="editLl" class="form-label">Linkin</label>
            <input type="text" id="editLl" class="form-control" value="${organizer.linkin}">
          </div>
        </div>
        <div class="mb-3">
          <label for="editAddress" class="form-label">Address</label>
          <input type="text" id="editAddress" class="form-control" value="${organizer.address}">
        </div>
        <div class="text-end">
          <button type="submit" class="btn btn-primary">Update Organizer</button>
        </div>
      </form>
    `;

    document
      .getElementById("editOrganizerForm")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const updatedOrganizer = {
          organization_name: document.getElementById("editName").value,
          bio: document.getElementById("editBio").value,
          business_email: document.getElementById("editEmail").value,
          business_phone: document.getElementById("editPhone").value,
          facebook: document.getElementById("editFb").value,
          telegram: document.getElementById("editTg").value,
          tiktok: document.getElementById("editTt").value,
          linkin: document.getElementById("editLl").value,
          address: document.getElementById("editAddress").value,
        };

        try {
          const updateResponse = await axiosInstance.put(
            `/admin/organizer/update/${organizerId}`,
            updatedOrganizer
          );

          if (updateResponse.data.result) {
            Swal.fire({
              icon: "success",
              title: "organizer Updated Successfully!",
              text: "The organizer has been updated.",
            });

            const modalElement = document.getElementById("editOrganizer");
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
              modalInstance.hide();
            }

            fetchOrganizers();
          } else {
            Swal.fire({
              icon: "error",
              title: "Update Failed",
              text: "Failed to update organizer.",
              confirmButtonText: "OK",
            });
          }
        } catch (error) {
          console.error("Error updating organizer:", error.message);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while updating the organizer.",
            confirmButtonText: "OK",
          });
        }
      });
  } catch (error) {
    editContainer.innerHTML = "Failed to load organizer details.";
    console.error("Error fetching organizer details:", error.message);
  }
}

const removeOrganizer = async (organizerId) => {
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
        `/admin/organizer/remove/${organizerId}`
      );

      if (response.data && response.data.result) {
        Swal.fire({
          icon: "success",
          title: "organizer Deleted Successfully!",
          text: "The organizer has been removed.",
        });
        fetchOrganizers();
      } else {
        console.error(
          "Deletion failed:",
          response.data.message || "Unknown error"
        );
        Swal.fire({
          icon: "error",
          title: "Error Deleting organizer",
          text:
            response.data.message ||
            "There was an issue deleting the organizer.",
        });
      }
    }
  } catch (error) {
    console.error("Error deleting organizer:", error.message);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while trying to delete the organizer.",
    });
  }
};

function getStatusName(status) {
  switch (status) {
    case 1:
      return "Pending";
    case 2:
      return "Approved";
    case 3:
      return "Rejected";
    default:
      return "Unknow";
  }
}

document.getElementById("search").addEventListener("keyup", function () {
  const status = document.getElementById("status").value;
  const search = this.value;
  fetchRequestOrganizers(status, search);
});

document.getElementById("status").addEventListener("change", function () {
  const status = this.value;
  const search = document.getElementById("search").value;
  fetchRequestOrganizers(status, search);
});

document.getElementById("search2").addEventListener("keyup", function () {
  // const status = document.getElementById("status2").value;
  const search = this.value;
  fetchOrganizers(status, search);
});

// document.getElementById("status2").addEventListener("change", function () {
//   const status = this.value;
//   const search = document.getElementById("search2").value;
//   fetchOrganizers(status, search);
// });

document.getElementById("example6_paginate").style.display = "none";

document.getElementById("example5_paginate").style.display = "none";
document.getElementById("example5_info").style.display = "none";

fetchRequestOrganizers();
fetchOrganizers();
