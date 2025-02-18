let ticketCount = 0;
const ticketWrapper = document.getElementById("ticket-wrapper");
const toggleTicketBtn = document.getElementById("toggle-ticket-btn");
const customTicketSection = document.getElementById("custom-ticket-section");
const defaultTicket = document.getElementById("default-ticket");
let thumbnailUrl = "";
let qrImgUrl = "";
let arrDeleteAgenda = [];
let arrDeleteTicketCategory = [];
let defaultTicketId = null;
let arrTicketCategoryCustom = [];
let arrTicketCategoryDefault = [];
let eventType = null;
let updateEventId = sessionStorage.getItem("event-update-id") || 61;

// Function to toggle between default and custom ticket sections
toggleTicketBtn.addEventListener("click", function () {
  if (customTicketSection.style.display === "block") {
    // Switch to Custom Ticket Category Mode
    customTicketSection.style.display = "none";
    defaultTicket.style.display = "block";

    toggleTicketBtn.innerHTML = ` ${
      arrTicketCategoryCustom.length > 0
        ? `<i class="fa-solid fa-arrow-left"></i>&nbsp; Back to Your Own Ticket Categories`
        : '<i class="fa-solid fa-plus"></i>&nbsp; Create Your Own Ticket Categories'
    }`;

    if (arrTicketCategoryDefault.length > 0) {
      document.getElementById("defaultTicketCategoryId").value =
        arrTicketCategoryDefault[0].id;
      document.getElementById("defaultTicketPrice").value =
        arrTicketCategoryDefault[0].price || 0;
      document.getElementById("defaultTicketCapacity").value =
        arrTicketCategoryDefault[0].ticket_opacity || 0;
    }
  } else {
    // Switch Back to Default Ticket Category Mode
    defaultTicket.style.display = "none";
    customTicketSection.style.display = "block";
    toggleTicketBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i>&nbsp; Back to Default Ticket Category`;
    ticketWrapper.innerHTML = "";
    ticketCount = 0;

    if (arrTicketCategoryCustom.length > 0) {
      arrTicketCategoryCustom.forEach((ticket) => {
        createExistingTicketCategory(ticket);
      });
    }else{
      createNewTicketCategory()
    }
  }
});

function createNewTicketCategory() {
  ticketCount++;
  let ticketContainer = document.createElement("div");
  ticketContainer.className = "ticket-container mb-4";
  ticketContainer.id = `ticket${ticketCount}`;

  ticketContainer.innerHTML = `
        <div class="d-flex align-items-center justify-content-between mb-3 mt-4">
            <h5 class="fw-semibold text-brand mb-0">Ticket Category ${ticketCount}</h5>
            <button class="btn btn-danger" onclick="deleteTicketCategory('ticket${ticketCount}')">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        <div class="">
            <label class="form-label fw-medium mb-2">Name</label>
            <div class="input-field input-field-setting mb-3" id="input-field-ticketCategoryName${ticketCount}">
                <i class="fa-regular fa-pen-to-square"></i>
                <input type="text" id="ticketCategoryName${ticketCount}" placeholder="e.g. VIP, Normal">
            </div>
            <div class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100" id="invalid_feedback_ticketCategoryName${ticketCount}">
                <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
                <div class="ms-2 ">Invalid email.</div>
            </div>
        </div>
        <div class="">
            <label class="form-label fw-medium mb-2">Price</label>
            <div class="input-field input-field-setting mb-3" id="input-field-ticketPrice${ticketCount}">
                <i class="fa-solid fa-dollar-sign"></i>
                <input type="number" id="ticketPrice${ticketCount}" placeholder="Enter price ($)">
            </div> 
            <div class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100" id="invalid_feedback_ticketPrice${ticketCount}">
                <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
                <div class="ms-2 ">Invalid email.</div>
            </div>
        </div>
        <div class="">
            <label class="form-label fw-medium mb-2">Capacity</label>
            <div class="input-field input-field-setting mb-3" id="input-field-ticketCapacity${ticketCount}">
                <i class="fa-solid fa-ticket"></i>
                <input type="number" id="ticketCapacity${ticketCount}" placeholder="Enter ticket capacity">
            </div>
            <div class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100" id="invalid_feedback_ticketCapacity${ticketCount}">
                <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
                <div class="ms-2 ">Invalid email.</div>
            </div>
        </div>
    `;

  ticketWrapper.appendChild(ticketContainer);
}

// Function to delete a ticket category
function deleteTicketCategory(ticketId) {
  let ticketToRemove = document.getElementById(ticketId);

  if (ticketToRemove) {
    if (ticketToRemove.querySelector('input[type="hidden"]')) {
      arrDeleteTicketCategory.push(
        Number(ticketToRemove.querySelector('input[type="hidden"]').value)
      );
    }
    // console.log(arrDeleteTicketCategory);

    ticketToRemove.remove();
    // If all custom tickets are removed, revert to Default Ticket Category mode
    if (document.querySelectorAll(".ticket-container").length == 0) {
      toggleTicketBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Create Your Own Ticket Categories`;
      customTicketSection.style.display = "none";
      defaultTicket.style.display = "block";
      ticketCount = 0;
    } else {
      ticketCount = document.querySelectorAll(".ticket-container").length;

      document.querySelectorAll(".ticket-container").forEach((ticket, i) => {
        let id = ticket.id.replace("ticket", "");
        let title = document.getElementById(`ticketCategoryName${id}`).value;
        let price = document.getElementById(`ticketPrice${id}`).value;
        let capacity = document.getElementById(`ticketCapacity${id}`).value;

        ticket.id = `ticket${i + 1}`;

        ticket.innerHTML = `
            <div class="d-flex align-items-center justify-content-between mb-3 mt-4">
            <h5 class="fw-semibold text-brand mb-0">Ticket Category ${
              i + 1
            }</h5>
            <button class="btn btn-danger" onclick="deleteTicketCategory('ticket${
              i + 1
            }')">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        <div class="">
        ${
          ticket.querySelector('input[type="hidden"]')
            ? `<input type="hidden" value="${
                ticket.querySelector('input[type="hidden"]').value
              }" id="ticketId${i + 1}">`
            : ""
        }
            <label class="form-label fw-medium mb-2">Name</label>
            <div class="input-field input-field-setting mb-3" id="input-field-ticketCategoryName${
              i + 1
            }">
                <i class="fa-regular fa-pen-to-square"></i>
                <input type="text" id="ticketCategoryName${
                  i + 1
                }" value="${title}" placeholder="e.g. VIP, Normal">
            </div>
            <div class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100" id="invalid_feedback_ticketCategoryName${
              i + 1
            }">
                <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
                <div class="ms-2 ">Invalid email.</div>
            </div>
        </div>
        <div class="">
            <label class="form-label fw-medium mb-2">Price</label>
            <div class="input-field input-field-setting mb-3" id="input-field-ticketPrice${
              i + 1
            }">
                <i class="fa-solid fa-dollar-sign"></i>
                <input type="number" id="ticketPrice${
                  i + 1
                }" value="${price}" placeholder="Enter price ($)">
            </div> 
            <div class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100" id="invalid_feedback_ticketPrice${
              i + 1
            }">
                <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
                <div class="ms-2 ">Invalid email.</div>
            </div>
        </div>
        <div class="">
            <label class="form-label fw-medium mb-2">Capacity</label>
            <div class="input-field input-field-setting mb-3" id="input-field-ticketCapacity${
              i + 1
            }">
                <i class="fa-solid fa-ticket"></i>
                <input type="number" id="ticketCapacity${
                  i + 1
                }" value="${capacity}" placeholder="Enter ticket capacity">
            </div>
            <div class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100" id="invalid_feedback_ticketCapacity${
              i + 1
            }">
                <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
                <div class="ms-2 ">Invalid email.</div>
            </div>
        </div>
            `;
      });
    }
  }
}

function populateTickets(tickets) {
  // Grab references to the sections/buttons

  // If exactly one ticket and its type is "General Admission"
  if (
    tickets.length === 0 ||
    (tickets.length === 1 && tickets[0].type === "General Admission")
  ) {
    // Show the default ticket section
    defaultTicket.style.display = "block";
    // Hide the toggle button (since we’re using default only)
    // toggleTicketBtn.style.display = "none";
    // Hide custom ticket section
    customTicketSection.style.display = "none";

    // Populate default ticket fields
    // (Assumes "ticket_opacity" is your capacity field)
    defaultTicketId = tickets[0].id;
    document.getElementById("defaultTicketCategoryId").value = tickets[0].id;
    document.getElementById("defaultTicketPrice").value = tickets[0].price || 0;
    document.getElementById("defaultTicketCapacity").value =
      tickets[0].ticket_opacity || 0;

    arrTicketCategoryDefault.push({
      id: tickets[0].id,
      price: tickets[0].price,
      ticket_opacity: tickets[0].ticket_opacity,
    });
  } else {
    // Otherwise, hide the default ticket section
    defaultTicket.style.display = "none";
    // Optionally hide or show the toggle button
    // If you want to skip toggling, hide it. Or show it if you want the user
    // to manually switch between default/custom modes. For simplicity:
    // toggleTicketBtn.style.display = "none";

    // Show the custom ticket section
    customTicketSection.style.display = "block";

    // Loop through each ticket in the array and create a custom ticket
    tickets.forEach((ticket) => {
      createExistingTicketCategory(ticket);
      arrTicketCategoryCustom.push(ticket);
    });
  }
}

function createExistingTicketCategory(ticketData = {}) {
  // Increment a counter for unique IDs
  ticketCount++;

  // Destructure the incoming data, providing defaults
  const { id = "", price = "", ticket_opacity = "", type = "" } = ticketData;

  // Create the container
  let ticketContainer = document.createElement("div");
  ticketContainer.className = "ticket-container mb-4";
  ticketContainer.id = `ticket${ticketCount}`;

  // Build the inner HTML, using the data to populate the fields
  ticketContainer.innerHTML = `
    <div class="d-flex align-items-center justify-content-between mb-3 mt-4">
      <h5 class="fw-semibold text-brand mb-0">Ticket Category ${ticketCount}</h5>
      <button class="btn btn-danger" onclick="deleteTicketCategory('ticket${ticketCount}')">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
    <input type="hidden" value="${id}" id="ticketId${ticketCount}" >
    <div class="">
      <label class="form-label fw-medium mb-2">Name</label>
      <div class="input-field input-field-setting mb-3" id="input-field-ticketCategoryName${ticketCount}">
        <i class="fa-regular fa-pen-to-square"></i>
        <input
          type="text"
          id="ticketCategoryName${ticketCount}"
          placeholder="e.g. VIP, Normal"
          value="${type}"
        >
      </div>
      <div
        class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100"
        id="invalid_feedback_ticketCategoryName${ticketCount}"
      >
        <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
        <div class="ms-2">Invalid name.</div>
      </div>
    </div>
    <div class="">
      <label class="form-label fw-medium mb-2">Price</label>
      <div class="input-field input-field-setting mb-3" id="input-field-ticketPrice${ticketCount}">
        <i class="fa-solid fa-dollar-sign"></i>
        <input
          type="number"
          id="ticketPrice${ticketCount}"
          placeholder="Enter price ($)"
          value="${price}"
        >
      </div>
      <div
        class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100"
        id="invalid_feedback_ticketPrice${ticketCount}"
      >
        <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
        <div class="ms-2">Invalid price.</div>
      </div>
    </div>
    <div class="">
      <label class="form-label fw-medium mb-2">Capacity</label>
      <div class="input-field input-field-setting mb-3" id="input-field-ticketCapacity${ticketCount}">
        <i class="fa-solid fa-ticket"></i>
        <input
          type="number"
          id="ticketCapacity${ticketCount}"
          placeholder="Enter ticket capacity"
          value="${ticket_opacity}"
        >
      </div>
      <div
        class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100"
        id="invalid_feedback_ticketCapacity${ticketCount}"
      >
        <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
        <div class="ms-2">Invalid capacity.</div>
      </div>
    </div>
  `;

  // Append to the wrapper
  ticketWrapper.appendChild(ticketContainer);
}

new TomSelect("#select-category", {
  maxItems: 3,
});
//         new TomSelect("#select-type",{
// 	maxItems: 1
// });
const toggleButton = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");

function toggleSidebar() {
  sidebar.classList.toggle("close");
  toggleButton.classList.toggle("rotate");

  closeAllSubMenus();
}

function toggleSubMenu(button) {
  if (!button.nextElementSibling.classList.contains("show")) {
    closeAllSubMenus();
  }

  button.nextElementSibling.classList.toggle("show");
  button.classList.toggle("rotate");

  if (sidebar.classList.contains("close")) {
    sidebar.classList.toggle("close");
    toggleButton.classList.toggle("rotate");
  }
}

function closeAllSubMenus() {
  Array.from(sidebar.getElementsByClassName("show")).forEach((ul) => {
    ul.classList.remove("show");
    ul.previousElementSibling.classList.remove("rotate");
  });
}

// Upload File in create event
let fileInput = document.getElementById("fileUpload");
let fileNameDisplay = document.getElementById("fileName");
let btnRemoveImgFile = document.getElementById("btnRemoveImgFile");
let imageDisplay = document.getElementById("imageDisplay");

// Update the file name display when a file is selected
fileInput.addEventListener("change", function () {
  if (fileInput.files.length > 0) {
    fileNameDisplay.textContent = fileInput.files[0].name;

    let reader = new FileReader();
    reader.onload = function (event) {
      imageDisplay.src = event.target.result; // Set the image source
      imageDisplay.style.display = "block"; // Display the image
    };
    reader.readAsDataURL(fileInput.files[0]); // Read the file as a data URL
  }
  document.getElementById("imgInputBtn").style.display = "none";
  document.getElementById("imgIcon").style.display = "none";
  btnRemoveImgFile.style.display = "block";
});

btnRemoveImgFile.addEventListener("click", function () {
  fileInput.value = "";
  imageDisplay.src = thumbnailUrl ? "/uploads/" + thumbnailUrl : "";
  imageDisplay.style.display = "block";
  // fileNameDisplay.textContent = 'No file chosen';
  btnRemoveImgFile.style.display = "none";
  document.getElementById("imgInputBtn").style.display = "block";
  document.getElementById("imgIcon").style.display = "block";
});

// style input ts
document.querySelectorAll(".ts-wrapper").forEach((input) => {
  input.classList.add(
    "input-field",
    "input-field-setting",
    "d-flex",
    "align-items-center"
  );
  input.id = "input-field-event-categories";
});
document.querySelectorAll(".ts-wrapper .ts-control").forEach((input) => {
  input.classList.add("border-0");
});

document.querySelector(".ts-wrapper .ts-control").classList.add("border-0");

// console.log(document.getElementById("select-category").selectedOptions);

const parent = document.querySelectorAll(".ts-wrapper.input-field"); // Get the parent element
// console.log(parent)
// if (!parent) return; // Ensure the parent exists
parent.forEach((p) => {
  const newNode = document.createElement("i"); // Create a new element
  newNode.classList.add("fa-solid", "fa-list");
  newNode.style.marginBottom = "2px";

  // Insert the new node as the first child
  p.insertBefore(newNode, p.firstChild);
});

// --------------------------------------------------------

// Upload photo in create event in description section
let khqrPhotoUpload = document.getElementById("khqrPhotoUpload");
let KhqrPhotoName = document.getElementById("KhqrPhotoName");
let btnRemoveKhqrImg = document.getElementById("btnRemoveKhqrImg");
let KhqrPhotoDisplay = document.getElementById("KhqrPhotoDisplay");

btnRemoveKhqrImg.style.display = "none";
KhqrPhotoDisplay.style.display = "none";
// Upload photo in create event in Ticket section (Khqr)
khqrPhotoUpload.addEventListener("change", function () {
  if (khqrPhotoUpload.files.length > 0) {
    KhqrPhotoName.textContent = khqrPhotoUpload.files[0].name;

    let reader = new FileReader();
    reader.onload = function (event) {
      KhqrPhotoDisplay.src = event.target.result; // Set the image source
      KhqrPhotoDisplay.style.display = "block"; // Display the image
    };
    reader.readAsDataURL(khqrPhotoUpload.files[0]); // Read the file as a data UR-L
    isSkipStepPayment = true;
  } else {
    isSkipStepPayment = false;
  }
  document.getElementById("khqrPhotoInputBtn").style.display = "none";
  document.getElementById("khqrPhotoIcon").style.display = "none";
  btnRemoveKhqrImg.style.display = "block";
});

function removeImageFile() {
  khqrPhotoUpload.value = ""; // Clear the file input
  KhqrPhotoName.textContent = "No file chosen";
}

btnRemoveKhqrImg.addEventListener("click", function () {
  khqrPhotoUpload.value = "";
  KhqrPhotoDisplay.src = qrImgUrl ? "/uploads/" + qrImgUrl : "";
  KhqrPhotoDisplay.style.display = "none";
  KhqrPhotoName.textContent = "No file chosen";
  btnRemoveKhqrImg.style.display = "none";
  document.getElementById("khqrPhotoInputBtn").style.display = "block";
  document.getElementById("khqrPhotoIcon").style.display = "block";
});
btnRemoveKhqrImg.click();
// Example usage:

document.addEventListener("DOMContentLoaded", function () {
  window.descQuill = new Quill("#editor", { theme: "snow" });
});

let agendaIdCounter = 0; // Keep track of the current agenda count
const agendaWrapper = document.getElementById("agenda-wrapper");

function createNewAgenda() {
  if (
    !document.getElementById("skipAgendaMessage").classList.contains("d-none")
  ) {
    document.getElementById("skipAgendaMessage").classList.add("d-none");
  }
  agendaIdCounter += 1; // Increment the counter to get a unique agenda ID

  let agendaContainer = document.createElement("div");
  agendaContainer.className = "agenda-container mb-4";
  agendaContainer.id = `agenda${agendaIdCounter}`; // Use the current counter for the ID

  agendaContainer.innerHTML = `
        <div class="d-flex align-items-center justify-content-between mb-3 mt-4">
            <h5 class="fw-semibold text-brand mb-0">Agenda ${agendaIdCounter}</h5>
            <button class="btn btn-danger" style="height:auto !important;" onclick="deleteAgenda('agenda${agendaIdCounter}')"><i class="fa-solid fa-trash"></i></button>
        </div>
        <div class="">
            <label for class="form-label fw-medium mb-2">Title</label>
            <div class="input-field input-field-setting agenda mb-3" id="input-field-agenda-title-${agendaIdCounter}">
                <i class="fa-regular fa-pen-to-square"></i>
                <input type="text" id="agendaTitle${agendaIdCounter}" placeholder="Title">
            </div>
            <div class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100" id="invalid_feedback_agendaTitle${agendaIdCounter}">
                <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
                <div class="ms-2 ">Invalid email.</div>
            </div>
        </div>
        <div class="">
            <label for class="form-label fw-medium mb-2">Description</label>
            <div class="input-field input-field-setting agenda mb-3" id="input-field-agenda-desc-${agendaIdCounter}">
                <i class="fa-regular fa-pen-to-square"></i>
                <input type="text" id="agendaDesc${agendaIdCounter}" placeholder="Description">
            </div>
            <div class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100" id="invalid_feedback_agendaDesc${agendaIdCounter}">
                <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
                <div class="ms-2 ">Invalid email.</div>
            </div>
        </div>
        <div class="row gx-4 gy-0">
            <div class="col-6 col-lg-4 col-xxl-3">
                <label for class="form-label fw-medium mb-2">Start Time</label>
                <div class="input-field input-field-setting border-2" id="input-field-agenda-start-time-${agendaIdCounter}">
                    <i class="fa-regular fa-pen-to-square"></i>
                    <input type="time" id="agendaStarttime${agendaIdCounter}" class="" autofocus />
                </div>
                <div class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100" id="invalid_feedback_agendaStarttime${agendaIdCounter}">
                    <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
                    <div class="ms-2 ">Invalid email.</div>
                </div>
            </div>
            <div class="col-6 col-lg-4 col-xl-3">
                <label for class="form-label fw-medium mb-2">End Time</label>
                <div class="input-field input-field-setting border-2" id="input-field-agenda-end-time-${agendaIdCounter}">
                    <i class="fa-regular fa-pen-to-square fw-light"></i>
                    <input type="time" id="agendaEndtime${agendaIdCounter}" class="" autofocus />
                </div>
                <div class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100" id="invalid_feedback_agendaEndtime${agendaIdCounter}">
                    <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
                    <div class="ms-2 ">Invalid email.</div>
                </div>
            </div>
        </div>
    `;

  agendaWrapper.appendChild(agendaContainer);
}

function deleteAgenda(agendaId) {
  let agendaToRemove = document.getElementById(agendaId);

  if (agendaToRemove) {
    // console.log(agendaToRemove.querySelector('input[type="hidden"]'));

    if (agendaToRemove.querySelector('input[type="hidden"]')) {
      arrDeleteAgenda.push(
        Number(agendaToRemove.querySelector('input[type="hidden"]').value)
      );
    }

    // console.log(arrDeleteAgenda);
    agendaToRemove.remove();
  }

  // After deleting all agendas, reset the agendaIdCounter to the last maximum agenda number
  if (document.querySelectorAll(".agenda-container").length === 0) {
    agendaIdCounter = 0; // Reset to start fresh
    if (
      document.getElementById("skipAgendaMessage").classList.contains("d-none")
    ) {
      document.getElementById("skipAgendaMessage").classList.remove("d-none");
    }
  } else {
    agendaIdCounter = document.querySelectorAll(".agenda-container").length;
    document.querySelectorAll(".agenda-container").forEach((agenda, i) => {
      // console.log(agenda);
      let id = agenda.id.replace("agenda", "");
      let title = document.getElementById(`agendaTitle${id}`).value;
      let description = document.getElementById(`agendaDesc${id}`).value;
      let startTime = document.getElementById(`agendaStarttime${id}`).value;
      let endTime = document.getElementById(`agendaEndtime${id}`).value;

      agenda.id = `agenda${i + 1}`;
      agenda.innerHTML = `
            <div class="d-flex align-items-center justify-content-between mb-3 mt-4">
            <h5 class="fw-semibold text-brand mb-0">Agenda ${i + 1}</h5>
            <button class="btn btn-danger" style="height:auto !important;" onclick="deleteAgenda('agenda${
              i + 1
            }')"><i class="fa-solid fa-trash"></i></button>
        </div>
        ${
          agenda.querySelector('input[type="hidden"]')
            ? `<input type="hidden" value="${
                agenda.querySelector('input[type="hidden"]').value
              }" id="agendaId${i + 1}">`
            : ""
        }
        
        <div class="">
            <label for class="form-label fw-medium mb-2">Title</label>
            <div class="input-field input-field-setting agenda mb-3" id="input-field-agenda-title-${
              i + 1
            }">
                <i class="fa-regular fa-pen-to-square"></i>
                <input type="text" id="agendaTitle${
                  i + 1
                }" value="${title}" placeholder="Title">
            </div>
            <div class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100" id="invalid_feedback_agendaTitle${
              i + 1
            }">
                <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
                <div class="ms-2 ">Invalid email.</div>
            </div>
        </div>
        <div class="">
            <label for class="form-label fw-medium mb-2">Description</label>
            <div class="input-field input-field-setting agenda mb-3" id="input-field-agenda-desc-${
              i + 1
            }">
                <i class="fa-regular fa-pen-to-square"></i>
                <input type="text" id="agendaDesc${
                  i + 1
                }" value="${description}" placeholder="Description">
            </div>
            <div class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100" id="invalid_feedback_agendaDesc${
              i + 1
            }">
                <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
                <div class="ms-2 ">Invalid email.</div>
            </div>
        </div>
        <div class="row gx-4 gy-0">
            <div class="col-6 col-lg-4 col-xxl-3">
                <label for class="form-label fw-medium mb-2">Start Time</label>
                <div class="input-field input-field-setting border-2" id="input-field-agenda-start-time-${
                  i + 1
                }">
                    <i class="fa-regular fa-pen-to-square"></i>
                    <input type="time" id="agendaStarttime${
                      i + 1
                    }" value="${startTime}" class="" autofocus />
                </div>
                <div class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100" id="invalid_feedback_agendaStarttime${
                  i + 1
                }">
                    <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
                    <div class="ms-2 ">Invalid email.</div>
                </div>
            </div>
            <div class="col-6 col-lg-4 col-xl-3">
                <label for class="form-label fw-medium mb-2">End Time</label>
                <div class="input-field input-field-setting border-2" id="input-field-agenda-end-time-${
                  i + 1
                }">
                    <i class="fa-regular fa-pen-to-square fw-light"></i>
                    <input type="time" id="agendaEndtime${
                      i + 1
                    }" value="${endTime}" class="" autofocus />
                </div>
                <div class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100" id="invalid_feedback_agendaEndtime${
                  i + 1
                }">
                    <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
                    <div class="ms-2 ">Invalid email.</div>
                </div>
            </div>
        </div>
            `;
      // console.log(i);
    });
  }
}

const progress = (value) => {
  document.getElementsByClassName("progress-bar")[0].style.width = `${value}%`;
};

let step = document.getElementsByClassName("step");
let prevBtn = document.getElementById("prev-btn");
let nextBtn = document.getElementById("next-btn");
let submitBtn = document.getElementById("submit-btn");
let form = document.getElementsByTagName("form")[0];
let preloader = document.getElementById("preloader-wrapper");
let bodyElement = document.querySelector("body");
let succcessDiv = document.getElementById("success");
let isSkipStepPayment = false;
let isSkipTickets = false;

const inPersonRadio = document.getElementById("inPerson");
const onlineRadio = document.getElementById("online");
const onlineMessage = document.getElementById("onlineMessage");

function toggleMessage() {
  if (onlineRadio.checked) {
    onlineMessage.classList.remove("d-none"); // Show message
  } else {
    onlineMessage.classList.add("d-none"); // Hide message
  }
}

function createExistingAgenda(agendaData = {}) {
  // If you have a skip message you want to hide:
  const skipAgendaMessage = document.getElementById("skipAgendaMessage");
  if (skipAgendaMessage && !skipAgendaMessage.classList.contains("d-none")) {
    skipAgendaMessage.classList.add("d-none");
  }

  // Increment counter to get a unique ID
  agendaIdCounter += 1;

  // Destructure the data, defaulting to empty strings
  // console.log(agendaData);

  const {
    id = "",
    title = "",
    agendaDescription = "",
    agendaStart_time = "",
    agendaEnd_time = "",
  } = agendaData;

  // Convert "HH:MM:SS" to "HH:MM" for the time inputs
  const startTimeValue = agendaStart_time ? agendaStart_time.slice(0, 5) : "";
  const endTimeValue = agendaEnd_time ? agendaEnd_time.slice(0, 5) : "";

  // Create container
  const agendaContainer = document.createElement("div");
  agendaContainer.className = "agenda-container mb-4";
  agendaContainer.id = `agenda${agendaIdCounter}`;

  // Build the inner HTML, using the data for values
  agendaContainer.innerHTML = `
    <div class="d-flex align-items-center justify-content-between mb-3 mt-4">
      <h5 class="fw-semibold text-brand mb-0">Agenda ${agendaIdCounter}</h5>
      <button class="btn btn-danger" style="height:auto !important;" onclick="deleteAgenda('agenda${agendaIdCounter}')">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
    <input type="hidden" value="${id}" id="agendaId${agendaIdCounter}">
    <div class="">
      <label class="form-label fw-medium mb-2">Title</label>
      <div class="input-field input-field-setting agenda mb-3" id="input-field-agenda-title-${agendaIdCounter}">
        <i class="fa-regular fa-pen-to-square"></i>
        <input
          type="text"
          id="agendaTitle${agendaIdCounter}"
          placeholder="Title"
          value="${title}"
        >
      </div>
      <div
        class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100"
        id="invalid_feedback_agendaTitle${agendaIdCounter}"
      >
        <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
        <div class="ms-2 ">Invalid title.</div>
      </div>
    </div>
    <div class="">
      <label class="form-label fw-medium mb-2">Description</label>
      <div class="input-field input-field-setting agenda mb-3" id="input-field-agenda-desc-${agendaIdCounter}">
        <i class="fa-regular fa-pen-to-square"></i>
        <input
          type="text"
          id="agendaDesc${agendaIdCounter}"
          placeholder="Description"
          value="${agendaDescription}"
        >
      </div>
      <div
        class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100"
        id="invalid_feedback_agendaDesc${agendaIdCounter}"
      >
        <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
        <div class="ms-2 ">Invalid description.</div>
      </div>
    </div>
    <div class="row gx-4 gy-0">
      <div class="col-6 col-lg-4 col-xxl-3">
        <label class="form-label fw-medium mb-2">Start Time</label>
        <div class="input-field input-field-setting border-2" id="input-field-agenda-start-time-${agendaIdCounter}">
          <i class="fa-regular fa-pen-to-square"></i>
          <input
            type="time"
            id="agendaStarttime${agendaIdCounter}"
            value="${startTimeValue}"
          />
        </div>
        <div
          class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100"
          id="invalid_feedback_agendaStarttime${agendaIdCounter}"
        >
          <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
          <div class="ms-2 ">Invalid start time.</div>
        </div>
      </div>
      <div class="col-6 col-lg-4 col-xl-3">
        <label class="form-label fw-medium mb-2">End Time</label>
        <div class="input-field input-field-setting border-2" id="input-field-agenda-end-time-${agendaIdCounter}">
          <i class="fa-regular fa-pen-to-square fw-light"></i>
          <input
            type="time"
            id="agendaEndtime${agendaIdCounter}"
            value="${endTimeValue}"
          />
        </div>
        <div
          class="invalid_feedback text-danger d-flex align-items-center mb-2 w-100"
          id="invalid_feedback_agendaEndtime${agendaIdCounter}"
        >
          <i class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
          <div class="ms-2 ">Invalid end time.</div>
        </div>
      </div>
    </div>
  `;

  // Append to the wrapper
  agendaWrapper.appendChild(agendaContainer);
}

// Add event listeners
inPersonRadio.addEventListener("change", toggleMessage);
onlineRadio.addEventListener("change", toggleMessage);

toggleMessage();

async function getEventDetail() {
  try {
    await getCategories();

    const { data } = await axiosInstance.get(`/events/${updateEventId}`);
    const { data: json } = data;
    btnRemoveImgFile.click();

    thumbnailUrl = json.thumbnail;
    document.getElementById("imageDisplay").src = "/uploads/" + json.thumbnail;
    document.getElementById("imageDisplay").style.display = "block";

    qrImgUrl = json.qr_img;
    if (json.qr_img) {
      document.getElementById("KhqrPhotoDisplay").src =
        "/uploads/" + json.qr_img;
      document.getElementById("KhqrPhotoDisplay").style.display = "block";
    }

    document.getElementById("title").value = json.eng_name;

    document.querySelector(
      `input[name="event_type"][value="${json.event_type == "online" ? 1 : 2}"]`
    ).checked = true;
    eventType = json.event_type == "online" ? 1 : 2;

    let select = document.querySelector("#select-category");

    if (select.tomselect) {
      let selectedValues = json.event_categories.map((ec) => ec.id);

      console.log("Setting values:", selectedValues);

      select.tomselect.setValue(selectedValues);
    }

    document.getElementById("started-date").value = extractDate(
      json.started_date
    );
    document.getElementById("ended-date").value = extractDate(json.ended_date);
    document.getElementById("start-time").value = json.start_time;
    document.getElementById("end-time").value = json.end_time;
    document.getElementById("location").value = json.location;
    document.getElementById("short-description").value = json.short_description;
    descQuill.root.innerHTML = json.description;

    const agendas = json.event_agenda;

    if (agendas.length > 0) {
      agendas.forEach((agendaItem) => {
        createExistingAgenda(agendaItem);
      });
    }

    const tickets = json.event_tickets || [];

    arrTicketCategory = json.event_tickets;

    // Decide whether to show default or custom tickets
    if(tickets.length > 0){

      populateTickets(tickets);
    }

    // console.log(arrTicketCategoryDefault);
    // console.log(arrTicketCategoryCustom);

    if (customTicketSection.style.display === "block") {
      // Switch to Custom Ticket Category Mode
      defaultTicket.style.display = "none";
      toggleTicketBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i>&nbsp; Back to Default Ticket Category`;
    } else {
      // Switch Back to Default Ticket Category Mode
      defaultTicket.style.display = "block";
      toggleTicketBtn.innerHTML = `<i class="fa-solid fa-plus"></i>&nbsp; Create Your Own Ticket Categories`;
    }

    const publicOption = document.getElementById("publicOption");
    const privateOption = document.getElementById("privateOption");

    if (json.is_published) {
      publicOption.checked = true;
    } else {
      privateOption.checked = true;
    }

    console.log(json);
  } catch (error) {
    showToast();
    console.log(error);
  }
}
getEventDetail();
async function getCategories() {
  try {
    const result = await axiosInstance.get("/admin/event/category/view");
    const categories = result.data.data;
    // console.log(categories);

    // Assuming you've initialized TomSelect and stored the instance in a variable:
    const selectInstance = document.getElementById("select-category").tomselect;

    // Clear existing options (if needed)
    selectInstance.clearOptions();

    // Add new options using the API
    categories.forEach((c) => {
      selectInstance.addOption({ value: c.id, text: c.name });
    });

    // Refresh the options so they show up in the dropdown
    selectInstance.refreshOptions(false);
  } catch (error) {
    console.log(error);
    showToast();
  }
}

form.onsubmit = () => {
  return false;
};

let current_step = 0;
let stepCount = 8;
step[current_step].classList.add("d-block");
if (current_step == 0) {
  prevBtn.classList.add("d-none");
  submitBtn.classList.add("d-none");
  nextBtn.classList.add("d-inline-block");
}

document.getElementById("stepNumber").innerText = `Step ${
  current_step + 1
} of ${stepCount + 1}`;

nextBtn.addEventListener("click", () => {
  let isValidStep = checkStep();

  if (!isValidStep) return;

  current_step++;
  document.getElementById("stepNumber").innerText = `Step ${
    current_step + 1
  } of ${stepCount + 1}`;
  let previous_step = current_step - 1;
  if (current_step > 0 && current_step <= stepCount) {
    prevBtn.classList.remove("d-none");
    prevBtn.classList.add("d-inline-block");
    step[current_step].classList.remove("d-none");
    step[current_step].classList.add("d-block");
    step[previous_step].classList.remove("d-block");
    step[previous_step].classList.add("d-none");
    if (current_step == stepCount) {
      submitBtn.classList.remove("d-none");
      submitBtn.classList.add("d-inline-block");
      nextBtn.classList.remove("d-inline-block");
      nextBtn.classList.add("d-none");
    }
  } else {
    if (current_step > stepCount) {
      form.onsubmit = () => {
        return true;
      };
    }
  }
  progress((100 / stepCount) * current_step);
});

prevBtn.addEventListener("click", () => {
  if (current_step > 0) {
    current_step--;
    let previous_step = current_step + 1;
    prevBtn.classList.add("d-none");
    prevBtn.classList.add("d-inline-block");
    step[current_step].classList.remove("d-none");
    step[current_step].classList.add("d-block");
    step[previous_step].classList.remove("d-block");
    step[previous_step].classList.add("d-none");
    if (current_step < stepCount) {
      submitBtn.classList.remove("d-inline-block");
      submitBtn.classList.add("d-none");
      nextBtn.classList.remove("d-none");
      nextBtn.classList.add("d-inline-block");
      prevBtn.classList.remove("d-none");
      prevBtn.classList.add("d-inline-block");
    }
  }

  if (current_step == 0) {
    prevBtn.classList.remove("d-inline-block");
    prevBtn.classList.add("d-none");
  }
  progress((100 / stepCount) * current_step);
});

submitBtn.addEventListener("click", async () => {
  // preloader.classList.add("d-block");

  const thumbnail = document.getElementById("fileUpload").files[0];
  const eng_name = document.getElementById("title").value;
  const event_type = document.querySelector(
    'input[name="event_type"]:checked'
  )?.value;
  const event_categories = Array.from(
    document.getElementById("select-category").selectedOptions
  ).map((opt) => opt.value);
  const started_date = document.getElementById("started-date").value;
  const ended_date = document.getElementById("ended-date").value;
  const start_time = toHHMMFormat(document.getElementById("start-time").value);
  const end_time = toHHMMFormat(document.getElementById("end-time").value);
  const location =
    event_type == 2 ? document.getElementById("location").value : null;
  const short_description = document.getElementById("short-description").value;
  const description = descQuill.root.innerHTML.trim();
  const agenda = agendas;
  const event_tickets = event_type == 2 ? tickets : [];
  const is_published =
    document.querySelector('input[name="publishStatus"]:checked').id ===
    "publicOption"
      ? 2
      : 1;
  const qr_img =
    event_type == 2
      ? document.getElementById("khqrPhotoUpload").files[0]
      : null;

  const event = {
    eng_name,
    event_type,
    event_categories,
    started_date,
    ended_date,
    start_time,
    end_time,
    location,
    short_description,
    description,
    agenda,
    event_tickets,
    is_published,
  };

  const eventThumbnail = new FormData();
  const eventQRImg = new FormData();
  if (thumbnail) {
    eventThumbnail.append("thumbnail", thumbnail);
  }

  if (qr_img) {
    eventQRImg.append("qr_img", qr_img);
  }

  console.log(event);

  // console.log(event);
  // console.log(eventThumbnail);
  // console.log(eventQRImg);

  try {
    btnShowLoading("submit-btn");

    const response1 = await axiosInstance.put(
      `/events/info/${updateEventId}`,
      event
    );
    console.log("Response 1:", response1);

    const uploadRequests = [];
    if (thumbnail) {
      uploadRequests.push(
        axiosInstance.post(`/events/thumbnail/${updateEventId}`, eventThumbnail)
      );
    }

    if (qr_img) {
      uploadRequests.push(
        axiosInstance.post(`/events/org-qr-img/${updateEventId}`, eventQRImg)
      );
    }

    await Promise.all(uploadRequests);

    if(arrDeleteAgenda.length > 0){
      arrDeleteAgenda.forEach(async (id)=>{
        await axiosInstance.delete(`/events/agenda/${id}`);
      })
    }

    if(arrDeleteTicketCategory.length > 0){
      arrDeleteTicketCategory.forEach(async (id)=>{
        await axiosInstance.delete(`/events/event-ticket-type/${id}`);
      })
    }

    if(customTicketSection.style.display === "none" && arrTicketCategoryCustom.length >0){
      arrTicketCategoryCustom.forEach(async(custom)=>{
        await axiosInstance.delete(`/events/event-ticket-type/${custom.id}`)
      })
    }else if(defaultTicket.style.display === "none" && arrTicketCategoryDefault.length > 0){
      arrTicketCategoryDefault.forEach(async(def)=>{
        await axiosInstance.delete(`/events/event-ticket-type/${def.id}`)
      })
    }

    showToast(true, "Update Event Successfully.");

    // setTimeout(()=>{

    //   window.location.href = "/event/create";
    // }, 1500)
  } catch (error) {
    showToast();
    console.error("Error:", error);
  } finally {
    btnCloseLoading("submit-btn", "Submit");
  }
});

let agendas = [];
let tickets = [];

function checkStep() {
  let fileUpload = document.getElementById("fileUpload");
  let thumbnailFileName = document.getElementById("fileName");
  let thumbnailUploadSection = document.getElementById(
    "thumbnail-upload-section"
  );

  let valid = false;

  // Allowed file types
  let allowPhotoType = ["image/jpeg", "image/png", "image/jpg"];
  let maxSize = 10 * 1024 * 1024; // 10MB

  switch (current_step) {
    case 0: {
      return true;
    }

    case 1: {
      // Get form values
      const eng_name = document.getElementById("title").value;
      const event_type = document.querySelector(
        'input[name="event_type"]:checked'
      )?.value;
      const event_categories = Array.from(
        document.getElementById("select-category").selectedOptions
      ).map((opt) => opt.value);
      // if (price == 0) {
      //   isSkipStepPayment = true;
      //   document
      //     .querySelector("#step-payment #skipKhqrMessage")
      //     .classList.remove("d-none");
      // } else {
      //   isSkipStepPayment = true;
      //   if (
      //     !document
      //       .querySelector("#step-payment #skipKhqrMessage")
      //       .classList.contains("d-none")
      //   ) {
      //     document
      //       .querySelector("#step-payment #skipKhqrMessage")
      //       .classList.add("d-none");
      //   }
      // }

      if (event_type == 1) {
        isSkipTickets = true;
        isSkipStepPayment = true;
        document.getElementById("block-location").style.display = "none";
        document.getElementById("stepEventDateLocation").innerText =
          "Event Date";
        document
          .querySelector("#step-payment #skipKhqrMessage")
          .classList.remove("d-none");
        if (
          document
            .getElementById("skipTicketMessage")
            .classList.contains("d-none")
        ) {
          document
            .getElementById("skipTicketMessage")
            .classList.remove("d-none");
        }

        document.getElementById("defaultTicketPrice").disabled = true;
        document.getElementById("defaultTicketCapacity").disabled = true;
        document.getElementById("toggle-ticket-btn").style.pointerEvents =
          "none";
        document.getElementById("khqrPhotoInputBtn").style.pointerEvents =
          "none";
      } else if (event_type == 2) {
        isSkipTickets = false;
        isSkipStepPayment = false;
        document.getElementById("block-location").style.display = "block";
        document.getElementById("stepEventDateLocation").innerText =
          "Event Date and Location";
        document.getElementById("defaultTicketPrice").disabled = false;
        document.getElementById("defaultTicketCapacity").disabled = false;
        document.getElementById("toggle-ticket-btn").style.pointerEvents =
          "auto";
        document.getElementById("khqrPhotoInputBtn").style.pointerEvents =
          "auto";
        if (
          !document
            .getElementById("skipTicketMessage")
            .classList.contains("d-none")
        ) {
          document.getElementById("skipTicketMessage").classList.add("d-none");
        }
        if (
          !document
            .querySelector("#step-payment #skipKhqrMessage")
            .classList.contains("d-none")
        ) {
          document
            .querySelector("#step-payment #skipKhqrMessage")
            .classList.add("d-none");
        }
      }

      const fieldsEventOverview = [
        {
          name: "title",
          id: "input-field-title",
          textErrorElement: "#invalid_feedback_title div",
          isInvalidClass: "is_invalid",
        },
        {
          name: "one category",
          id: "input-field-event-categories",
          textErrorElement: "#invalid_feedback_event_categories div",
          isInvalidClass: "is_invalid",
        },
      ];

      // Validate input data
      const { error } = vEventOverview.validate({
        eng_name,
        event_type,
        event_categories,
      });

      // Show validation errors
      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        handleErrorMessages(errorMessages, fieldsEventOverview);
        return false;
      }

      handleErrorMessages([], fieldsEventOverview);

      return true;
    }
    case 2: {
      // Get form values
      const started_date = document.getElementById("started-date").value;
      const ended_date = document.getElementById("ended-date").value;
      const start_time = document.getElementById("start-time").value;
      const end_time = document.getElementById("end-time").value;
      const location = document.getElementById("location").value;

      const formData = {
        started_date,
        ended_date,
        start_time,
        end_time,
        location,
      };

      if(eventType == 1){
        resultt = vEventDateOnline.validate(formData);
      }else if(eventType == 2){
        resultt = vEventDateAndLocation.validate(formData)
      }

      // Validate using Joi schema
      const { error } = resultt;

      // Define fields for displaying errors
      const fieldsEventDateLocation = [
        {
          name: "start date",
          id: "input-field-started-date",
          textErrorElement: "#invalid_feedback_started_date div",
          isInvalidClass: "is_invalid",
        },
        {
          name: "end date",
          id: "input-field-ended-date",
          textErrorElement: "#invalid_feedback_ended_date div",
          isInvalidClass: "is_invalid",
        },
        {
          name: "start time",
          id: "input-field-start-time",
          textErrorElement: "#invalid_feedback_start_time div",
          isInvalidClass: "is_invalid",
        },
        {
          name: "end time",
          id: "input-field-end-time",
          textErrorElement: "#invalid_feedback_end_time div",
          isInvalidClass: "is_invalid",
        },
        {
          name: "location",
          id: "input-field-location",
          textErrorElement: "#invalid_feedback_location div",
          isInvalidClass: "is_invalid",
        },
      ];

      // Show validation errors
      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        handleErrorMessages(errorMessages, fieldsEventDateLocation);
        return false;
      }

      handleErrorMessages([], fieldsEventDateLocation);

      return true;
    }

    case 3: {
      const short_description =
        document.getElementById("short-description").value;
      const description = descQuill.root.innerHTML.trim();

      const formData = {
        short_description,
        description: description.replace(/<[^>]*>?/gm, ""),
      };

      const { error } = vEventDescription.validate(formData);

      const fieldsEventDescription = [
        {
          name: "short description",
          id: "input-field-short-description",
          textErrorElement: "#invalid_feedback_short_description div",
          isInvalidClass: "is_invalid",
        },
        {
          name: "description detail",
          id: "input-field-description",
          textErrorElement: "#invalid_feedback_description div",
          isInvalidClass: "is_invalid",
        },
      ];

      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        handleErrorMessages(errorMessages, fieldsEventDescription);
        return false;
      }
      handleErrorMessages([], fieldsEventDescription);
      return true;
    }

    case 4: {
      agendas = [];
      let isValid = true;

      document.querySelectorAll(".agenda-container").forEach((agenda) => {
        let id = agenda.id.replace("agenda", "");
        let agendaId = document.getElementById(`agendaId${id}`)
          ? Number(document.getElementById(`agendaId${id}`).value)
          : "";
        let title = document.getElementById(`agendaTitle${id}`).value;
        let description = document.getElementById(`agendaDesc${id}`).value;
        let start_time = document.getElementById(`agendaStarttime${id}`).value;
        let end_time = document.getElementById(`agendaEndtime${id}`).value;

        // Define Joi schema validation
        const formData = {
          id: agendaId,
          title,
          description,
          start_time,
          end_time,
        };
        const { error } = vUpdateEventAgenda.validate(formData);

        // Define fields for displaying errors
        const fieldsEventAgenda = [
          {
            name: "title",
            id: `input-field-agenda-title-${id}`,
            textErrorElement: `#invalid_feedback_agendaTitle${id} div`,
            isInvalidClass: "is_invalid",
          },
          {
            name: "description",
            id: `input-field-agenda-desc-${id}`,
            textErrorElement: `#invalid_feedback_agendaDesc${id} div`,
            isInvalidClass: "is_invalid",
          },
          {
            name: "start time",
            id: `input-field-agenda-start-time-${id}`,
            textErrorElement: `#invalid_feedback_agendaStarttime${id} div`,
            isInvalidClass: "is_invalid",
          },
          {
            name: "end time",
            id: `input-field-agenda-end-time-${id}`,
            textErrorElement: `#invalid_feedback_agendaEndtime${id} div`,
            isInvalidClass: "is_invalid",
          },
        ];

        // Clear previous errors
        // document.getElementById(`invalid_feedback_agendaTitle${id}`).style.display = "none";
        // document.getElementById(`invalid_feedback_agendaDesc${id}`).style.display = "none";

        // Show validation errors
        if (error) {
          console.log(error);

          const errorMessages = error.details.map((detail) => detail.message);
          handleErrorMessages(errorMessages, fieldsEventAgenda);
          isValid = false;
        }

        if (isValid) {
          agendas.push({
            id: agendaId,
            title,
            description,
            start_time,
            end_time,
          });
        }
      });

      if (!isValid) {
        console.error("Validation failed. Please fill in all required fields.");
        return false;
      }

      // console.log(agendas);

      return true;
    }

    case 5: {
      tickets = [];

      if (isSkipTickets) {
        return true;
      }

      if (customTicketSection.style.display === "none") {
        let isValid = true;

        let id = document.getElementById("defaultTicketCategoryId")
          ? Number(document.getElementById("defaultTicketCategoryId").value)
          : "";
        let title = document.getElementById("defaultTicketCategoryName").value;
        let price = document.getElementById(`defaultTicketPrice`).value;
        let capacity = document.getElementById(`defaultTicketCapacity`).value;

        // Define Joi schema validation
        const formData = { id, type: title, price, ticket_opacity: capacity };
        const { error } = vUpdateEventTickets.validate(formData);

        // Define fields for displaying errors
        const fieldsEventTicket = [
          {
            name: "ticket type",
            id: `input-field-defaultTicketCategoryName`,
            textErrorElement: `#invalid_feedback_defaultTicketCategoryName div`,
            isInvalidClass: "is_invalid",
          },
          {
            name: "ticket price",
            id: `input-field-defaultTicketPrice`,
            textErrorElement: `#invalid_feedback_defaultTicketPrice div`,
            isInvalidClass: "is_invalid",
          },
          {
            name: "ticket capacity",
            id: `input-field-defaultTicketCapacity`,
            textErrorElement: `#invalid_feedback_defaultTicketCapacity div`,
            isInvalidClass: "is_invalid",
          },
        ];

        if (error) {
          console.log(error);

          const errorMessages = error.details.map((detail) => detail.message);
          handleErrorMessages(errorMessages, fieldsEventTicket);
          isValid = false;
        }

        if (isValid) {
          tickets.push({ type: title, price, ticket_opacity: capacity });
          if (price == 0) {
            isSkipStepPayment = true;
            document
              .querySelector("#step-payment #skipKhqrMessage")
              .classList.remove("d-none");
            document.getElementById("khqrPhotoInputBtn").style.pointerEvents =
              "none";
          } else {
            isSkipStepPayment = false;
            if (
              !document
                .querySelector("#step-payment #skipKhqrMessage")
                .classList.contains("d-none")
            ) {
              document
                .querySelector("#step-payment #skipKhqrMessage")
                .classList.add("d-none");
            }
            document.getElementById("khqrPhotoInputBtn").style.pointerEvents =
              "auto";
          }
        }

        // console.log(tickets);
        if (!isValid) {
          console.error(
            "Validation failed. Please fill in all required fields."
          );
          return false;
        }

        return true;
      } else {
        let isValid = true;

        document.querySelectorAll(".ticket-container").forEach((ticket) => {
          let id = ticket.id.replace("ticket", "");
          let ticketId = document.getElementById(`ticketId${id}`)
            ? `${Number(document.getElementById(`ticketId${id}`).value)}`
            : "";
          let title = document.getElementById(`ticketCategoryName${id}`).value;
          let price = document.getElementById(`ticketPrice${id}`).value;
          let capacity = document.getElementById(`ticketCapacity${id}`).value;

          // Define Joi schema validation
          const formData = {
            id: ticketId,
            type: title,
            price,
            ticket_opacity: capacity,
          };
          const { error } = vUpdateEventTickets.validate(formData);

          // Define fields for displaying errors
          const fieldsEventTicket = [
            {
              name: "ticket type",
              id: `input-field-ticketCategoryName${id}`,
              textErrorElement: `#invalid_feedback_ticketCategoryName${id} div`,
              isInvalidClass: "is_invalid",
            },
            {
              name: "ticket price",
              id: `input-field-ticketPrice${id}`,
              textErrorElement: `#invalid_feedback_ticketPrice${id} div`,
              isInvalidClass: "is_invalid",
            },
            {
              name: "ticket capacity",
              id: `input-field-ticketCapacity${id}`,
              textErrorElement: `#invalid_feedback_ticketCapacity${id} div`,
              isInvalidClass: "is_invalid",
            },
          ];

          if (error) {
            console.log(error);
            const errorMessages = error.details.map((detail) => detail.message);
            handleErrorMessages(errorMessages, fieldsEventTicket);
            isValid = false;
          }

          if (isValid) {
            tickets.push({
              id: ticketId,
              type: title,
              price,
              ticket_opacity: capacity,
            });
          }
        });

        // console.log(tickets);

        if (!isValid) {
          console.error(
            "Validation failed. Please fill in all required fields."
          );
          return false;
        }

        return true;
      }

      break;
    }
    case 6: {
      return true;
    }
    case 7: {
      return true;
      break;
    }
    default: {
      return true;
    }
  }

  return valid;
}
