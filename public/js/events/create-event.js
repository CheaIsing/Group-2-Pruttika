document.addEventListener("DOMContentLoaded", function () {
  window.descQuill = new Quill("#editor", { theme: "snow" });
});

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

// Add event listeners
inPersonRadio.addEventListener("change", toggleMessage);
onlineRadio.addEventListener("change", toggleMessage);

toggleMessage();

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
  const start_time = document.getElementById("start-time").value;
  const end_time = document.getElementById("end-time").value;
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
  eventThumbnail.append("thumbnail", thumbnail);

  if (qr_img) {
    eventQRImg.append("qr_img", qr_img);
  }

  // console.log(event);
  // console.log(eventThumbnail);
  // console.log(eventQRImg);

  try {
    btnShowLoading("submit-btn");
    const response1 = await axiosInstance.post("/events", event);
    console.log("Response 1:", response1);
    const eventId = response1.data.data.event_id;

    const uploadRequests = [
      axiosInstance.post(`/events/thumbnail/${eventId}`, eventThumbnail),
    ];

    if (qr_img) {
      uploadRequests.push(
        axiosInstance.post(`/events/org-qr-img/${eventId}`, eventQRImg)
      );
    }

    await Promise.all(uploadRequests);

    showToast(true, "Created Event Successfully.");


    location.href = "/event/create-event"
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
      if (fileUpload.files.length === 0) {
        // No file selected
        thumbnailUploadSection.style.border = "1px solid var(--bs-danger)";
        thumbnailUploadSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        fileUpload.focus();
        thumbnailFileName.innerHTML = `<span class="text-danger" >
          Thumbnail is required.
        </span>`;
        return false;
      }

      let file = fileUpload.files[0];

      if (!allowPhotoType.includes(file.type)) {
        // Invalid file type
        thumbnailUploadSection.style.border = "2px solid red";
        thumbnailUploadSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        fileUpload.focus();
        thumbnailFileName.innerHTML = `<span class="text-danger " >
          Invalid file type: <span class="text-black">${file.name}</span>. Only JPEG and PNG are allowed.
        </span>`;
        fileUpload.value = ""; // Reset input
        return false;
      }

      if (file.size > maxSize) {
        // File size too large
        thumbnailUploadSection.style.border = "2px solid red";
        thumbnailUploadSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        fileUpload.focus();
        thumbnailFileName.innerHTML = `<span class="text-danger fw-bolder">
          File size exceeds 10MB. Please upload a smaller file.
        </span>`;
        fileUpload.value = ""; // Reset input
        return false;
      }

      // Reset styles if valid
      thumbnailUploadSection.style.border = "none";
      thumbnailFileName.innerHTML = `<span class="text-success fw-bolder">
        File selected: <span class="text-black">${file.name}</span>
      </span>`;
      valid = true;
      break;
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

      // Validate using Joi schema
      const { error } = vEventDateAndLocation.validate(formData);

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
        let title = document.getElementById(`agendaTitle${id}`).value;
        let description = document.getElementById(`agendaDesc${id}`).value;
        let start_time = document.getElementById(`agendaStarttime${id}`).value;
        let end_time = document.getElementById(`agendaEndtime${id}`).value;

        // Define Joi schema validation
        const formData = { title, description, start_time, end_time };
        const { error } = vEventAgenda.validate(formData);

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
          const errorMessages = error.details.map((detail) => detail.message);
          handleErrorMessages(errorMessages, fieldsEventAgenda);
          isValid = false;
        }

        if (isValid) {
          agendas.push({ title, description, start_time, end_time });
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

        let title = document.getElementById("defaultTicketCategoryName").value;
        let price = document.getElementById(`defaultTicketPrice`).value;
        let capacity = document.getElementById(`defaultTicketCapacity`).value;

        // Define Joi schema validation
        const formData = { type: title, price, ticket_opacity: capacity };
        const { error } = vEventTickets.validate(formData);

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
          let title = document.getElementById(`ticketCategoryName${id}`).value;
          let price = document.getElementById(`ticketPrice${id}`).value;
          let capacity = document.getElementById(`ticketCapacity${id}`).value;

          // Define Joi schema validation
          const formData = { type: title, price, ticket_opacity: capacity };
          const { error } = vEventTickets.validate(formData);

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
            const errorMessages = error.details.map((detail) => detail.message);
            handleErrorMessages(errorMessages, fieldsEventTicket);
            isValid = false;
          }

          if (isValid) {
            tickets.push({ type: title, price, ticket_opacity: capacity });
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
      if (isSkipStepPayment) {
        return true;
      }
      let khqrPhotoUpload = document.getElementById("khqrPhotoUpload");
      let khqrPhotoName = document.getElementById("KhqrPhotoName");
      let khqrUploadSection = document.getElementById("khqr-upload-section");
      if (khqrPhotoUpload.files.length === 0) {
        // No file selected
        khqrUploadSection.style.border = "1px solid var(--bs-danger)";
        khqrUploadSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        khqrPhotoUpload.focus();
        khqrPhotoName.innerHTML = `<span class="text-danger" >
          Qr Image is required.
        </span>`;
        return false;
      }

      let file = khqrPhotoUpload.files[0];

      if (!allowPhotoType.includes(file.type)) {
        // Invalid file type
        khqrUploadSection.style.border = "2px solid red";
        khqrUploadSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        khqrPhotoUpload.focus();
        khqrPhotoName.innerHTML = `<span class="text-danger " >
          Invalid file type: <span class="text-black">${file.name}</span>. Only JPEG and PNG are allowed.
        </span>`;
        khqrPhotoUpload.value = ""; // Reset input
        return false;
      }

      if (file.size > maxSize) {
        // File size too large
        khqrUploadSection.style.border = "2px solid red";
        khqrUploadSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        khqrPhotoUpload.focus();
        khqrPhotoName.innerHTML = `<span class="text-danger fw-bolder">
          File size exceeds 10MB. Please upload a smaller file.
        </span>`;
        khqrPhotoUpload.value = ""; // Reset input
        return false;
      }

      // Reset styles if valid
      khqrUploadSection.style.border = "none";
      khqrPhotoName.innerHTML = `<span class="text-success fw-bolder">
        File selected: <span class="text-black">${file.name}</span>
      </span>`;
      valid = true;
      break;
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
