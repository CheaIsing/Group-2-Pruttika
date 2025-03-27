// const port = 3000;
// const url = `http://localhost:${port}/api`;

// const axiosInstance = axios.create({
//   baseURL: url,
//   timeout: 10000,
//   withCredentials: true,
// });

// Fetch Events with Pagination
let currentPage1 = 1
let currentPage2 = 1
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
    currentPage1 = response.data.data.pagination.current_page;

    displayEvents(result, perPage); // Pass perPage here
    updatePagination(
      page,
      totalPages,
      perPage,
      "paginationEvents",
      (s, p, per, sc, sd) => fetchEvents(category_id, s, p, per, sc, sd), // Pass sort parameters
      sortCol,
      sortDir
    );
  } catch (error) {
    console.error("Error fetching Events:", error);
  }
}
async function fetchCategories(
  search = "",
  page = 1,
  perPage = 5,
  sortCol = "name",
  sortDir = "asc"
) {
  try {
    page = parseInt(page) || 1;
    perPage = parseInt(perPage) || 5;
    sortCol = sortCol || "name";
    sortDir = sortDir || "asc";

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
    currentPage2 = response.data.data.pagination.current_page;
    // console.log(result);
    

    // if (!result || result.length === 0) {
    //   throw new Error("No categories found.");
    // }

    displayCategories(result);
    updatePagination(
      page,
      totalPages,
      perPage,
      "paginationCategories",
      (s, p, per, sc = "name", sd = "asc") => fetchCategories(s, p, per, sc, sd)
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
    pageLink.href = "";
    pageLink.innerHTML = label;

    pageLink.addEventListener("click", (event) => {
      event.preventDefault();
      if (!isDisabled) {
        fetchFunction("", page, perPage, "name", "asc");
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
    createPageButton(currentPage + 1,`<i class="fa-solid fa-chevron-right"></i>`, currentPage === totalPages)
  );
}

window.addEventListener("load", function () {
  const urlParams = new URLSearchParams(window.location.search);

  let pageEvent = parseInt(urlParams.get("pageEvents")) || 1;
  let perPageEvent = parseInt(urlParams.get("per_pageEvents")) || 5;
  let pageCategories = parseInt(urlParams.get("pageCategories")) || 1;
  let perPageCategories = parseInt(urlParams.get("per_pageCategories")) || 5;

  fetchEvents("", "", pageEvent, perPageEvent);
  fetchCategories("", pageCategories, perPageCategories, "name", "asc");
});

async function fetchEventDetails(id) {
  const detailContainer = document.getElementById("detailContent");
  if (!detailContainer) return;

  detailContainer.innerHTML = "Loading...";

  try {
    const response = await axiosInstance.get(`/admin/event/detail/${id}`);

    const event = response.data.data.data;

    detailContainer.innerHTML = `
<div class="card p-0 border-0 shadow-none text-start mb-0">
    <img src="/uploads/${event.thumbnail}" class="img-fluid mb-3" style="width: 100%; height: 200px; object-fit: cover;">
    <h4 class="fw-bold mb-3"><i class="fas fa-calendar-alt me-2 text-primary"></i> ${event.eng_name}</h4>
    <hr class="my-3">
    <div class="row mb-3 ">
        <div class="col-md-12">
            <p class="pb-0 mb-1"> ${event.short_description}</p>
        </div>
        <div class="col-md-12">
            <p> ${event.description}</p>
        </div>
    </div>
    <div class="row mb-3 justify-content-between">
        <div class="col-auto">
            <p><i class="fas fa-calendar-check me-2 text-primary"></i> ${new Date(event.started_date).toLocaleDateString("en-CA")}</p>
        </div>
        <div class="col-auto">
            <p> ${new Date(event.ended_date).toLocaleDateString("en-CA")} <i class="fas fa-calendar-times ms-2 text-primary"></i></p>
        </div>
    </div>
    <div class="row mb-3 justify-content-between">
        <div class="col-auto">
            <p><i class="fas fa-clock me-2 text-primary"></i> ${event.start_time} </p>
        </div>
        <div class="col-auto">
            <p> ${event.end_time} <i class="fas fa-clock ms-2 text-primary"></i></p>
        </div>
    </div>
    <div class="row  justify-content-between">
        <div class="col-auto">
            <p><i class="fas fa-map-marker-alt me-2 text-primary"></i> ${event.location}</p>
        </div>
        <div class="col-auto">
            <p>
                <span class="badge ${event.event_type === 1 ? "bg-success" : "bg-danger"}">
                    ${event.event_type === 1 ? "Online" : "Offline"}
                </span>
                <i class="fas fa-tags ms-2 text-primary"></i> 
            </p>
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
  if(events.length == 0){
    return tableBody.innerHTML = `<tr>
    <td colspan="9" class="text-center">No Event Found</td>
    </tr>`
  }
  tableBody.innerHTML = events
    .map(
      (event, i) => `
            <tr>
                <td>${(currentPage1 - 1) * 5   + (i + 1)}</td>
                <td>${event.eng_name}</td>
                <td><img class="img-preview object-fit-cover" width="70" height="50" src="/uploads/${
                  event.thumbnail
                }"></td>
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
                <td>${event.location ? event.location : "Online"}</td>        
                <td>

                           <a class="btn btn-primary py-1 px-2 btn-icon " style="height: auto !important;border-radius: 4px;" role="button" onclick="fetchEventDetails(${
                              event.id
                            })"
                             data-bs-toggle="modal" data-bs-target="#viewDetail">
                             <i class="fa-regular fa-eye"></i>
                          </a>
                    
                </td>
            </tr>
        `
    )
    .join("");
}

function displayCategories(categories) {
  const tableBody = document.getElementById("categoryTableBody");
  console.log(categories);
  
  if(categories.length == 0){
    return tableBody.innerHTML = `<tr>
      <td colspan="9" class="text-center">No Categories Found</td>
      </tr>`
  }
  tableBody.innerHTML = categories
    .map(
      (val, i) => `
            <tr>
                <td>${(currentPage2 - 1) * 5 + (i + 1)}</td>
                <td>${val.name}</td>
                <td>
                  <p>${new Date(val.created_at).toLocaleDateString("en-CA")}</p>
                </td>
                <td>
                  ${new Date(val.updated_at).toLocaleDateString("en-CA")}
                </td>
                <td>
                   <div class="d-flex gap-1">
                   <a class="btn btn-success py-1 px-2 btn-icon " style="height: auto !important;border-radius: 4px;" role="button"
                             onclick="editCategory(${val.id})" 
                             data-bs-toggle="modal" data-bs-target="#editCategory">
                             <i class="fa-regular fa-pen-to-square"></i>
                          </a>
                          <a class="btn btn-danger py-1 px-2 btn-icon " style="height: auto !important;border-radius: 4px;" role="button"
                             onclick="removeCategory(${val.id})">
                             <i class="fa-regular fa-trash-can"></i>
                          </a>
                          
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

document.getElementById("search").addEventListener("keyup", (e)=>{
  fetchEvents("", e.target.value);
})
document.getElementById("search2").addEventListener("keyup", (e)=>{
  fetchCategories(e.target.value);
})

document.getElementById("example6_paginate").style.display = "none";
document.getElementById("example5_paginate").style.display = "none";
document.getElementById("example5_info").style.display = "none";
