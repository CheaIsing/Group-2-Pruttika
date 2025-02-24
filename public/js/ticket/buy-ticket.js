function toggleQRCode() {
  const qrCodeImage = document.getElementById("qrCodeImage");
  qrCodeImage.classList.toggle("d-none");
}
function previewFile() {
  const input = document.getElementById("paymentProof");
  const fileName = document.getElementById("fileName");

  if (input.files.length > 0) {
    fileName.textContent = input.files[0].name;
    document.getElementById("submitButton").disabled = false
  } else {
    fileName.textContent = "No file selected";
    document.getElementById("submitButton").disabled = true
  }
}
document.getElementById("submitButton").disabled = true

let events = JSON.parse(sessionStorage.getItem("event_obj")) 
// console.log(event);
let pricing = null;
// Get the current date and time
const eventDate = new Date(events.started_date);
const currentDate = new Date();
let eventStatus = null;



if (events.event_tickets.length > 1) {
  const numbers = events.event_tickets.map((et) => et.price);
  const minNumber = Math.min(...numbers);
  const maxNumber = Math.max(...numbers);

  pricing = `$${minNumber.toFixed(2)} - $${maxNumber.toFixed(2)}`;
} else if (events.event_tickets.length == 1) {
  pricing = `${
    events.event_tickets[0].price > 0
      ? `$${events.event_tickets[0].price.toFixed(2)}`
      : "Free Ticket"
  }`;
} else if (events.event_tickets.length == 0) {
  pricing = ``;
}

let categories = "";
events.event_categories.forEach((c, i) => {
  categories += `<span class="event-category pill${i + 1} fw-medium">${
    c.name
  }</span>`;
});
console.log(events);

const tickets = events.event_tickets

document.getElementById("ticketType").innerHTML = "";
tickets.forEach((ticket, i)=>{
  document.getElementById("ticketType").innerHTML += `
  <option ${i == 0 && "selected"} value='${ticket.id}'>${ticket.type}</option>`;
})


document.getElementById("event-card").innerHTML = `
<div class="event-card shadow-light-sm">
                               <div class="event-card-container flex-column">
                        <!-- Event Thumbnail -->
                        <div
                            class="event-thumbnail object-fit-cover d-flex justify-content-between w-100">
                            <img
                                class="img-fluid object-fit-cover"
                                src="/uploads/${events.thumbnail}"
                                alt="Event Image"/>
                            <div
                                class="event-thumbnail-overlay"></div>

                            <!-- Wishlist & Copy buttons -->

                            <!-- Event Type Tag -->
                            
                        </div>

                        <!-- Event Details -->
                        <div class="event-details">
                            <div
                                class="d-flex justify-content-between">

                                <h3
                                    class="event-title" style="color: #333;">${events.eng_name}</h3>
                                
                                
                            </div>
                            <p
                                class="event-description">${events.short_description}
                            </p>

                            <!-- Event Tags -->
                            <div
                                class="d-flex align-items-center justify-content-between mb-3 mt-2 mt-lg-0">
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
                                        class="fas fa-calendar-alt text-brand"></i>
                                    <span>${moment(
                                        events.started_date
                                      ).format("ll")}</span>
                                </div>
                                <div class="event-meta-item">
                                    <i
                                        class="fas fa-clock text-brand"></i>
                                    <span>${
                                        moment(
                                          events.start_time,
                                          "HH:mm"
                                        ).format("LT") +
                                        " - " +
                                        moment(
                                          events.end_time,
                                          "HH:mm"
                                        ).format("LT")
                                      }</span>
                                </div>

                            </div>

                            <div class="event-meta-item"
                                style="margin-bottom: 0.75rem !important;">
                                <i
                                    class="fas fa-map-marker-alt text-brand"></i>
                                <p
                                    class="text-1-line mb-0">${events.location}</p>
                                <div
                                    class=" text-brand fw-medium"
                                    style="border-color: var(--c-brand) !important;">

                                </div>

                            </div>
                            <div class="event-meta-item">
                                <i
                                    class="fa-solid fa-tag text-brand"></i><span
                                    class>${pricing}</span>

                            </div>

                            <!-- Event Price -->

                            <!-- Creator Profile -->
                            <div class="creator-profile d-none">
                                <div class="creator-avatar">
                                    <img
                                        src="/public/img/Default_pfp.jpg"
                                        alt="Creator" />
                                </div>
                                <a href="#"
                                    class="creator-name">Hosted
                                    by John Doe</a>
                            </div>
                        </div>
                    </div>
</div>
`

document.getElementById("submitButton").addEventListener("click", async (e)=>{
    const input = document.getElementById("paymentProof");
    const fileName = document.getElementById("fileName");
  
    if (input.files.length > 0) {
      fileName.textContent = input.files[0].name;
      document.getElementById("submitButton").disabled = false
    } else {
      fileName.textContent = "No file selected";
      document.getElementById("submitButton").disabled = true
    }

    const frmData = {
        ticket_type_id : document.getElementById("ticketType").value,
        quantity : document.getElementById("ticketQuantity").value,
        event_id : events.id
    }

    const transactionFile = new FormData();
    transactionFile.append("transaction_file", input.files[0]);

    try {
      btnShowLoading("submitButton")
        const {data} = await axiosInstance.post("/tickets/request-ticket", frmData);
        const {data: transaction} = data
        const id = transaction.insertId
        
        await axiosInstance.post("/tickets/transaction-file/"+id, transactionFile);

        showToast(true, "Purchase ticket has submitted. Please wait for confirmation from organizer.")
    } catch (error) {
        showToast();
        console.log(error);
        
    }finally{
      btnCloseLoading("submitButton", "Submit Purchase")
      document.getElementById("submitButton").disabled = true
    }
})