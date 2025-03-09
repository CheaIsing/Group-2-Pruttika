let loadingHtml = `
  <tr>
    <td colspan="5">
      <div class="card border-0" aria-hidden="true">
        <div class="row g-0">
          <div class="col-4">
            <div class="bg-secondary-subtle border rounded-1" style="width: 100%; height: 100%;"></div>
          </div>
          <div class="col-8">
            <div class="card-body py-2">
              <h5 class="card-title">
              <span class="placeholder col-11" style="background-color: #D4D4D4;"></span>
              </h5>
              
              <span class="placeholder col-12 mb-1" style="background-color: #D4D4D4;"></span>
              <span class="placeholder col-11 mb-1" style="background-color: #D4D4D4;"></span>
              
            </div>
          </div>
        </div>
      </div>
    </td>
  </tr>
  <tr>
    <td colspan="5">
      <div class="card border-0" aria-hidden="true">
        <div class="row g-0">
          <div class="col-4">
            <div class="bg-secondary-subtle border rounded-1" style="width: 100%; height: 100%;"></div>
          </div>
          <div class="col-8">
            <div class="card-body py-2">
              <h5 class="card-title">
              <span class="placeholder col-11" style="background-color: #D4D4D4;"></span>
              </h5>
              
              <span class="placeholder col-12 mb-1" style="background-color: #D4D4D4;"></span>
              <span class="placeholder col-11 mb-1" style="background-color: #D4D4D4;"></span>
              
            </div>
          </div>
        </div>
      </div>
    </td>
  </tr>
  <tr>
    <td colspan="5">
      <div class="card border-0" aria-hidden="true">
        <div class="row g-0">
          <div class="col-4">
            <div class="bg-secondary-subtle border rounded-1" style="width: 100%; height: 100%;"></div>
          </div>
          <div class="col-8">
            <div class="card-body py-2">
              <h5 class="card-title">
              <span class="placeholder col-11" style="background-color: #D4D4D4;"></span>
              </h5>
              
              <span class="placeholder col-12 mb-1" style="background-color: #D4D4D4;"></span>
              <span class="placeholder col-11 mb-1" style="background-color: #D4D4D4;"></span>
              
            </div>
          </div>
        </div>
      </div>
    </td>
  </tr>
  <tr>
    <td colspan="5">
      <div class="card border-0" aria-hidden="true">
        <div class="row g-0">
          <div class="col-4">
            <div class="bg-secondary-subtle border rounded-1" style="width: 100%; height: 100%;"></div>
          </div>
          <div class="col-8">
            <div class="card-body py-2">
              <h5 class="card-title">
              <span class="placeholder col-11" style="background-color: #D4D4D4;"></span>
              </h5>
              
              <span class="placeholder col-12 mb-1" style="background-color: #D4D4D4;"></span>
              <span class="placeholder col-11 mb-1" style="background-color: #D4D4D4;"></span>
              
            </div>
          </div>
        </div>
      </div>
    </td>
  </tr>
  
  `;

  let noEvent = `<tr><td colspan="6"><div class="text-center w-100 my-5">
              <img src="/img/noFound.png" alt="..." height="220px;">
              <h4 class="text-center text-brand mt-2">No Event to Display</h4>
            </div></td></tr>`
async function renderEventsAll(page = 1, perpage = 10, is_published = null) {
  const eventList = document.getElementById("event-tobody");
  eventList.innerHTML = loadingHtml

  const sort = document.getElementById("event-sort-filter")?.value;
  const search = document.getElementById("searchEventInput")?.value;

  let queryParams = new URLSearchParams();
  queryParams.append("page", `${page}`);
  if (is_published) {
    queryParams.append("is_published", `${is_published}`);
  }
  queryParams.append("perpage", `${perpage}`);
  if (search) {
    queryParams.append("search", search);
  }
  if (sort === "eng_name") {
    queryParams.append("sort", "eng_name");
  } else if (sort === "created_at") {
    queryParams.append("sort", "created_at");
  }

  try {
    const { data: resultUser } = await axiosInstance.get("/auth/me");
    const { data: user } = resultUser;

    // console.log(user);
    
    const userId = user.id;
    queryParams.append("creator", userId);

    const { data } = await axiosInstance.get(`/events?${queryParams.toString()}`);
    const { data: events, paginate } = data;

    if (events.length <= 0) {
      return eventList.innerHTML = noEvent
    }

    let eventCard = "";

    for (const event of events) {
      const { data } = await axiosInstance.get("/events/summary-data/" + event.id);
      const formattedDate = `${moment(event.started_date).format("MMM D, YYYY")} - ${moment(event.ended_date).format("MMM D, YYYY")}, ${moment(event.start_time, "HH:mm").format("LT")} - ${moment(event.end_time, "HH:mm").format("LT")}`;

      let isOffline = event.event_type !== "offline";
      let eventLinkAttributes = ``;
      console.log(eventLinkAttributes);
      

      let totalPrice = data.data.ticket.length > 0 
        ? `$${data.data.ticket.reduce((sum, item) => sum + item.price, 0).toFixed(2)}`
        : `Free`;
        const eventDate = new Date(event.started_date);
        const endDate = new Date(event.ended_date);
  
        const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
        let eventStatus = null;
        let eventText = null
        
  
        if (currentDate < eventDate) {
          eventStatus = "pill5";
          eventText = "Upcoming"
        } else if (currentDate >= eventDate && currentDate <= endDate) {
          eventStatus = "pill2";
          eventText = "Showing"
        } else {
          eventStatus = `pill3`;
          eventText = "Past"
        } 

      eventCard += `<tr class="border-bottom position-relative">
                      <td>
                        <a role="button" onclick="showSummary(${event.id})" class="stretched-link text-decoration-none bg-transparent link-event-details" style="color: inherit;">
                          <div class="d-flex align-items-center">
                            <div class="me-3">
                              <div class="text-center text-brand fw-bold">${moment(event.started_date).format("MMM ")}</div>
                              <div class="text-center text-brand fw-bold">${moment(event.started_date).format("DD")}</div>
                            </div>
                            <img src="/uploads/default-events-img.jpg" alt="Event Image" class="rounded object-fit-cover" width="150" height="85">
                            <div class="ms-3 text-nowrap">
                              <h5 class="mb-0 text-wrap">${event.eng_name}</h5>
                              <p class="text-muted mb-0 w-75">${event.location || "Online Event"}</p>
                              <p class="text-muted mb-0 small">${formattedDate}</p>
                            </div>
                          </div>
                        </a>
                      </td>
                      <td class="text-nowrap"><span class="badge fw-medium ${eventStatus} p-2  rounded-5">${eventText}</span></td>
                      <td class="text-nowrap">${data.data.total_approved_registrations || "0"} tickets</td>
                      <td class="text-nowrap">${totalPrice}</td>
                      <td class="text-nowrap">${data.data.total_checkin || "0"} participated</td>
                      <td>
                        <div class="dropstart position-relative z-3">
                          <button class="btn btn-brand" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-three-dots"></i>
                          </button>
                          <ul class="dropdown-menu dropdown-menu-end">
                            <li><a role="button" class="dropdown-item edit-event-btn" onclick="updateEvent(${event.id})">Update</a></li>
                            <li><a role="button" class="dropdown-item delete-event-btn" onclick="deleteEvent(${event.id}, this)">Delete</a></li>
                            <li><a class="dropdown-item views-event-detail" href="/event/detail?e=${event.id}">View</a></li>
                            <li><a role="button" class="dropdown-item" onclick="copyEventUrlToClipboard(${event.id})">Copy Link</a></li>
                          </ul>
                        </div>
                      </td>
                    </tr>`;
    }

    // console.log(eventCard); 

    eventList.innerHTML = eventCard;
    lucide.createIcons();
    renderPaginationAll(paginate);
  } catch (error) {
    console.log(error);
    showToast();
  }
}
function renderPaginationAll(paginate) {
  const paginationNumbers = document.getElementById("pagination-numbers-all");
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
    pageButton.onclick = () => changePageAll(page);
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
    changePageAll(currentPage - 1);
  document.getElementById("nextBtn").onclick = () =>
    changePageAll(currentPage + 1);
}

async function changePageAll(newPage) {
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set("page", newPage); // Update page parameter

  await renderEventsAll(newPage); // Call renderEvents with new page
}

renderEventsAll();

// Upcoming
async function renderEventsUpcoming(page = 1, perpage = 10, is_published = null) {
  const eventList = document.getElementById("upcoming-event-tbody");
  eventList.innerHTML = loadingHtml

  const sort = document.getElementById("upcoming-event-sort-filter")?.value;
  const search = document.getElementById("upcoming-searchEventInput")?.value;

  let queryParams = new URLSearchParams();
  queryParams.append("page", `${page}`);
  queryParams.append("date_status", 3); // Upcoming status
  if (is_published) queryParams.append("is_published", `${is_published}`);
  queryParams.append("perpage", `${perpage}`);
  if (search) queryParams.append("search", search);
  if (sort === "eng_name") queryParams.append("sort", "eng_name");
  else if (sort === "created_at") queryParams.append("sort", "created_at");

  try {
    const { data: resultUser } = await axiosInstance.get("/auth/me");
    const { data: user } = resultUser;
    const userId = user.id;
    queryParams.append("creator", userId);
    
    
    const { data } = await axiosInstance.get(`/events?${queryParams.toString()}`);
    const { data: events, paginate } = data;

    if (events.length <= 0) {
      return eventList.innerHTML = noEvent
    }


    let eventCard = "";
    for (const event of events) {
      const { data } = await axiosInstance.get("/events/summary-data/" + event.id);
      const formattedDate = `${moment(event.started_date).format("MMM D, YYYY")} - ${moment(event.ended_date).format("MMM D, YYYY")}, ${moment(event.start_time, "HH:mm").format("LT")} - ${moment(event.end_time, "HH:mm").format("LT")}`;
      
      let totalPrice = data.data.ticket.length > 0 
        ? `$${data.data.ticket.reduce((sum, item) => sum + item.price, 0).toFixed(2)}`
        : `Free`;

        const eventDate = new Date(event.started_date);
        const endDate = new Date(event.ended_date);
  
        const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
        let eventStatus = null;
        let eventText = null
        
  
        if (currentDate < eventDate) {
          eventStatus = "pill5";
          eventText = "Upcoming"
        } else if (currentDate >= eventDate && currentDate <= endDate) {
          eventStatus = "pill2";
          eventText = "Showing"
        } else {
          eventStatus = `pill3`;
          eventText = "Past"
        } 
  
      eventCard += `<tr class="border-bottom position-relative">
                      <td>
                        <a role="button" onclick="showSummary(${event.id})" class="stretched-link text-decoration-none bg-transparent link-event-details" style="color: inherit;">
                          <div class="d-flex align-items-center">
                            <div class="me-3">
                              <div class="text-center text-brand fw-bold">${moment(event.started_date).format("MMM ")}</div>
                              <div class="text-center text-brand fw-bold">${moment(event.started_date).format("DD")}</div>
                            </div>
                            <img src="/uploads/default-events-img.jpg" alt="Event Image" class="rounded object-fit-cover" width="150" height="85">
                            <div class="ms-3 text-nowrap">
                              <h5 class="mb-0 text-wrap">${event.eng_name}</h5>
                              <p class="text-muted mb-0 w-75">${event.location || "Online Event"}</p>
                              <p class="text-muted mb-0 small">${formattedDate}</p>
                            </div>
                          </div>
                        </a>
                      </td>
                      <td class="text-nowrap"><span class="badge fw-medium ${eventStatus} p-2  rounded-5">${eventText}</span></td>
                      <td class="text-nowrap">${data.data.total_approved_registrations || "0"} tickets</td>
                      <td class="text-nowrap">${totalPrice}</td>
                      <td class="text-nowrap">${data.data.total_checkin || "0"} participated</td>
                      <td>
                        <div class="dropstart position-relative z-3">
                          <button class="btn btn-brand" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-three-dots"></i>
                          </button>
                          <ul class="dropdown-menu dropdown-menu-end">
                            <li><a role="button" class="dropdown-item edit-event-btn" onclick="updateEvent(${event.id})">Update</a></li>
                            <li><a role="button" class="dropdown-item delete-event-btn" onclick="deleteEvent(${event.id}, this)">Delete</a></li>
                            <li><a class="dropdown-item views-event-detail" href="/event/detail?e=${event.id}">View</a></li>
                            <li><a role="button" class="dropdown-item" onclick="copyEventUrlToClipboard(${event.id})">Copy Link</a></li>
                          </ul>
                        </div>
                      </td>
                    </tr>`;
    }

    eventList.innerHTML = eventCard;
    lucide.createIcons();
    renderPaginationUpcoming(paginate);
  } catch (error) {
    console.log(error);
    showToast();
  }
}

function renderPaginationUpcoming(paginate) {
  const paginationNumbers = document.getElementById("pagination-numbers-upcoming");
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
    pageButton.onclick = () => changePageUpcoming(page);
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

  document.getElementById("prevUpcomingBtn").disabled = currentPage === 1;
  document.getElementById("nextUpcomingBtn").disabled = currentPage === totalPages;

  document.getElementById("prevUpcomingBtn").onclick = () => changePageUpcoming(currentPage - 1);
  document.getElementById("nextUpcomingBtn").onclick = () => changePageUpcoming(currentPage + 1);
}

async function changePageUpcoming(newPage) {
  await renderEventsUpcoming(newPage);
}

// Initial call to render upcoming events
renderEventsUpcoming();

// showing
async function renderEventsShowing(page = 1, perpage = 10, is_published = null) {
  const eventList = document.getElementById("showing-event-tbody");
  eventList.innerHTML = loadingHtml;

  const sort = document.getElementById("showing-event-sort-filter")?.value;
  const search = document.getElementById("showing-searchEventInput")?.value;

  let queryParams = new URLSearchParams();
  queryParams.append("page", `${page}`);
  queryParams.append("date_status", 2); // Showing status
  if (is_published) queryParams.append("is_published", `${is_published}`);
  queryParams.append("perpage", `${perpage}`);
  if (search) queryParams.append("search", search);
  if (sort === "eng_name") queryParams.append("sort", "eng_name");
  else if (sort === "created_at") queryParams.append("sort", "created_at");

  try {
    const { data: resultUser } = await axiosInstance.get("/auth/me");
    const { data: user } = resultUser;
    const userId = user.id;
    queryParams.append("creator", userId);
    console.log(queryParams.toString());
    const { data } = await axiosInstance.get(`/events?${queryParams.toString()}`);
    const { data: events, paginate } = data;

    console.log(events);
    
    

    if (events.length <= 0) {
      console.log(true);
      eventList.innerHTML = noEvent;
      return ;
    }

    console.log("Hi");
    

    let eventCard = "";
    for (const event of events) {
      const { data } = await axiosInstance.get("/events/summary-data/" + event.id);
      const formattedDate = `${moment(event.started_date).format("MMM D, YYYY")} - ${moment(event.ended_date).format("MMM D, YYYY")}, ${moment(event.start_time, "HH:mm").format("LT")} - ${moment(event.end_time, "HH:mm").format("LT")}`;
      
      let totalPrice = data.data.ticket.length > 0 
        ? `$${data.data.ticket.reduce((sum, item) => sum + item.price, 0).toFixed(2)}`
        : `Free`;
        const eventDate = new Date(event.started_date);
        const endDate = new Date(event.ended_date);
  
        const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
        let eventStatus = null;
        let eventText = null
        
  
        if (currentDate < eventDate) {
          eventStatus = "pill5";
          eventText = "Upcoming"
        } else if (currentDate >= eventDate && currentDate <= endDate) {
          eventStatus = "pill2";
          eventText = "Showing"
        } else {
          eventStatus = `pill3`;
          eventText = "Past"
        } 


      eventCard += `<tr class="border-bottom position-relative">
                      <td>
                        <a role="button" onclick="showSummary(${event.id})"  class="stretched-link text-decoration-none bg-transparent link-event-details" style="color: inherit;">
                          <div class="d-flex align-items-center">
                            <div class="me-3">
                              <div class="text-center text-brand fw-bold">${moment(event.started_date).format("MMM ")}</div>
                              <div class="text-center text-brand fw-bold">${moment(event.started_date).format("DD")}</div>
                            </div>
                            <img src="/uploads/default-events-img.jpg" alt="Event Image" class="rounded object-fit-cover" width="150" height="85">
                            <div class="ms-3 text-nowrap">
                              <h5 class="mb-0 text-wrap">${event.eng_name}</h5>
                              <p class="text-muted mb-0 w-75">${event.location || "Online Event"}</p>
                              <p class="text-muted mb-0 small">${formattedDate}</p>
                            </div>
                          </div>
                        </a>
                      </td>
                      <td class="text-nowrap"><span class="badge fw-medium ${eventStatus} p-2  rounded-5">${eventText}</span></td>
                      <td class="text-nowrap">${data.data.total_approved_registrations || "0"} tickets</td>
                      <td class="text-nowrap">${totalPrice}</td>
                      <td class="text-nowrap">${data.data.total_checkin || "0"} participated</td>
                      <td>
                        <div class="dropstart position-relative z-3">
                          <button class="btn btn-brand" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-three-dots"></i>
                          </button>
                          <ul class="dropdown-menu dropdown-menu-end">
                            <li><a role="button" class="dropdown-item edit-event-btn" onclick="updateEvent(${event.id})">Update</a></li>
                            <li><a role="button" class="dropdown-item delete-event-btn" onclick="deleteEvent(${event.id}, this)">Delete</a></li>
                            <li><a class="dropdown-item views-event-detail" href="/event/detail?e=${event.id}">View</a></li>
                            <li><a role="button" class="dropdown-item" onclick="copyEventUrlToClipboard(${event.id})">Copy Link</a></li>
                          </ul>
                        </div>
                      </td>
                    </tr>`;
    }

    eventList.innerHTML = eventCard;
    lucide.createIcons();
    renderPaginationShowing(paginate);
  } catch (error) {
    console.log(error);
    showToast();
  }
}

function renderPaginationShowing(paginate) {
  const paginationNumbers = document.getElementById("pagination-numbers-showing");
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
    pageButton.onclick = () => changePageShowing(page);
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

  document.getElementById("prevShowingBtn").disabled = currentPage === 1;
  document.getElementById("nextShowingBtn").disabled = currentPage === totalPages;

  document.getElementById("prevShowingBtn").onclick = () => changePageShowing(currentPage - 1);
  document.getElementById("nextShowingBtn").onclick = () => changePageShowing(currentPage + 1);
}

async function changePageShowing(newPage) {
  await renderEventsShowing(newPage);
}

// Initial call to render showing events
renderEventsShowing();

// Past
async function renderEventsPast(page = 1, perpage = 10, is_published = null) {
  const eventList = document.getElementById("past-event-tbody");
  eventList.innerHTML = loadingHtml;

  const sort = document.getElementById("past-event-sort-filter")?.value;
  const search = document.getElementById("past-searchEventInput")?.value;

  let queryParams = new URLSearchParams();
  queryParams.append("page", `${page}`);
  queryParams.append("date_status", 1); // Showing status
  if (is_published) queryParams.append("is_published", `${is_published}`);
  queryParams.append("perpage", `${perpage}`);
  if (search) queryParams.append("search", search);
  if (sort === "eng_name") queryParams.append("sort", "eng_name");
  else if (sort === "created_at") queryParams.append("sort", "created_at");

  try {
    const { data: resultUser } = await axiosInstance.get("/auth/me");
    const { data: user } = resultUser;
    const userId = user.id;
    queryParams.append("creator", userId);

    const { data } = await axiosInstance.get(`/events?${queryParams.toString()}`);
    const { data: events, paginate } = data;

    if (events.length <= 0) {
      return (eventList.innerHTML = noEvent);
    }

    let eventCard = "";
    for (const event of events) {
      const { data } = await axiosInstance.get("/events/summary-data/" + event.id);
      const formattedDate = `${moment(event.started_date).format("MMM D, YYYY")} - ${moment(event.ended_date).format("MMM D, YYYY")}, ${moment(event.start_time, "HH:mm").format("LT")} - ${moment(event.end_time, "HH:mm").format("LT")}`;
      
      let totalPrice = data.data.ticket.length > 0 
        ? `$${data.data.ticket.reduce((sum, item) => sum + item.price, 0).toFixed(2)}`
        : `Free`;
        const eventDate = new Date(event.started_date);
        const endDate = new Date(event.ended_date);
  
        const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
        let eventStatus = null;
        let eventText = null
        
  
        if (currentDate < eventDate) {
          eventStatus = "pill5";
          eventText = "Upcoming"
        } else if (currentDate >= eventDate && currentDate <= endDate) {
          eventStatus = "pill2";
          eventText = "Showing"
        } else {
          eventStatus = `pill3`;
          eventText = "Past"
        } 

      eventCard += `<tr class="border-bottom position-relative">
                      <td>
                        <a role="button" onclick="showSummary(${event.id})"  class="stretched-link text-decoration-none bg-transparent link-event-details" style="color: inherit;">
                          <div class="d-flex align-items-center">
                            <div class="me-3">
                              <div class="text-center text-brand fw-bold">${moment(event.started_date).format("MMM ")}</div>
                              <div class="text-center text-brand fw-bold">${moment(event.started_date).format("DD")}</div>
                            </div>
                            <img src="/uploads/default-events-img.jpg" alt="Event Image" class="rounded object-fit-cover" width="150" height="85">
                            <div class="ms-3 text-nowrap">
                              <h5 class="mb-0 text-wrap">${event.eng_name}</h5>
                              <p class="text-muted mb-0 w-75">${event.location || "Online Event"}</p>
                              <p class="text-muted mb-0 small">${formattedDate}</p>
                            </div>
                          </div>
                        </a>
                      </td>
                      <td class="text-nowrap"><span class="badge fw-medium ${eventStatus} p-2  rounded-5">${eventText}</span></td>
                      <td class="text-nowrap">${data.data.total_approved_registrations || "0"} tickets</td>
                      <td class="text-nowrap">${totalPrice}</td>
                      <td class="text-nowrap">${data.data.total_checkin || "0"} participated</td>
                      <td>
                        <div class="dropstart position-relative z-3">
                          <button class="btn btn-brand" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-three-dots"></i>
                          </button>
                          <ul class="dropdown-menu dropdown-menu-end">
                            <li><a role="button" class="dropdown-item edit-event-btn" onclick="updateEvent(${event.id})">Update</a></li>
                            <li><a role="button" class="dropdown-item delete-event-btn" onclick="deleteEvent(${event.id}, this)">Delete</a></li>
                            <li><a class="dropdown-item views-event-detail" href="/event/detail?e=${event.id}">View</a></li>
                            <li><a role="button" class="dropdown-item" onclick="copyEventUrlToClipboard(${event.id})">Copy Link</a></li>
                          </ul>
                        </div>
                      </td>
                    </tr>`;
    }

    eventList.innerHTML = eventCard;
    lucide.createIcons();
    renderPaginationPast(paginate);
  } catch (error) {
    console.log(error);
    showToast();
  }
}

function renderPaginationPast(paginate) {
  const paginationNumbers = document.getElementById("pagination-numbers-past");
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
    pageButton.onclick = () => changePagePast(page);
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

  document.getElementById("prevShowingBtn").disabled = currentPage === 1;
  document.getElementById("nextShowingBtn").disabled = currentPage === totalPages;

  document.getElementById("prevShowingBtn").onclick = () => changePagePast(currentPage - 1);
  document.getElementById("nextShowingBtn").onclick = () => changePagePast(currentPage + 1);
}

async function changePagePast(newPage) {
  await renderEventsPast(newPage);
}


renderEventsPast();

async function deleteEvent(id, btn) {
  try {
    await axiosInstance.delete("/events/" + id);
    showToast(true, "Event Deleted Successfully.");
    btn.closest("tr").remove();
  } catch (error) {
    showToast();
    console.log(error);
  }
}

function updateEvent(id) {
  sessionStorage.setItem("event-update-id", id);
  window.location.href = "/event/update-event";
}

document.getElementById("searchEventInput").oninput = (e) => {
  renderEventsAll();
};
document.getElementById("upcoming-searchEventInput").oninput = (e) => {
  renderEventsUpcoming();
};
document.getElementById("showing-searchEventInput").oninput = (e) => {
  renderEventsShowing();
};
document.getElementById("past-searchEventInput").oninput = (e) => {
  renderEventsPast();
};

document.getElementById("upcoming-event-sort-filter").onchange = (e) => {
  renderEventsUpcoming();
};
document.getElementById("showing-event-sort-filter").onchange = (e) => {
  renderEventsShowing();
};
document.getElementById("past-event-sort-filter").onchange = (e) => {
  renderEventsPast();
};
document.getElementById("event-sort-filter").onchange = (e) => {
  renderEventsAll();
};

function showSummary(id) {
  sessionStorage.setItem("event-summary", id);
  window.location.href = "/event/summary";
}
