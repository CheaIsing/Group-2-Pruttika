
const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    const ticketDataManager = {
      tickets: {},
      addTicket(id, data) {
          this.tickets[id] = data;
      },
      getTicket(id) {
          return this.tickets[id];
      }
  };
    
function setPlaceholder(){
  document.querySelector(".placeholder-content").innerHTML=`
    <div class="row d-flex align-items-center w-100 px-2 mb-3 rounded-3 overflow-hidden border-0 shadow-light-sm" >
        <div class="col-2 skeleton" style="height: 100px; background-color: #e0e0e0; border-radius: 4px;"></div>
        <div class="col-7" >
          <h5 class="skeleton" style="height: 20px; width: 40%; background-color: #e0e0e0; border-radius: 4px; margin: 10px 0;"></h5>
          <p class="skeleton" style="height: 15px; width: 60%; background-color: #e0e0e0; border-radius: 4px;"></p>
          <p class="skeleton" style="height: 15px; width: 50%; background-color: #e0e0e0; border-radius: 4px;"></p>
          
        </div>
        <div class="col-3 skeleton d-flex align-items-center" style="height: 30px; background-color: #e0e0e0; border-radius: 4px;"></div>
    </div>
    <div class="row d-flex align-items-center w-100 px-2  mb-3 rounded-3 overflow-hidden border-0 shadow-light-sm" >
        <div class="col-2 skeleton" style="height: 100px; background-color: #e0e0e0; border-radius: 4px;"></div>
        <div class="col-7" >
          <h5 class="skeleton" style="height: 20px; width: 40%; background-color: #e0e0e0; border-radius: 4px; margin: 10px 0;"></h5>
          <p class="skeleton" style="height: 15px; width: 60%; background-color: #e0e0e0; border-radius: 4px;"></p>
          <p class="skeleton" style="height: 15px; width: 50%; background-color: #e0e0e0; border-radius: 4px;"></p>
          
        </div>
        <div class="col-3 skeleton d-flex align-items-center" style="height: 30px; background-color: #e0e0e0; border-radius: 4px;"></div>
    </div>
  `;
}

async function getRequestTicket( status="", page=1, perpage=25) {
  let queryParams = new URLSearchParams();


  queryParams.append("page", page);
  queryParams.append("per_page", perpage);
  queryParams.append("sort", "created_at");

  if (status) {
    queryParams.append("status", status);
  }
  setPlaceholder();
  document.getElementById("requested-ticket-container").classList.add('d-none');
  try {
    const {data} = await axiosInstance.get(`/profile/own-request-ticket?${queryParams.toString()}`);
    const {data:tickets, paginate} = data;
    // console.log(tickets);


    
    document.getElementById("requested-ticket-container").innerHTML = setPlaceholder();
    if(tickets.length>0){
      tickets.forEach(ticket=>{
        let status = ""
        let classStatus = ""
        switch(ticket.status){
          case "Approved":{
            status = `✔ Approved`
            classStatus = "approved"
            break
          }
          case "Rejected":{
            status = `✖ Rejected`
            classStatus = "rejected"
            break
          }
          case "Pending":{
            status = `⏳ Pending`
            classStatus = "pending"
            break
          }
          
        }

        

        const obj = {
          purchase_date: ticket.created_at,
          qty: ticket.quantity,
          reject_reason: ticket.reject_reason,
          status: ticket.status,
          transaction_img: ticket.transaction_img,
          ticket_type: ticket.ticket_type,
          total: ticket.amount,
          class_status: classStatus
        }
        let isOffline = ticket.event.event_type == 2;

        ticketDataManager.addTicket(ticket.id, obj);
        // console.log(isOffline);
        
        let showTran = ticket.event.event_type == 2 ? `data-ticket-id='${ticket.id}' onclick="showTransaction(this)" data-bs-toggle="modal" data-bs-target="#exampleModal"` : '';

        // console.log(showTran);
        document.getElementById("requested-ticket-container").innerHTML += `
                <div
          class="accordion-item mb-3 rounded-3 overflow-hidden border-0 shadow-light-sm">
          <h2 class="accordion-header rounded-top-3"
            id="ticket1Header">
            <button class="accordion-button" ${showTran}
              type="button"
              >
              <div style="max-height: 100px;width: 180px;" class="me-1 object-fit-cover d-none d-md-block">
                <img src="/uploads/${ticket.event.thumbnail}"
                  style="max-height: 100px;width: 180px;" class="img-preview rounded-3 object-fit-cover"
                  alt="Image">
              </div>
              <!-- Left side (Title, Date, #Tickets) -->
              <div style="color: #4b5563;" class="ms-md-3">
                <h5 class="mb-2">${ticket.event.eng_name}</h5>
                <div class="mb-md-2 fs-6">
                  <div
                    class="d-flex align-items-md-center flex-column flex-md-row">
                    <div
                      class="d-flex align-items-center fs-6 me-md-4 mb-2 mb-md-0
                ">
                      <i class="text-brand" data-lucide="calendar"
                        style="stroke-width: 1.75px; width: 1.25rem;"></i>
                      <div class="ms-2">${moment(
                        ticket.event.started_date
                      ).format("ll")}</div>
                    </div>
                    <div
                      class="d-flex align-items-center fs-6 mb-2 mb-md-0">
                      <i class="text-brand" data-lucide="ticket"
                        style="stroke-width: 1.75px; width: 1.25rem;"></i>
                      <div class="ms-2 ">${ticket.quantity} ${ticket.ticket_type.type_name ? ticket.ticket_type.type_name : "ticket"}</div>
                    </div>
                  </div>
                </div>
                <div
                  class="d-flex align-items-center fs-6 mt-md-2 mb-2 mb-md-0 d-none d-sm-flex">
                  <i class="text-brand" data-lucide="map-pin"
                    style="stroke-width: 1.75px; width: 1.25rem;"></i>
                  <div class="ms-2 ">${ticket.event.event_type == 1 ? "Online Event" : ticket.event.location}</div>

                </div>
                <div>
                  <div
                    class="ticket-status approved text-nowrap d-block d-sm-none mt-3 text-center"
                    style="width: auto !important; ">${status}</div>
                </div>


              </div>
              <!-- Right side (Status) -->
              <div
                class="ticket-status ${classStatus} ms-auto text-nowrap d-none d-sm-block fw-semibold">${status}</div>

              <a id="btnTransaction"data-bs-toggle="tooltip" ${showTran}
              data-bs-placement="bottom"
              title="View Transaction"
              data-bs-custom-class="custom-tooltip" class="btn btn-brand btn-icon fw-semibold ms-3 px-3 rounded-circle d-none d-sm-flex" type="button"><i style="stroke-width: 1.75px; width: 1.25rem;" data-lucide="eye"></i></a>
            </button>
          </h2>

        </div>`
        lucide.createIcons();
      })
    }else{
      document.getElementById("requested-ticket-container").innerHTML = `<div class="text-center w-100 my-5">
              <img src="/img/noFound.png" alt="..." height="220px;">
              <h4 class="text-center text-brand mt-2">No Request Ticket to Display</h4>
            </div>`
    }
    
    document.getElementById("requested-ticket-container").classList.remove('d-none');
    document.querySelector(".placeholder-content").classList.add('d-none');

    renderPaginationRequest(paginate)
    
  } catch (error) {
    console.log(error);
    showToast();
  }
}
async function getOwnedTicket( status="", page=1, perpage=15) {
  let queryParams = new URLSearchParams();


  queryParams.append("page", page);
  queryParams.append("per_page", perpage);
  queryParams.append("sort", "created_at");

  if (status) {
    queryParams.append("status", status);
  }

  // console.log(queryParams.toString());
  setPlaceholder();
  document.getElementById("owned-ticket-container").classList.add('d-none');

  try {
    const {data} = await axiosInstance.get(`/profile/own-ticket?${queryParams.toString()}`);
    const {data:tickets, paginate} = data;
    // console.log(paginate);

    // console.log(tickets);
    


    
    document.getElementById("owned-ticket-container").innerHTML = setPlaceholder();
    if(tickets.length>0){
      tickets.forEach(ticket=>{
        let status = ""
        let classStatus = ""
        switch(ticket.status){
          case "Issue":{
            status = `Issue`
            classStatus = "approved"
            break
          }
          case "Used":{
            status = `Used`
            classStatus = "pending"
            break
          }          
        }


        document.getElementById("owned-ticket-container").innerHTML += `
                <div
          class="accordion-item mb-3 rounded-3 overflow-hidden border-0 shadow-light-sm">
          <h2 class="accordion-header rounded-top-3"
            id="ticket1Header">
            <button class="accordion-button" data-tickets='${JSON.stringify(ticket)}'  onclick="showTicket(this)"
              type="button"
              data-bs-toggle="modal" data-bs-target="#exampleModalTicket">
              <div style="max-height: 100px;width: 180px;" class="me-1 d-none d-md-block object-fit-cover">
                <img src="/uploads/${ticket.event.thumbnail}"
                  style="max-height: 100px;width: 180px;" class="img-preview rounded-3 object-fit-cover"
                  alt="Image">
              </div>
              <!-- Left side (Title, Date, #Tickets) -->
              <div style="color: #4b5563;" class="ms-md-3">
                <h5 class="mb-2">${ticket.event.eng_name}</h5>
                <div class="mb-md-2 fs-5">
                  <div
                    class="d-flex align-items-md-center flex-column flex-md-row">
                    <div
                      class="d-flex align-items-center fs-6 me-md-4 mb-2 mb-md-0
                ">
                      <i class="text-brand" data-lucide="calendar"
                        style="stroke-width: 1.75px; width: 1.25rem;"></i>
                      <div class="ms-2">${moment(
                        ticket.event.started_date
                      ).format("ll")}</div>
                    </div>
                    <div
                      class="d-flex align-items-center fs-6 mb-2 mb-md-0">
                      <i class="text-brand" data-lucide="ticket"
                        style="stroke-width: 1.75px; width: 1.25rem;"></i>
                      <div class="ms-2 ">${ticket.ticket_type}</div>
                    </div>
                  </div>
                </div>
                <div
                  class="d-flex align-items-center fs-6 mt-md-2 mb-2 mb-md-0 d-none d-sm-flex">
                  <i class="text-brand" data-lucide="map-pin"
                    style="stroke-width: 1.75px; width: 1.25rem;"></i>
                  <div class="ms-2 ">${ticket.event.location}</div>

                </div>
                <div>
                  <div
                    class="ticket-status approved text-nowrap d-block d-sm-none mt-3 text-center"
                    style="width: auto !important; ">${status}</div>
                </div>

              </div>
              <!-- Right side (Status) -->
              <div
                class="ticket-status ${classStatus} ms-auto text-nowrap d-none d-sm-block fw-semibold">${status}</div>

              <a id="btnTransaction" data-bs-toggle="tooltip" data-tickets='${JSON.stringify(ticket)}'  onclick="showTicket(this)"
              data-bs-placement="bottom"
              title="Display Ticket"
              data-bs-custom-class="custom-tooltip" class="btn btn-brand fw-semibold ms-3 rounded-circle align-items-center justify-content-center" style="width:2.75rem !important; height:2.75rem !important;"  type="button"><i data-lucide="ticket" style="stroke-width: 1.75px; width: 1.25rem;"></i><span class
              ="d-none"> Display Ticket</span></a>
            </button>
          </h2>

        </div>`
        lucide.createIcons();
      })
    }else{
      document.getElementById("owned-ticket-container").innerHTML = `<div class="text-center w-100 my-5">
              <img src="/img/noFound.png" alt="..." height="220px;">
              <h4 class="text-center text-brand mt-2">No Owned Ticket to Display</h4>
            </div>`
    }

    document.getElementById("owned-ticket-container").classList.remove('d-none');
    document.querySelector(".placeholder-content").classList.add('d-none');
    renderPaginationOwned(paginate)
    
  } catch (error) {
    console.log(error);
    showToast();
  }
}

getOwnedTicket()

getRequestTicket() 

function renderPaginationOwned(paginate) {
  const paginationNumbers = document.getElementById("pagination-numbers-owned");
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
    pageButton.onclick = () => changePageOwned(page);
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

  document.getElementById("prevOwnedBtn").disabled = currentPage === 1;
  document.getElementById("nextOwnedBtn").disabled = currentPage === totalPages;

  document.getElementById("prevOwnedBtn").onclick = () =>
    changePage(currentPage - 1);
  document.getElementById("nextOwnedBtn").onclick = () =>
    changePage(currentPage + 1);
}

async function changePageOwned(newPage) {
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set("page", newPage); // Update page parameter
  let status = document.getElementById("select-owned-ticket-status").value
  await getOwnedTicket(status,newPage); // Call renderEvents with new page
}
function renderPaginationRequest(paginate) {
  const paginationNumbers = document.getElementById("pagination-numbers-request");
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
    pageButton.onclick = () => changePageRequest(page);
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

  document.getElementById("prevRequestBtn").disabled = currentPage === 1;
  document.getElementById("nextRequestBtn").disabled = currentPage === totalPages;

  document.getElementById("prevRequestBtn").onclick = () =>
    changePage(currentPage - 1);
  document.getElementById("nextRequestBtn").onclick = () =>
    changePage(currentPage + 1);
}

async function changePageRequest(newPage) {
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set("page", newPage); // Update page parameter
  let status = document.getElementById("select-request-ticket-status").value
  await getRequestTicket(status,newPage); // Call renderEvents with new page
}

document.getElementById("select-owned-ticket-status").addEventListener("change", (e)=>{
  getOwnedTicket(e.target.value);
})

document.getElementById("select-request-ticket-status").addEventListener("change", (e)=>{
  getRequestTicket(e.target.value);
})

function showTransaction(el) {
    const ticketId = el.getAttribute("data-ticket-id");
    const obj = ticketDataManager.getTicket(ticketId);

  // console.log("click", obj);

  let checkTran = obj.ticket_type.price == 0 ? `` : `/uploads/transaction/${obj.transaction_img}`;

  document.getElementById("modal-body").innerHTML = `
      <span class="ticket-status badge rounded-pill ${obj.class_status} fw-medium text-capitalize">Status: 
      ${obj.status}</span>
      <br><br>

      <div class="alert alert-danger mb-2">${obj.reject_reason ? "Reject Reason: " + obj.reject_reason : ""}</div>

      

      <div class="shadow-sm border rounded-4 overflow-hidden">
      ${obj.ticket_type.price == 0 ? `` : `<img class="w-100 object-fit-cover" src="${checkTran}" alt="transaction">`}
        

        <div class="bg-light p-4 border-top">
          <h5 class="fw-meduim mb-3">Ticket Detail</h5>

          <div class="card-text fs-5 d-flex align-items-center justify-content-between mb-2">
            <small>Purchase Date</small>
            <small class="fw-medium">${moment(
              obj.purchase_date
            ).format("lll")}</small>
          </div>
          <div class="card-text fs-5 d-flex align-items-center justify-content-between mb-2">
            <small>Ticket Bought</small>
            <small class="fw-medium">${obj.qty}</small>
          </div>
          <div class="card-text fs-5 d-flex align-items-center justify-content-between mb-2">
            <small>Ticket Price</small>
            <small class="fw-medium">$${obj.ticket_type.price.toFixed(2)}</small>
          </div>
          <hr>
          <div class="card-text fs-5 d-flex align-items-center justify-content-between mb-2">
            <small>Total</small>
            <small class="fw-medium">$${obj.total.toFixed(2)}</small>
          </div>
        </div>
      </div>
  `;
}

function showTicket(el) {
  // Get the object from the data attribute
  const obj = JSON.parse(el.getAttribute("data-tickets"));

  // console.log("click", obj);



  document.getElementById("modal-content").innerHTML =   `<div
  class="modal-header py-1 px-md-4 w-100 text-white bg-brand d-flex align-items-center justify-content-between">

  <button type="button" onclick="downloadTicket()" data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="Download Ticket"
                                        data-bs-custom-class="custom-tooltip"
    class="btn btn-icon text-white shadow-none border-0">
    <i class="fa-solid fa-download text-white"></i>
  </button>

  <h4 class="modal-title fw-medium h5" id="exampleModalLabelTicket">
  ${obj.ticket_type}
  </h4>

  <button type="button"
    class="btn btn-icon text-white shadow-none border-0"
    data-bs-dismiss="modal" aria-label="Close">
    <i class="fa-solid fa-x text-white"></i>
  </button>

</div>

<div class="modal-body py-0 px-0" id="modal-body">

  <div class="row ticket">
    <!-- Left Side -->
    <div class="col-12 col-md-8 m-0">
      <div class="ticket-body">
        <div class="ticket-section d-flex flex-wrap">
          <img src="/img/Prutika_Logo_text(2).png"
            alt="PRUTTIKA logo" class="img-fluid me-3"
            style="width: 150px;">
          <div class="ticket-info">
            <h4>${obj.event.eng_name}</h4>
          </div>
        </div>
        <div class="ticket-section d-flex flex-wrap mt-3">
          <img src="/img/ticket.png" alt="Ticket Icon"
            class="img-fluid me-3" style="width: 50px;">
          <div class="ticket-info">
            <h5><span class="text-brand">$${obj.price.toFixed(2)}</span></h5>
            <div class="d-flex">
            <i class="bi bi-geo-alt text-brand me-1"></i> 
            <p>${obj.event.location}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="ticket-details p-3">
        <div class="d-flex flex-wrap">
          <div class="me-3">
            <h6>Start</h6>
            <p>${moment(
              obj.event.started_date
            ).format("ll")}</p>
          </div>
          <div class="me-3">
            <h6>End</h6>
            <p>${moment(
              obj.event.ended_date
            ).format("ll")}</p>
          </div>
          <div class="me-3">
            <h6>Time</h6>
            <p class="text-nowrap">${
              moment(
                obj.event.start_time,
                "HH:mm"
              ).format("LT") +
              " - " +
              moment(
                obj.event.end_time,
                "HH:mm"
              ).format("LT")
            }</p>
          </div>
          
        </div>
      </div>
    </div>
    <!-- Right Section -->
    <div class="col-12 col-md-4 text-center d-flex align-items-center justify-content-center">
      <div class="ticket-section qr-code">
        <img src="${obj.qr_code_img}" width="180px" alt="QR Code"
          class="img-fluid">
        <div class="d-flex">
          <i class="bi bi-telephone text-brand me-1"></i>
          <p class="mb-0"> ${obj.event.creator.phone}</p>
        </div>
      </div>
    </div>
  </div>
</div>`
}
