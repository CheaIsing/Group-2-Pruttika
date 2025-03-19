async function getCategories() {
  try {
    const result = await axiosInstance.get("/admin/event/category/view");

    const categories = result.data.data.data;
    // console.log(categories);

    let categoriesHtml = "";
    categories.forEach((c) => {
      categoriesHtml += `
        <button data-category-id="${c.id}"
                                    class="btn btn-light filter-button w-100 px-3 border-0 rounded-3 mb-2 fw-normal justify-content-between text-capitalize"
                                    style="background-color: #f3f4f6;justify-content: space-between !important;">
                                    <div> ${c.name} </div>
                                    <!-- <div>(10)</div> -->
                                </button>`;
    });
    document.getElementById("category-container").innerHTML = categoriesHtml;
    document.getElementById("categories-mobile-container").innerHTML =
      categoriesHtml;
  } catch (error) {
    console.log(error);
    showToast();
  }
}
getCategories();

let selectedCategories = [];

document.getElementById("category-container").addEventListener("click", (e) => {
  if (e.target.closest("button")) {
    const button = e.target.closest("button");
    const categoryId = button.getAttribute("data-category-id");

    // Toggle active class and add/remove categoryId from selectedCategories
    if (selectedCategories.includes(categoryId)) {
      selectedCategories = selectedCategories.filter((id) => id !== categoryId);
      button.classList.remove("active");
    } else {
      if (selectedCategories.length < 2) {
        selectedCategories.push(categoryId);
        button.classList.add("active");
      } else {
        // If there are already 2 categories, replace the oldest one
        selectedCategories.shift(); // Remove the first category (oldest)
        selectedCategories.push(categoryId); // Add the new category
        // Update the active class for the buttons accordingly
        const allButtons = document.querySelectorAll(
          "#category-container button"
        );
        allButtons.forEach((btn) => {
          if (
            selectedCategories.includes(btn.getAttribute("data-category-id"))
          ) {
            btn.classList.add("active");
          } else {
            btn.classList.remove("active");
          }
        });
      }
    }

    renderEvents(); // Fetch events based on new filter
  }
});
document
  .getElementById("categories-mobile-container")
  .addEventListener("click", (e) => {
    if (e.target.closest("button")) {
      const button = e.target.closest("button");
      const categoryId = button.getAttribute("data-category-id");

      // Toggle active class and add/remove categoryId from selectedCategories
      if (selectedCategories.includes(categoryId)) {
        selectedCategories = selectedCategories.filter(
          (id) => id !== categoryId
        );
        button.classList.remove("active");
      } else {
        if (selectedCategories.length < 2) {
          selectedCategories.push(categoryId);
          button.classList.add("active");
        } else {
          // If there are already 2 categories, replace the oldest one
          selectedCategories.shift(); // Remove the first category (oldest)
          selectedCategories.push(categoryId); // Add the new category
          // Update the active class for the buttons accordingly
          const allButtons = document.querySelectorAll(
            "#category-container button"
          );
          allButtons.forEach((btn) => {
            if (
              selectedCategories.includes(btn.getAttribute("data-category-id"))
            ) {
              btn.classList.add("active");
            } else {
              btn.classList.remove("active");
            }
          });
        }
      }

      renderEvents(); // Fetch events based on new filter
    }
  });

document.getElementById("btnResetFilter").addEventListener("click", (e) => {
  clearFilter();
  renderEvents();
});
document
  .getElementById("btnResetFilterMobile")
  .addEventListener("click", (e) => {
    clearFilter();
    renderEvents();
  });

// document.getElementById("searchForm").addEventListener("submit", (e)=>{
//     e.preventDefault()
//     clearFilter ()
//     renderEvents()
// })

document.getElementById("searchInput").addEventListener("input", (e) => {
  e.preventDefault();
  clearFilter();
  renderEvents();
});

function clearFilter() {
  document.getElementById("date-filter").value = "";
  document.getElementById("date-filter-mobile").value = "";
  document.getElementById("price-filter").value = "";
  document.getElementById("price-filter-mobile").value = "";
  document.getElementById("sort-filter").value = "";
  document.getElementById("sort-filter-mobile").value = "";
  document.getElementById("status-filter").value = "";
  document.getElementById("status-filter-mobile").value = "";

  document.getElementById("type-filter").value = ""
  document.getElementById("type-filter-mobile").value = ""

  selectedCategories = [];
  document.querySelectorAll("#category-container button").forEach((button) => {
    button.classList.remove("active");
  });
  document
    .querySelectorAll("#categories-mobile-container button")
    .forEach((button) => {
      button.classList.remove("active");
    });
}

document.getElementById("date-filter").addEventListener("change", (e) => {
  renderEvents();
});
document.getElementById("status-filter").addEventListener("change", (e) => {
  renderEvents();
});
document.getElementById("price-filter").addEventListener("change", (e) => {
  renderEvents();
});
document
  .getElementById("date-filter-mobile")
  .addEventListener("change", (e) => {
    renderEvents();
  });
document
  .getElementById("price-filter-mobile")
  .addEventListener("change", (e) => {
    renderEvents();
  });
document.getElementById("sort-filter").addEventListener("change", (e) => {
  renderEvents();
});
document
  .getElementById("sort-filter-mobile")
  .addEventListener("change", (e) => {
    renderEvents();
  });

document
  .getElementById("status-filter-mobile")
  .addEventListener("change", (e) => {
    renderEvents();
  });
document
  .getElementById("type-filter-mobile")
  .addEventListener("change", (e) => {
    renderEvents();
  });
document
  .getElementById("type-filter")
  .addEventListener("change", (e) => {
    renderEvents();
  });

document.addEventListener("DOMContentLoaded", (e) => renderEvents());

async function renderEvents(page = 1, perpage = 10, is_published = true) {
  const eventList = document.getElementById("event-list");
  eventList.innerHTML = `
  <div class="mb-3">
                                              <div colspan="5">
                                                  <div
                                                      class="card border-0 h-100"
                                                      aria-hidden="true">
                                                      <div class="row g-0">
                                                          <div class="col-4">
                                                              <div
                                                                  class="bg-secondary-subtle border rounded-1"
                                                                  style="width: 100%; height: 100%;">

                                                              </div>
                                                          </div>
                                                          <div class="col-8">
                                                              <div
                                                                  class="card-body py-2">
                                                                  <h5
                                                                      class="card-title ">
                                                                      <span
                                                                          class="placeholder col-11 "
                                                                          style="background-color: #D4D4D4;"></span>
                                                                  </h5>
                                                                  <p
                                                                      class="card-text ">
                                                                      <span
                                                                          class="placeholder col-10"
                                                                          style="background-color: #D4D4D4;"></span>
                                                                      <span
                                                                          class="placeholder col-12"
                                                                          style="background-color: #D4D4D4;"></span>
                                                                  </p>
                                                                  <p
                                                                      class="card-text ">
                                                                      <span
                                                                          class="placeholder col-10"
                                                                          style="background-color: #D4D4D4;"></span>
                                                                      
                                                                  </p>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </div>

                                              </div>
                                          </div>
                                          <div class="mb-3">
                                              <td colspan="5">
                                                  <div
                                                      class="card border-0 h-100"
                                                      aria-hidden="true">
                                                      <div class="row g-0">
                                                          <div class="col-4">
                                                              <div
                                                                  class="bg-secondary-subtle border rounded-1"
                                                                  style="width: 100%; height: 100%;">

                                                              </div>
                                                          </div>
                                                          <div class="col-8">
                                                              <div
                                                                  class="card-body py-2">
                                                                  <h5
                                                                      class="card-title ">
                                                                      <span
                                                                          class="placeholder col-11 "
                                                                          style="background-color: #D4D4D4;"></span>
                                                                  </h5>
                                                                  <p
                                                                      class="card-text ">
                                                                      <span
                                                                          class="placeholder col-10"
                                                                          style="background-color: #D4D4D4;"></span>
                                                                      <span
                                                                          class="placeholder col-12"
                                                                          style="background-color: #D4D4D4;"></span>
                                                                  </p>
                                                                  <p
                                                                      class="card-text ">
                                                                      <span
                                                                          class="placeholder col-10"
                                                                          style="background-color: #D4D4D4;"></span>
                                                                      
                                                                  </p>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </div>

                                              </td>
                                          </div>
                                          <div class="mb-3">
                                              <td colspan="5">
                                                  <div
                                                      class="card border-0 h-100"
                                                      aria-hidden="true">
                                                      <div class="row g-0">
                                                          <div class="col-4">
                                                              <div
                                                                  class="bg-secondary-subtle border rounded-1"
                                                                  style="width: 100%; height: 100%;">

                                                              </div>
                                                          </div>
                                                          <div class="col-8">
                                                              <div
                                                                  class="card-body py-2">
                                                                  <h5
                                                                      class="card-title ">
                                                                      <span
                                                                          class="placeholder col-11 "
                                                                          style="background-color: #D4D4D4;"></span>
                                                                  </h5>
                                                                  <p
                                                                      class="card-text ">
                                                                      <span
                                                                          class="placeholder col-10"
                                                                          style="background-color: #D4D4D4;"></span>
                                                                      <span
                                                                          class="placeholder col-12"
                                                                          style="background-color: #D4D4D4;"></span>
                                                                  </p>
                                                                  <p
                                                                      class="card-text ">
                                                                      <span
                                                                          class="placeholder col-10"
                                                                          style="background-color: #D4D4D4;"></span>
                                                                      
                                                                  </p>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </div>

                                              </td>`;

  const dateFilter =
    document.getElementById("date-filter").value ||
    document.getElementById("date-filter-mobile").value;
  const priceFilter =
    document.getElementById("price-filter").value ||
    document.getElementById("price-filter-mobile").value;
  const sort =
    document.getElementById("sort-filter").value ||
    document.getElementById("sort-filter-mobile").value;
  const status =
    document.getElementById("status-filter").value ||
    document.getElementById("status-filter-mobile").value;
  const search = document.getElementById("searchInput").value;

  const type = document.getElementById("type-filter").value || document.getElementById("type-filter-mobile").value
  // const location = document.getElementById("location-filter").value;

  let queryParams = new URLSearchParams();
  let today = new Date();
  let startDate = "",
    endDate = "",
    minPrice = "",
    maxPrice = "";

  queryParams.append("page", `${page}`);
  queryParams.append("is_published", `${is_published}`);
  queryParams.append("perpage", `${perpage}`);

  if (search) {
    queryParams.append("search", search);
  }

  if (status) {
    queryParams.append("date_status", status);
  }
  if (type) {
    queryParams.append("event_type", type);
  }

  // Handle date filter
  if (dateFilter === "week") {
    startDate = new Date();
    endDate = new Date();
    endDate.setDate(today.getDate() + 7); // 7 days from today
  } else if (dateFilter === "month") {
    startDate = new Date();
    endDate = new Date();
    endDate.setMonth(today.getMonth() + 1); // Next month from today
  }

  if (sort == "eng_name") {
    queryParams.append("sort", "eng_name");
  } else if (sort == "created_at") {
    queryParams.append("sort", "created_at");
  }

  // Convert dates to YYYY-MM-DD format
  if (startDate)
    queryParams.append("start_date", startDate.toISOString().split("T")[0]);
  if (endDate)
    queryParams.append("end_date", endDate.toISOString().split("T")[0]);

  // Handle price filter
  if (priceFilter) {
    if (priceFilter === "free") {
      minPrice = "0";
      maxPrice = "0";
    } else if (priceFilter === "200+") {
      minPrice = "200";
      maxPrice = "";
    } else {
      [minPrice, maxPrice] = priceFilter.split("-"); // Extract min & max price
    }
  }

  if (minPrice) queryParams.append("min_price", minPrice);
  if (maxPrice) queryParams.append("max_price", maxPrice);

  // Handle location filter
  // if (location) queryParams.append("location", location);
  try {
    let qryStr = queryParams.toString();
    if (selectedCategories.length > 0) {
      let resultCate = selectedCategories.map(Number);
      qryStr += `&cateId=[${resultCate}]`;
    }
    console.log(qryStr);

    const { data } = await axiosInstance.get(`/events?${qryStr}`);
    const { data: events, paginate } = data;
    console.log(data);

    let html = ''

    if(events.length == 0){
      document.querySelector('.pagination-container').classList.add("d-none")
      return eventList.innerHTML = `<div class="text-center w-100 my-5">
              <img src="/img/noFound.png" alt="..." height="220px;">
              <h4 class="text-center text-brand mt-2">${getText("noEvent")}</h4>
            </div>`
    }
    document.querySelector('.pagination-container').classList.remove("d-none")

    events.forEach((event) => {
      let pricing = null;
      // Get the current date and time
      const eventDate = new Date(event.started_date);
      const endDate = new Date(event.ended_date);

      const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);
      let eventStatus = null;
      

      if (currentDate < eventDate) {
        eventStatus = getText("upcoming")
      } else if (currentDate >= eventDate && currentDate <= endDate) {
        eventStatus =  getText("showing")
      } else {
        eventStatus =  getText("past")
      } 

      if (event.event_tickets.length > 1) {
        const numbers = event.event_tickets.map((et) => et.price);
        const minNumber = Math.min(...numbers);
        const maxNumber = Math.max(...numbers);

        pricing = `$${minNumber.toFixed(2)} - $${maxNumber.toFixed(2)}`;
      } else if (event.event_tickets.length == 1) {
        pricing = `${
          event.event_tickets[0].price > 0
            ? `$${event.event_tickets[0].price.toFixed(2)}`
            :  getText("free")
        }`;
      } else if (event.event_tickets.length == 0) {
        if (event.event_type == "online") {
          pricing = getText("free")
        }
      }

      let categories = "";
      event.event_categories.forEach((c, i) => {
        categories += `<span class="event-category pill${i + 1} fw-medium">${
          c.name
        }</span>`;
      });


      const eventCard = `
                <div class="col-12" data-event-id="${event.id}">
                                <div class="event-card shadow-light-sm">
                                    <div class="event-card-container">
                                        <!-- Event Thumbnail -->
                                        <div
                                            class="event-thumbnail object-fit-cover d-flex justify-content-between" >
                                            <img style="cursor: pointer;" onclick="goEventDetail(${
                                              event.id
                                            })"
                                                class="img-fluid object-fit-cover"
                                                src="${
                                                  event.thumbnail
                                                    ? `/uploads/${event.thumbnail}`
                                                    : ""
                                                }"
                                                alt="Event Image"/>
                                            <div
                                                class="event-thumbnail-overlay" style="cursor: pointer;" onclick="goEventDetail(${
                                                  event.id
                                                })"></div>

                                            <!-- Wishlist & Copy buttons -->
                                            <div class="button-group">
                                                <div>
                                                    <button onclick="addWishlist(${
                                                      event.id
                                                    }, this)" class="button ${
        event.is_Wishlist && "active"
      }">
                                                        <i
                                                            class="fa-regular fa-heart"></i>
                                                        <!-- Wishlist Icon -->
                                                    </button>
                                                </div>
                                                <button class="button" onclick="copyEventUrlToClipboard(${
                                                  event.id
                                                })">
                                                    <i data-lucide="link" style="stroke-width: 2; width: 1.25rem;"></i>
                                                    <!-- Copy Link Icon -->
                                                </button>
                                            </div>

                                             <!-- Event Type Tag -->
                                            <div style="cursor: pointer;" onclick="goEventDetail(${
                                              event.id
                                            })" class="event-type text-brand py-1">
                                                <i
                                                    class="fas fa-tag" style="font-size: 10px !important;"></i>
                                                <small>${pricing}</small>
                                            </div>
                                        </div>
                                       

                                        <!-- Event Details -->
                                        <div class="event-details" style="cursor: pointer;" onclick="goEventDetail(${
                                          event.id
                                        })">
                                            <div
                                                class="d-flex justify-content-between align-items-center">

                                                <h3
                                                    class="event-title text-wrap">${
                                                      event.eng_name
                                                    }</h3>
                                                <span
                                                    class="event-category pill5 fw-medium d-none d-sm-flex">${eventStatus}</span>
                                                
                                            </div>
                                            <!-- <p
                                                class="event-description d-none text-1-line">
                                                ${event.short_description}
                                            </p> -->

                                            <!-- Event Tags -->
                                            <div
                                                class="d-flex align-items-center justify-content-between mb-2">
                                                <div
                                                    class="event-categories flex-nowrap">
                                                    ${categories}
                                                </div>
                                                <div
                                                    class="d-flex align-items-center">

                                                </div>
                                            </div>

                                            <!-- Date & Location -->
                                            <div class="event-meta">
                                                <div class="event-meta-item">
                                                    <i
                                                        class="fas fa-calendar-alt text-brand fs-6"></i>
                                                    <span>${moment(
                                                      event.started_date
                                                    ).format("ll")}</span>
                                                </div>
                                                <div class="event-meta-item">
                                                    <i
                                                        class="fas fa-clock text-brand fs-6"></i>
                                                    <span>${
                                                      moment(
                                                        event.start_time,
                                                        "HH:mm"
                                                      ).format("LT") +
                                                      " - " +
                                                      moment(
                                                        event.end_time,
                                                        "HH:mm"
                                                      ).format("LT")
                                                    }</span>
                                                </div>

                                            </div>

                                            <div class="event-meta-item ${
                                              event.location ? "" : ""
                                            }"
                                                style="">
                                                <i
                                                    class="fas fa-map-marker-alt text-brand fs-6"></i>
                                                <p
                                                    class="text-1-line mb-0 pb-0">${
                                                      event.event_type ==
                                                      "offline"
                                                        ? event.location
                                                        : getText("onlineEvent")
                                                    }</p>
                                                <div
                                                    class=" text-brand fw-medium"
                                                    style="border-color: var(--c-brand) !important;">

                                                </div>

                                            </div>
                                            <!-- <div class="event-meta-item ${
                                              !pricing && "d-none"
                                            }">
                                                <i
                                                    class="fa-solid fa-tag text-brand"></i><span
                                                    class>${pricing}</span>

                                            </div> -->

                                            <!-- Event Price -->

                                            <!-- Creator Profile -->
                                            <div class="creator-profile d-none">
                                                <div class="creator-avatar">
                                                    <img
                                                        src=""
                                                        alt="Creator" />
                                                </div>
                                                <a href="#"
                                                    class="creator-name">Hosted
                                                    by John Doe</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
            `;

            html += eventCard
      
      
    });
    eventList.innerHTML = html;
    lucide.createIcons();

    // Initialize pagination on load
    renderPagination(paginate);
  } catch (error) {
    console.log(error);
    showToast();
  }
}

function renderPagination(paginate) {
  const paginationNumbers = document.getElementById("pagination-numbers");
  paginationNumbers.innerHTML = "";

  const totalPages = paginate.total_page;
  const currentPage = paginate.current_page;

  function createPageButton(page) {
    const pageButton = document.createElement("button");
    pageButton.textContent = page;
    pageButton.classList.add("pagination-number");
    if (page === currentPage) {
      pageButton.classList.add("active");
    }
    pageButton.onclick = () => changePage(page);
    return pageButton;
  }

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      paginationNumbers.appendChild(createPageButton(i));
    }
  } else {
    paginationNumbers.appendChild(createPageButton(1));

    if (currentPage > 3) {
      paginationNumbers.appendChild(document.createTextNode("..."));
    }

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      paginationNumbers.appendChild(createPageButton(i));
    }

    if (currentPage < totalPages - 2) {
      paginationNumbers.appendChild(document.createTextNode("..."));
    }

    paginationNumbers.appendChild(createPageButton(totalPages));
  }

  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;

  document.getElementById("prevBtn").onclick = () =>
    changePage(currentPage - 1);
  document.getElementById("nextBtn").onclick = () =>
    changePage(currentPage + 1);
}

async function changePage(newPage) {
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set("page", newPage); // Update page parameter

  await renderEvents(newPage); // Call renderEvents with new page
}

// Sidebar Toggle
function showSidebar() {
  document.getElementById("mobile-sidebar").classList.add("show");
  document.getElementById("sidebar-overlay").classList.add("show");
}

function hideSidebar() {
  document.getElementById("mobile-sidebar").classList.remove("show");
  document.getElementById("sidebar-overlay").classList.remove("show");
}

