// const port = 3000;
// const url = `http://localhost:${port}/api`;

// const axiosInstance = axios.create({
//   baseURL: url,
//   timeout: 10000,
//   withCredentials: true,
// });

// Fetch Events with Pagination
async function fetchEvents(
  category_id = "",
  search = "",
  page = 1,
  perPage = 5,
  sortCol = "eng_name",
  sortDir = "asc"
) {
  try {
    const response = await axiosInstance.get("/admin/event/view", {
      params: {
        page,
        per_page: perPage,
        sort_col: sortCol,
        sort_dir: sortDir,
        category_id,
        search,
      },
    });

    const result = response.data.data.data;
    const totalPages = response.data.data.pagination.total_pages;

    if (!result || result.length === 0) throw new Error("No events found.");

    displayEvents(result);
    updatePagination(
      page,
      totalPages,
      perPage,
      "paginationEvents",
      fetchEvents
    );
  } catch (error) {
    console.error("Error fetching Events:", error.message);
  }
}

async function fetchCategories(
  search = "",
  page = 1,
  perPage = 5,
  sortCol = "name", // Default to 'name'
  sortDir = "asc"
) {
  try {
    // Ensure valid parameters for the request
    page = parseInt(page) || 1;
    perPage = parseInt(perPage) || 5;

    console.log("Fetch Categories Params:", {
      page,
      per_page: perPage,
      sort_col: sortCol, 
      sort_dir: sortDir,
      search,
    });

    const response = await axiosInstance.get("/admin/event/category/view", {
      params: {
        page,
        per_page: perPage,
        sort_col: sortCol,
        sort_dir: sortDir,
        search,
      },
    });

    const result = response.data.data.data;
    const totalPages = response.data.data.pagination.total_pages;

    if (!result || result.length === 0) {
      throw new Error("No categories found.");
    }

    displayCategories(result);
    updatePagination(
      page,
      totalPages,
      perPage,
      "paginationCategories",
      fetchCategories
    );
  } catch (error) {
    console.error("Error fetching Categories:", error.message);
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
    pageLink.textContent = label;

    pageLink.addEventListener("click", (event) => {
      event.preventDefault();
      if (!isDisabled) {
        fetchFunction("", "", page, perPage);
      }
    });

    pageItem.appendChild(pageLink);
    return pageItem;
  }

  paginationContainer.appendChild(
    createPageButton(currentPage - 1, "Previous", currentPage === 1)
  );

  for (let i = 1; i <= totalPages; i++) {
    let pageItem = createPageButton(i, i, currentPage === i);
    if (currentPage === i) pageItem.classList.add("active");
    paginationContainer.appendChild(pageItem);
  }

  paginationContainer.appendChild(
    createPageButton(currentPage + 1, "Next", currentPage === totalPages)
  );
}


window.addEventListener("load", function () {
  const urlParams = new URLSearchParams(window.location.search);

  let pageEvent = parseInt(urlParams.get("pageEvents")) || 1;
  let perPageEvent = parseInt(urlParams.get("per_pageEvents")) || 5;
  let pageCategories = parseInt(urlParams.get("pageCategories")) || 1;
  let perPageCategories = parseInt(urlParams.get("per_pageCategories")) || 5;

  fetchEvents("", "", pageEvent, perPageEvent);
  fetchCategories("", "", pageCategories, perPageCategories);
});


async function fetchEventDetails(id) {
  const detailContainer = document.getElementById("detailContent");
  if (!detailContainer) return;

  detailContainer.innerHTML = "Loading...";

  try {
    const response = await axiosInstance.get(`/admin/event/detail/${id}`);

    const event = response.data.data.data;

    detailContainer.innerHTML = `
          <div class="card p-3 border-0 shadow-sm">
              <img src="/uploads/${
                event.thumbnail
              }" class="img-fluid mx-auto mb-3" style="width: 100%; height: 200px; object-fit: contain;" >
              <h4 class="fw-bold">${event.eng_name} (${event.kh_name})</h4>
              <hr>
              <div class="row text-start">
                <div class="col-6">
                    <p><strong>Short description : </strong>${
                      event.short_description
                    }</p>
                </div>
                <div class="col-6">
                    <p><strong>Description : </strong>${event.description}</p>
                </div>
              </div>
              <div class="row text-start">
                <div class="col-6">
                    <p><strong>Started Date : </strong> ${new Date(
                      event.started_date
                    ).toLocaleDateString("en-CA")}</p>    
                </div>
                <div class="col-6">
                    <p><strong>Ended Date : </strong> ${new Date(
                      event.ended_date
                    ).toLocaleDateString("en-CA")}</p>
                </div>
              </div>
              <div class="row text-start">
                    <div class="col-6">
                        <p><strong>Start Time : </strong>${event.start_time}</p>
                    </div>
                    <div class="col-6">
                        <p><strong>End Time : </strong>${event.end_time}</p>
                    </div>
              </div>
              <div class="row text-start ">
                    <div class="col-6">
                      <p><strong>Location : </strong> ${event.location}</p>
                    </div>
                    <div class="col-6">
                      <p><strong>Event Type : </strong> 
                      <span class="badge ${
                        event.event_type === 1 ? "bg-success" : "bg-danger"
                      }">
                          ${event.event_type === 1 ? "Online" : "Offline"}
                      </span>
                  </p>
                    </div>
              </div>
              </div>
          </div>
      `;
  } catch (error) {
    detailContainer.innerHTML = "Failed to load user details.";
    console.error("Error fetching user detail:", error.message);
  }
}

function displayEvents(events) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = events
    .map(
      (event) => `
            <tr>
                <td>${event.id}</td>
                <td>${event.eng_name}</td>
                <td>${event.kh_name}</td>
                <td><img class="img-preview" width="50" height="50" src="/uploads/${
                  event.thumbnail
                }"></td>
                <td>${event.description}</td>
                <td>
                    <span class="badge ${
                      event.event_type === 1 ? "badge-success" : "badge-danger"
                    }">
                        ${event.event_type === 1 ? "Online" : "Offline"}
                    </span>
                </td> 
                <td>
                    <span class="badge badge-pill ${
                      event.is_published === 1 ? "badge-primary" : "badge-info"
                    }">
                        ${event.is_published === 1 ? "Private" : "Public"}
                    </span>
                </td> 
                <td>${event.location}</td>        
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
                            <a href="javascript:void(0)" class="dropdown-item" role="button" onclick="fetchEventDetails(${
                              event.id
                            })"
                             data-bs-toggle="modal" data-bs-target="#viewDetail">
                             View details
                          </a>
                        </div>
                    </div>
                </td>
            </tr>
        `
    )
    .join("");
}

function displayCategories(categories) {
  const tableBody = document.getElementById("categoryTableBody");
  tableBody.innerHTML = categories
    .map(
      (val) => `
            <tr>
                <td>${val.id}</td>
                <td>${val.name}</td>
                <td>
                  <p>${new Date(val.created_at).toLocaleDateString("en-CA")}</p>
                </td>
                <td>
                  ${new Date(val.updated_at).toLocaleDateString("en-CA")}
                </td>
                <td>
                    <div class="dropdown ms-auto">
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
                            <a href="javascript:void(0)" class="dropdown-item" role="button"
                             onclick="editCategory(${val.id})" 
                             data-bs-toggle="modal" data-bs-target="#editCategory">
                             Edit Category
                          </a>
                          <a href="javascript:void(0)" class="dropdown-item" role="button"
                             onclick="removeCategory(${val.id})">
                             Remove Category
                          </a>
                        </div>
                    </div>
                </td>
            </tr>
        `
    )
    .join("");
}

async function createCategory() {
  const createContainer = document.getElementById("createContent");
  createContainer.innerHTML = "Loading...";

  try {
    createContainer.innerHTML = `
        <form id="createCategoryForm">
          <div class="mb-3">
            <label for="createName" class="form-label">Category Name</label>
            <input type="text" id="createName" class="form-control" placeholder="Enter category name" required>
          </div>
          <div class="text-end">
            <button type="submit" class="btn btn-primary">Create Category</button>
          </div>
        </form>
      `;

    // Handle form submission
    document
      .getElementById("createCategoryForm")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const newCategory = {
          name: document.getElementById("createName").value.trim(),
        };

        try {
          const response = await axiosInstance.post(
            "/admin/event/category/create",
            newCategory
          );

          if (response.data.result) {
            Swal.fire({
              icon: "success",
              title: "Category Created!",
              text: "The new category has been successfully added.",
            });

            // Close the modal
            const modalElement = document.getElementById("createCategory");
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
              modalInstance.hide();
            }

            // Refresh category list (function needs to be defined in your project)
            fetchCategories();
          } else {
            Swal.fire({
              icon: "error",
              title: "Creation Failed",
              text: "Failed to create category.",
              confirmButtonText: "OK",
            });
          }
        } catch (error) {
          console.error("Error creating category:", error.message);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while creating the category.",
            confirmButtonText: "OK",
          });
        }
      });
  } catch (error) {
    createContainer.innerHTML = "Failed to load category creation form.";
    console.error("Error displaying form:", error.message);
  }
}

document
  .getElementById("createCategory")
  .addEventListener("shown.bs.modal", () => {
    createCategory();
  });

async function editCategory(categoryId) {
  const editContainer = document.getElementById("editContent");
  editContainer.innerHTML = "Loading...";

  try {
    const response = await axiosInstance.get(
      `/admin/event/category/view/${categoryId}`
    );
    const val = response.data.data;

    editContainer.innerHTML = `
      <form id="editCategoryForm">
        <div class="mb-3 row">
          <div class="col-12">
            <label for="editName" class="form-label">Category Name</label>
            <input type="text" id="editName" class="form-control" value="${val[0].name}">
          </div>
        </div>
        <div class="text-end">
          <button type="submit" class="btn btn-primary">Update Category</button>
        </div>
      </form>
    `;

    document
      .getElementById("editCategoryForm")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const updatedCategory = {
          name: document.getElementById("editName").value,
        };

        try {
          const updateResponse = await axiosInstance.put(
            `/admin/event/category/update/${categoryId}`,
            updatedCategory
          );

          if (updateResponse.data.result) {
            Swal.fire({
              icon: "success",
              title: "organizer Updated Successfully!",
              text: "The organizer has been updated.",
            });

            const modalElement = document.getElementById("editCategory");
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
              modalInstance.hide();
            }

            fetchCategories();
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

const removeCategory = async (categoryId) => {
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
        `/admin/event/category/delete/${categoryId}`
      );

      if (response.data && response.data.result) {
        Swal.fire({
          icon: "success",
          title: "Category Deleted Successfully!",
          text: "The category has been removed.",
        });
        fetchCategories();
      } else {
        console.error(
          "Deletion failed:",
          response.data.message || "Unknown error"
        );
        Swal.fire({
          icon: "error",
          title: "Error Deleting Category",
          text:
            response.data.message ||
            "There was an issue deleting the category.",
        });
      }
    }
  } catch (error) {
    console.error("Error deleting category:", error.message);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "An error occurred while trying to delete the category.",
    });
  }
};

fetchEvents();
fetchCategories();

document.getElementById("example6_paginate").style.display = "none";
document.getElementById("example5_paginate").style.display = "none";
document.getElementById("example5_info").style.display = "none";
