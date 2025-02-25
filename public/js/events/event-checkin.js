

async function renderEventsAll(page = 1, perpage = 10, is_published = null) {
    const eventList = document.getElementById("event-tobody");
    eventList.innerHTML = "";

    const sort = document.getElementById("event-sort-filter")?.value;
    const search = document.getElementById("searchEventInput")?.value;

  
    let queryParams = new URLSearchParams();
  
    queryParams.append("page", `${page}`);
    if(is_published){

        queryParams.append("is_published", `${is_published}`);
    }
    queryParams.append("perpage", `${perpage}`);
  
    if (search) {
      queryParams.append("search", search);
    }
  
    if (sort == "eng_name") {
      queryParams.append("sort", "eng_name");
    } else if (sort == "created_at") {
      queryParams.append("sort", "created_at");
    }

    try {
      const {data: resultUser} = await axiosInstance.get("/auth/me");
      const {data: user} = resultUser;
      const userId = user[0].id;
      // console.log(user);

      queryParams.append("creator", userId)

      const { data } = await axiosInstance.get(
        `/events?${queryParams.toString()}`
      );
      const { data: events , paginate} = data;
      console.log(data);
  
      events.forEach(async(event) => {
        const {data} = await axiosInstance.get("/events/summary-data/"+event.id);
        console.log(data);

        const formattedDate = `${moment(event.started_date).format("MMM D, YYYY")} - ${moment(event.started_date).format("MMM D, YYYY")}, ${
          moment(
            event.start_time,
            "HH:mm"
          ).format("LT") +
          " - " +
          moment(
            event.end_time,
            "HH:mm"
          ).format("LT")
        }`;
        
        let totalPrice = data.data.ticket.length > 0 ? `$${data.data.ticket.reduce((sum, item) => sum + item.price, 0).toFixed(2)}` : `Free`;

  
        const eventCard = `<tr class="border-bottom position-relative">
                                                    <td>
                                                        <a onclick="showRequestTicketList(${event.id})" role="button" class="stretched-link text-decoration-none bg-transparent"  style="color: inherit;">
                                                            <div class="d-flex align-items-center">
                                                                <div class="me-3">
                                                                    <div class="text-center text-brand fw-bold">${moment(event.started_date).format("MMM ")}</div>
                                                                    <div class="text-center text-brand fw-bold">${moment(event.started_date).format("DD")}</div>
                                                                </div>
                                                                <img src="/uploads/default-events-img.jpg" alt="Event Image" class="rounded object-fit-cover" width="150" height="85">
                                                                <div class="ms-3 text-nowrap">
                                                                    <h5 class="mb-0 text-wrap">${event.eng_name}</h5>
                                                                    <p class="text-muted mb-0 w-75">${event.location ? event.location : "Online Event"}</p>
                                                                    <p class="text-muted mb-0 small">${formattedDate}</p>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </td>
                                                    <td class="text-nowrap">Active</td>
                                                    <td class="text-nowrap">${data.data.total_checkin ? data.data.total_checkin : '0'} Checked In </td>
                                                    
                                                </tr>`
              
        eventList.innerHTML += eventCard;
        lucide.createIcons();
              renderPaginationAll(paginate)
      });
  
      
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
    
      function createPageButton(page, paginationNumber) {
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
    
      document.getElementById("prevBtn").onclick = () => changePageAll(currentPage - 1);
      document.getElementById("nextBtn").onclick = () => changePageAll(currentPage + 1);
    }
    
  
  async function changePageAll(newPage) {
      const queryParams = new URLSearchParams(window.location.search);
      queryParams.set("page", newPage); // Update page parameter
    
      await renderEventsAll(newPage); // Call renderEvents with new page
    }

renderEventsAll();

async function deleteEvent(id, btn) {
  try {
    await axiosInstance.delete("/events/"+id);
    showToast(true, "Event Deleted Successfully.")
    btn.closest("tr").remove()
  } catch (error) {
    showToast()
    console.log(error);
    
  }
}

function updateEvent(id) {
  sessionStorage.setItem("event-update-id", id)
  window.location.href = "/event/update-event"
}

document.getElementById("searchEventInput").oninput = (e)=>{
  renderEventsAll()
}

document.getElementById("event-sort-filter").onchange = (e)=>{
  renderEventsAll()
}


  function showRequestTicketList(id) {
    
    sessionStorage.setItem("event-request-ticket-list", id); 
    window.location.href = "/event/request-ticket-list";
}
