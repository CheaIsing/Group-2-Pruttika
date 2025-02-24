

async function renderEventsAll(page = 1, perpage = 10, is_published = null) {
    const eventList = document.getElementById("event-tobody");
    eventList.innerHTML = "";

    const sort = document.getElementById("sort-filter")?.value;
    const search = document.getElementById("searchInput")?.value;

  
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
        
        let totalPrice = data.data.ticket.length > 0 ? `${data.data.ticket.reduce((sum, item) => sum + item.price, 0)}` : `Free`;

        // let pricing = null;
  
        // if (event.event_tickets.length > 1) {
        //   const numbers = event.event_tickets.map((et) => et.price);
        //   const minNumber = Math.min(...numbers);
        //   const maxNumber = Math.max(...numbers);
  
        //   pricing = `$${minNumber.toFixed(2)} - $${maxNumber.toFixed(2)}`;
        // } else if (event.event_tickets.length == 1) {
        //   pricing = `${
        //     event.event_tickets[0].price > 0
        //       ? `$${event.event_tickets[0].price.toFixed(2)}`
        //       : "Free Ticket"
        //   }`;
        // } else if (event.event_tickets.length == 0) {
        //   pricing = ``;
        // }
  
        const eventCard = `<tr class="border-bottom position-relative">
                                                    <td>
                                                        <a href="" class="stretched-link text-decoration-none bg-transparent link-event-details" style="color: inherit;">
                                                            <div class="d-flex align-items-center">
                                                                <div class="me-3">
                                                                    <div class="text-center text-brand fw-bold">${moment(event.started_date).format("MMM ")}</div>
                                                                    <div class="text-center text-brand fw-bold">${moment(event.started_date).format("DDD")}</div>
                                                                </div>
                                                                <img src="/uploads/default-events-img.jpg" alt="Event Image" class="rounded object-fit-cover" width="150" height="85">
                                                                <div class="ms-3 text-nowrap">
                                                                    <h5 class="mb-0 text-wrap">${event.eng_name}</h5>
                                                                    <p class="text-muted mb-0 w-75">${event.location}</p>
                                                                    <p class="text-muted mb-0 small">${formattedDate}</p>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </td>
                                                    <td class="text-nowrap">Active</td>
                                                    <td class="text-nowrap">${data.data.total_approved_registrations ? data.data.total_approved_registrations: "0"} <span class="">tickets</span></td>
                                                    <td class="text-nowrap">${totalPrice}</td>
                                                    <td class="text-nowrap">${data.data.total_checkin ? data.data.total_checkin : "0"} <span class="">participated</span></td>
                                                    <td>
                                                        <div class="dropstart position-relative z-3">
                                                            <button class="btn btn-brand" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <i class="bi bi-three-dots"></i>
                                                            </button>
                                                            <ul class="dropdown-menu dropdown-menu-end">
                                                                <li><a class="dropdown-item edit-event-btn" href="#">Edit</a></li>
                                                                <li><a class="dropdown-item delete-event-btn" href="#">Delete</a></li>
                                                                <li><a class="dropdown-item views-event-detail" href="#">View</a></li>
                                                                <li><a class="dropdown-item" href="#" onclick="copyEventUrlToClipboard()">Copy Link</a></li>
                                                            </ul>
                                                        </div>
                                                    </td>
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
    
      document.getElementById("prevBtn").onclick = () => changePage(currentPage - 1);
      document.getElementById("nextBtn").onclick = () => changePage(currentPage + 1);
    }
    
  
  async function changePageAll(newPage) {
      const queryParams = new URLSearchParams(window.location.search);
      queryParams.set("page", newPage); // Update page parameter
    
      await renderEvents(newPage); // Call renderEvents with new page
    }

renderEventsAll();