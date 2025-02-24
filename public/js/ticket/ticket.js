
const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

async function getRequestTicket( status="", page=1, perpage=10000000) {
  let queryParams = new URLSearchParams();


  queryParams.append("page", page);
  queryParams.append("perpage", perpage);
  queryParams.append("sort", "created_at");

  if (status) {
    queryParams.append("status", status);
  }
  try {
    const {data} = await axiosInstance.get(`/profile/own-request-ticket?${queryParams.toString()}`);
    const {data:tickets} = data;
    console.log(tickets);


    
    document.getElementById("requested-ticket-container").innerHTML = "";
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
        document.getElementById("requested-ticket-container").innerHTML += `
                <div
          class="accordion-item mb-3 rounded-4 overflow-hidden border-0 shadow-light-sm">
          <h2 class="accordion-header rounded-top-3"
            id="ticket1Header">
            <button class="accordion-button" data-ticket='${JSON.stringify(obj)}'  onclick="showTransaction(this)"
              type="button"
              data-bs-toggle="modal" data-bs-target="#exampleModal">
              <div style="max-width: 200px;" class="me-1 d-none d-md-block">
                <img src="/uploads/${ticket.event.thumbnail}"
                  style="max-width: 200px;" class="img-preview rounded-4"
                  alt="Image">
              </div>
              <!-- Left side (Title, Date, #Tickets) -->
              <div style="color: #4b5563;" class="ms-md-3">
                <h3 class="mb-3">${ticket.event.eng_name}</h3>
                <div class="mb-md-2 fs-5">
                  <div
                    class="d-flex align-items-md-center flex-column flex-md-row">
                    <div
                      class="d-flex align-items-center fs-5 me-md-4 mb-2 mb-md-0
                ">
                      <i class="text-brand" data-lucide="calendar"
                        style="stroke-width: 1.75px; width: 1.25rem;"></i>
                      <div class="ms-2">${moment(
                        ticket.event.started_date
                      ).format("ll")}</div>
                    </div>
                    <div
                      class="d-flex align-items-center fs-5 mb-2 mb-md-0">
                      <i class="text-brand" data-lucide="ticket"
                        style="stroke-width: 1.75px; width: 1.25rem;"></i>
                      <div class="ms-2 ">${ticket.quantity} ${ticket.ticket_type.type_name}</div>
                    </div>
                  </div>
                </div>
                <div
                  class="d-flex align-items-center fs-5 mt-md-2 mb-2 mb-md-0 d-none d-sm-flex">
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

              <a id="btnTransaction"data-bs-toggle="tooltip" data-ticket='${JSON.stringify(obj)}'  onclick="showTransaction(this)"
              data-bs-placement="bottom"
              title="View Transaction"
              data-bs-custom-class="custom-tooltip" class="btn btn-brand btn-icon fw-semibold ms-3 px-3 rounded-circle d-none d-sm-flex" type="button"><i data-lucide="eye"></i></a>
            </button>
          </h2>

        </div>`
        lucide.createIcons();
      })
    }
    
  } catch (error) {
    console.log(error);
    showToast();
  }
}
async function getOwnedTicket( status="", page=1, perpage=10000000) {
  let queryParams = new URLSearchParams();


  queryParams.append("page", page);
  queryParams.append("perpage", perpage);
  queryParams.append("sort", "created_at");

  if (status) {
    queryParams.append("status", status);
  }
  try {
    const {data} = await axiosInstance.get(`/profile/own-ticket?${queryParams.toString()}`);
    const {data:tickets} = data;
    console.log(tickets);


    
    document.getElementById("owned-ticket-container").innerHTML = "";
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
          class="accordion-item mb-3 rounded-4 overflow-hidden border-0 shadow-light-sm">
          <h2 class="accordion-header rounded-top-3"
            id="ticket1Header">
            <button class="accordion-button" data-tickets='${JSON.stringify(ticket)}'  onclick="showTicket(this)"
              type="button"
              data-bs-toggle="modal" data-bs-target="#exampleModalTicket">
              <div style="max-width: 200px;" class="me-1 d-none d-md-block">
                <img src="/uploads/${ticket.event.thumbnail}"
                  style="max-width: 200px;" class="img-preview rounded-4"
                  alt="Image">
              </div>
              <!-- Left side (Title, Date, #Tickets) -->
              <div style="color: #4b5563;" class="ms-md-3">
                <h3 class="mb-3">${ticket.event.eng_name}</h3>
                <div class="mb-md-2 fs-5">
                  <div
                    class="d-flex align-items-md-center flex-column flex-md-row">
                    <div
                      class="d-flex align-items-center fs-5 me-md-4 mb-2 mb-md-0
                ">
                      <i class="text-brand" data-lucide="calendar"
                        style="stroke-width: 1.75px; width: 1.25rem;"></i>
                      <div class="ms-2">${moment(
                        ticket.event.started_date
                      ).format("ll")}</div>
                    </div>
                    <div
                      class="d-flex align-items-center fs-5 mb-2 mb-md-0">
                      <i class="text-brand" data-lucide="ticket"
                        style="stroke-width: 1.75px; width: 1.25rem;"></i>
                      <div class="ms-2 ">${ticket.ticket_type}</div>
                    </div>
                  </div>
                </div>
                <div
                  class="d-flex align-items-center fs-5 mt-md-2 mb-2 mb-md-0 d-none d-sm-flex">
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

              <a id="btnTransaction"data-bs-toggle="tooltip" data-tickets='${JSON.stringify(ticket)}'  onclick="showTicket(this)"
              data-bs-placement="bottom"
              title="View Transaction"
              data-bs-custom-class="custom-tooltip" class="btn btn-brand fw-semibold ms-3 rounded-circle align-items-center justify-content-center" style="width:3rem !important; height:3rem !important;"  type="button"><i data-lucide="ticket"></i><span class
              ="d-none"> Display Ticket</span></a>
            </button>
          </h2>

        </div>`
        lucide.createIcons();
      })
    }
    
  } catch (error) {
    console.log(error);
    showToast();
  }
}

getOwnedTicket()

getRequestTicket() 

document.getElementById("select-owned-ticket-status").addEventListener("change", (e)=>{
  getOwnedTicket(e.target.value);
})

document.getElementById("select-request-ticket-status").addEventListener("change", (e)=>{
  getRequestTicket(e.target.value);
})

function showTransaction(el) {
  // Get the object from the data attribute
  const obj = JSON.parse(el.getAttribute("data-ticket"));

  console.log("click", obj);

  document.getElementById("modal-body").innerHTML = `
      <span class="ticket-status badge rounded-pill ${obj.class_status} fw-medium text-capitalize">Status: 
      ${obj.status}</span>
      <br><br>

      <div class="shadow-sm border rounded-4 overflow-hidden">
        <img class="w-100 object-fit-cover" src="/uploads/transaction/${obj.transaction_img}" alt="transaction">

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

  console.log("click", obj);

  document.getElementById("modal-content").innerHTML = `<div class="modal-header py-1 px-md-4 w-100 text-white bg-brand d-flex align-items-center justify-content-between">

        <button type="button" class="btn btn-icon text-white shadow-none border-0">
          <i class="fa-solid fa-download text-white"></i>
        </button>

      <h4 class="modal-title fw-medium h5" id="exampleModalLabelTicket">
        ${obj.ticket_type}
      </h4>
    
      <button type="button" class="btn btn-icon text-white shadow-none border-0" 
      data-bs-dismiss="modal" aria-label="Close">
      <i class="fa-solid fa-x text-white"></i>
    </button>

    </div>
    
    <div class="modal-body py-0 px-0" id="modal-body">

      <div class="row ticket">
        <!-- Left Side -->
        <div class="col-lg-8 ticket-left">
          <div class="d-flex flex-column justify-content-between align-items-start h-100">
            <div class="">
              <img src="/img/Prutika_Logo_text(2).png" class="img-fluid mb-2" alt="" width="140px">
            <h2 class="fw-bold text-brand">${obj.event.eng_name}</h2>
            </div>
       
            <div class="mt-3 mt-md-0 w-100">
                <div class="w-100">
                  <div class="d-flex">
                    <i class="bi bi-calendar-event text-brand me-2"></i>
                    <p>${moment(
                      obj.event.started_date
                    ).format("ll")} - ${moment(
                      obj.event.ended_date
                    ).format("ll")}</p>
                  </div>
                  <div class="d-flex">
                    <i class="bi bi-clock text-brand me-2"></i>
                    <p> ${
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
                  <div class="d-flex">
                    <i class="bi bi-geo-alt text-brand me-2"></i> 
                    <p>${obj.event.location}</p>
                  </div>
                  <div class="d-flex">
                    <i class="bi bi-telephone text-brand me-2"></i>
                    <p class="mb-0"> ${obj.event.creator.phone}</p>
                  </div>
                </div>
                <!-- <div class="w-100">
                  
                <hr>
                <p class="mb-0 text-center text-brand">www.pruttika.com</p>
                </div> -->
            </div>
          </div>
        </div>
      
        <!-- Right Side -->
        <div class="col-lg-4 ticket-right">
          <div class=" d-flex flex-column justify-content-center">
            <p class="mb-0">${obj.ticket_type}</p>
          <h3 class="text-brand">$${obj.price.toFixed(2)}</h3>
          <div class="qr-code"></div>
          <small style="font-size: 10px;" class="wrap-text mt-3">${obj.qr_code}</small>
        </div>
          <!-- <h5>ADMISSION</h5> -->
          
          <!-- <hr>
          <p class="text-muted mb-0 text-brand">#YTFK2024</p> -->
          <!-- <hr />   -->
          <!-- <p class="small text-muted mb-0">PRUTTIKA Events</p> -->
        </div>
      </div>
    </div>
  `;
}
