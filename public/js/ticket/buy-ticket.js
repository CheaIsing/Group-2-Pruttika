let events = JSON.parse(sessionStorage.getItem("event_obj")) 
if(!events){
  window.location.href = "/event/browse"
}

function toggleQRCode() {
  const qrCodeImage = document.getElementById("qrCodeImage");
  qrCodeImage.classList.toggle("d-none");
}
function previewFile() {
  const input = document.getElementById("paymentProof");
  // const fileName = document.getElementById("fileName");

  if (input.files.length > 0) {
    // fileName.textContent = input.files[0].name;
    document.getElementById("submitButton").disabled = false
  } else {
    // fileName.textContent = "No file selected";
    document.getElementById("submitButton").disabled = true
  }
}
function previewImage() {
  const file = document.getElementById("paymentProof").files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
          const preview = document.getElementById('preview');
          preview.src = e.target.result;
          preview.classList.remove('d-none');
      };
      reader.readAsDataURL(file);
      document.getElementById("submitButton").disabled = false
  }else{
    document.getElementById("submitButton").disabled = true
  }
}
document.getElementById("submitButton").disabled = true

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
  pricing = `${events.event_tickets[0].price > 0 ? `$${events.event_tickets[0].price.toFixed(2)}` : "Free Ticket"}`;
} else if (events.event_tickets.length == 0) {
  pricing = ``;
}

let categories = "";
events.event_categories.forEach((c, i) => {
  categories += `<span class="event-category pill${i + 1} fw-medium">${
    c.name
  }</span>`;
});
// console.log(events);

const tickets = events.event_tickets;

document.getElementById("ticketType").innerHTML = "";
let allTicketsSoldOut = true; // Assume all are sold out initially

tickets.forEach((ticket, i) => {
    let isDisabled = "";
    let soldOutText = "";

    if (ticket.ticket_bought >= ticket.capacity) {
        isDisabled = "disabled";
        soldOutText = isEnglish ? " - Sold Out" : " - លក់អស់";
    } else {
        allTicketsSoldOut = false; // At least one ticket is available
    }

    document.getElementById("ticketType").innerHTML += `
        <option data-remain="${ticket.ticket_opacity - ticket.ticket_bought}" ${i == 0 && "selected"} value='${ticket.id}' ${isDisabled}>${ticket.type} - $${ticket.price.toFixed(2)}${' ' + soldOutText }</option>
    `;
    if(i==0){
      document.getElementById("remain-ticket").innerText = ticket.ticket_opacity - ticket.ticket_bought
    }
});

let submitButton = document.getElementById("submitButton"); // Assuming you have a submit button with this ID

if (allTicketsSoldOut) {
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = isEnglish ? "Sold Out" : "លក់អស់"; 
    }
}


document.getElementById("event-card").innerHTML = `
<div class="event-card shadow-light-sm">
                               <div class="event-card-container event-card-container-horizontal">
                        <!-- Event Thumbnail -->
                        <div
                            class="event-thumbnail object-fit-cover d-flex justify-content-between w-100" style="height: 300px !important;">
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
`

document.getElementById("qrCodeImage").src = `/uploads/${events.qr_img}`

document.getElementById("submitButton").addEventListener("click", async (e)=>{
    const input = document.getElementById("paymentProof");
    const fileName = document.getElementById("fileName");
  
    if (input.files.length > 0) {
      // fileName.textContent = input.files[0].name;
      document.getElementById("submitButton").disabled = false
    } else {
      // fileName.textContent = "No file selected";
      document.getElementById("submitButton").disabled = true
      return
    }

    const frmData = {
        ticket_type_id : document.getElementById("ticketType").value,
        quantity : document.getElementById("ticketQuantity").value,
        event_id : events.id
    }

    const validateResult = validateFile(input.files[0], 3);


    if(!(validateResult.valid)){
      document.querySelector(".upload-box").style.border = "2px dashed var(--bs-danger) !important";
      document.getElementById("invalid-qr-msg").classList.remove("d-none");
      document.querySelector("#invalid-qr-msg span").innerText = validateResult.message;
      return
    }

    document.querySelector(".upload-box").style.border = "2px dashed var(--c-brand) !important";
    document.getElementById("invalid-qr-msg").classList.add("d-none");

    const transactionFile = new FormData();
    transactionFile.append("transaction_file", input.files[0]);


    try {
      btnShowLoading("submitButton")
        const {data} = await axiosInstance.post("/tickets/request-ticket", frmData);
        const {data: transaction} = data
        const id = transaction.insertId
        
        await axiosInstance.post("/tickets/transaction-file/"+id, transactionFile);

        showToast(true, isEnglish ? "Purchase ticket has submitted. Please wait for confirmation from organizer." : "ការទិញសំបុត្រត្រូវបានដាក់ស្នើ។ សូមរង់ចាំការបញ្ជាក់ពីអ្នករៀបចំ")

        setTimeout(()=>{
          window.location.href = "/event/detail"
        }, 1200)
    } catch (error) {
      if(error?.response?.data?.message){
        showToast(false, error?.response?.data?.message)
        return
      }
        showToast();
        // console.log(error);
        
    }finally{
      btnCloseLoading("submitButton", isEnglish ? "Submit Purchase" : "ដាក់ស្នើការទិញ")
      // document.getElementById("submitButton").disabled = true
    }
})

document.getElementById("ticketType").onchange = (e)=>{
  const selectedOption = e.target.options[e.target.selectedIndex];
  // console.log(selectedOption);
  
  document.getElementById("remain-ticket").innerText = selectedOption.dataset.remain
  // console.log(e.target.querySelector("option[selected]").dataset.remain);

  
  calculateTotal()
}
document.getElementById("ticketQuantity").onclick = (e)=>{
  calculateTotal()
}

function calculateTotal(){
  const selectElement = document.querySelector("#ticketType");
const selectedText = selectElement.options[selectElement.selectedIndex].innerText;
const match = selectedText.match(/\d+\.\d{2}/); // Matches a number with two decimal places

if (match) {
    const price = parseFloat(match[0]); // Convert to a number
    const subtotal = parseFloat(document.getElementById("ticketQuantity").value) * price;

    document.getElementById("subTotal").innerText = `$${subtotal.toFixed(2)}`;

    document.getElementById("total").innerText = `$${subtotal.toFixed(2)}`;

}
}