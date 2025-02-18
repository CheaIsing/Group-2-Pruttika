const port = 3000;
const url = `http://localhost:${port}/api`;

const axiosInstance = axios.create({
  baseURL: url,
  timeout: 10000,
  withCredentials: true,
});

async function fetchRequestOrganizers(
  status = "",
  search = "",
  page = 1,
  perPage = 5,
  sortCol = "organization_name",
  sortDir = "asc"
) {
  try {
    const response = await axiosInstance.get("/admin/organizer/request", {
      params: {
        page,
        per_page: perPage,
        sort_col: sortCol,
        sort_dir: sortDir,
        status,
        search,
      },
    });

    const result = response.data;
    if (!result.result) {
      throw new Error(result.message || "Failed to fetch request organizers");
    }
    displayRequestOrganizer(result.data);
  } catch (error) {
    console.error("Error fetching request organizers : ", error.message);
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
      params: {
        page,
        per_page: perPage,
        sort_col: sortCol,
        sort_dir: sortDir,
        status,
        search,
      },
    });

    const result = response.data;

    if (!result.result) {
      throw new Error(error.message || "Failed to fetch organizers");
    }

    displayOrganizers(result.data);
  } catch (error) {
    console.error("Error fetching organizers : ", error.message);
  }
}

async function fetchOrganizerDetail(id) {
  
}

function displayRequestOrganizer(organizers) {
  const tableBody = document.getElementById("requestOrganizerTableBody");
  tableBody.innerHTML = "";

  organizers.forEach((organizer) => {
    const row = `
      <tr>
          <td>${organizer.id}</td>
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
              <div class="dropdown ms-auto text-center">
                  <div class="btn-link" data-bs-toggle="dropdown">
                      <svg width="24px" height="24px" viewbox="0 0 24 24" version="1.1">
                          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                              <rect x="0" y="0" width="24" height="24"></rect>
                              <circle fill="#000000" cx="5" cy="12" r="2"></circle>
                              <circle fill="#000000" cx="12" cy="12" r="2"></circle>
                              <circle fill="#000000" cx="19" cy="12" r="2"></circle>
                          </g>
                      </svg>
                  </div>
                  ${
                    organizer.status === 1
                      ? `
                        <div class="dropdown-menu dropdown-menu-end">
                            <a class="dropdown-item" href="javascript:void(0)" role="button" onclick="adminApproval(${organizer.id})">Approve</a>
                            <a class="dropdown-item" href="javascript:void(0)" role="button" onclick="adminRejection(${organizer.id})">Reject</a>
                        </div>
                      `
                      : ""
                  }
              </div>
          </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}


function displayOrganizers(organizers) {
  const tableBody = document.getElementById("organizerTableBody");
  tableBody.innerHTML = "";

  organizers.forEach((organizer) => {
    const row = `
            <tr>
                <td>${organizer.id}</td>
                <td>${organizer.organization_name}</td>
                <td>${organizer.business_email}</td>
                <td>${organizer.business_phone}</td>
                <td>${organizer.location}</td>
                <td>
                    <span class="badge ${
                      organizer.status === 1 ? "badge-success" : "badge-danger"
                    }">
                        ${organizer.status === 1 ? "Active" : "Inactive"}
                    </span>
                </td>         
                <td>
                    <div class="dropdown ms-auto text-center">
                        <div class="btn-link" data-bs-toggle="dropdown">
                            <svg width="24px" height="24px" viewbox="0 0 24 24" version="1.1">
                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                    <rect x="0" y="0" width="24" height="24"></rect>
                                    <circle fill="#000000" cx="5" cy="12" r="2"></circle>
                                    <circle fill="#000000" cx="12" cy="12" r="2"></circle>
                                    <circle fill="#000000" cx="19" cy="12" r="2"></circle>
                                </g>
                            </svg>
                        </div>
                        <div class="dropdown-menu dropdown-menu-end">
                            <a class="dropdown-item" href="#">View Details</a>
                            <a class="dropdown-item" href="#">Edit Organizer</a>
                            <a class="dropdown-item" href="#">Remove Organizer</a>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    tableBody.innerHTML += row;
  });
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
          title: "User Approved Successfully!",
          text: "The user has been apporved",
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
      input: "text",
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
          title: "User Rejected Successfully!",
          text: "The user has been rejected.",
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
    console.error("Error rejecting organizer:", error.message);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while trying to reject the organizer.",
    });
  }
}


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
  const status = document.getElementById("status2").value;
  const search = this.value;
  fetchOrganizers(status, search);
});

document.getElementById("status2").addEventListener("change", function () {
  const status = this.value;
  const search = document.getElementById("search2").value;
  fetchOrganizers(status, search);
});

document.getElementById("example6_paginate").style.display = "none";

document.getElementById("example5_paginate").style.display = "none";
document.getElementById("example5_info").style.display = "none";

fetchRequestOrganizers();
fetchOrganizers();
