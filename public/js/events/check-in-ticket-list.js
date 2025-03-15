// const moment = require("moment");
let eventId = sessionStorage.getItem("event-check-in-ticket-list");
if (!eventId) {
  window.location.href = "/event/manage-check-in";
}

document.getElementById("searchInput").addEventListener("keyup", filterTable);
// document.getElementById('dateFilter').addEventListener('change', filterTable);
// document.getElementById('statusFilter').addEventListener('change', filterTable);

const scanner = new Html5QrcodeScanner("reader", {
  fps: 10,
  qrbox: { width: 400, height: 400 },
  rememberLastUsedCamera: false,
});

scanner.render(success);
document.getElementById("reader").style.border = "0px solid transparent";
let scanningEnabled = true;

async function success(result) {
  if (!scanningEnabled) return;

  try {
      scanningEnabled = false;
      await axiosInstance.put("/events/check-in/", { ticketToken: result });

      showToast(true, getText("checkInSuccess"));
      getCheckInTicketList();

      setTimeout(() => {
          scanningEnabled = true;
      }, 3000);

  } catch (error) {
      console.log(error);
      if (!(error.response && error.response.data && typeof error.response.data === "object")) {
          return showToast();
      } else {
          showToast(false, getText(error.response.data.message));
      }
  }
}

// function error(err) {
//     console.error(err);
// }

function filterTable() {
  const nameFilter = document.getElementById("searchInput").value.toLowerCase();
  const dateFilter = document.getElementById("dateFilter").value;
  const statusFilter = document.getElementById("statusFilter").value;

  const rows = document.querySelectorAll("#ticketTable tbody tr");

  rows.forEach((row) => {
    const nameCell = row.cells[2].textContent.toLowerCase();
    // const dateCell = row.cells[5].textContent;
    // const statusCell = row.cells[6].textContent.trim();

    const matchesName = nameCell.includes(nameFilter);
    // const matchesDate = dateFilter ? dateCell.startsWith(dateFilter) : true;
    // const matchesStatus = statusFilter ? statusCell.includes(statusFilter) : true;

    if (matchesName) {
      row.classList.remove("d-none");
    } else {
      row.classList.add("d-none");
    }
  });
}

async function getCheckInTicketList(page = 1, perpage = 25) {
  let queryParams = new URLSearchParams();
  // console.log(queryParams);
  queryParams.append("page", page);
  queryParams.append("per_page", perpage);

  document.getElementById("request-tbody").innerHTML = "";

  try {
    const { data } = await axiosInstance.get(
      `/events/check-in-data/` + eventId
    );
    const { data: event } = await axiosInstance.get(`/events/${eventId}`);

    // console.log(event);
    const formattedDate = `${moment(event.data.started_date).format(
      "MMM D, YYYY"
    )} - ${moment(event.data.ended_date).format("MMM D, YYYY")}, ${moment(
      event.data.start_time,
      "HH:mm"
    ).format("LT")} - ${moment(event.data.end_time, "HH:mm").format("LT")}`;

    document.getElementById("title").innerText = event.data.eng_name;
    document.getElementById("ev-date").innerText = formattedDate;
    const { data: json } = data;
    // console.log(data);

    if (json.length == 0) {
      return (document.getElementById(
        "request-tbody"
      ).innerHTML = `<tr><td colspan="6"><div class="text-center w-100 my-5">
              <img src="/img/noFound.png" alt="..." height="220px;">
              <h4 class="text-center text-brand mt-2">${getText(
                "noCheckin"
              )}</h4>
            </div></td></tr>`);
    }

    json.forEach((r, i) => {
      document.getElementById("request-tbody").innerHTML += `<tr>
                <td colspan="1" class="text-nowrap">${i + 1}</td>
                <td colspan="1" class=""><img width="50px" height="50px" class="border-brand rounded-circle" src="/uploads/${
                  r.avatar ? r.avatar : "default.jpg"
                }"></img></td>
                <td colspan="1" class="">${r.eng_name}</td>
                <td colspan="1" class="text-nowrap">${r.type_name}</td>
                <td colspan="1" class="text-nowrap">${r.email}</td>
                <td colspan="1" class="text-nowrap">${moment(
                  r.created_at
                ).format("llll")}</td>
            </tr>`;
    });
    // renderPagination(paginate)
  } catch (error) {
    showToast();
    console.log(error);
  }
}

getCheckInTicketList();

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

  await getCheckInTicketList(newPage); // Call renderEvents with new page
}

document.getElementById("btn-checked-in").onclick = async () => {
  const fields = [
    {
      name: "token",
      id: "input-field-qrcode",
      textErrorElement: "#invalid_feedback_qrcode div",
      isInvalidClass: "is_invalid",
    },
  ];

  const schema = Joi.object({
    ticketToken: Joi.string()
      .required()
      .messages({
        "string.empty": getText("ticketTokenRequired"),
        "any.required": getText("ticketTokenRequired"),
      }),
  });

  const { error } = schema.validate({
    ticketToken: document.getElementById("qrcode").value,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    handleErrorMessages(errorMessages, fields);
    return;
  }

  handleErrorMessages([], fields);

  try {
    await axiosInstance.put("/events/check-in/", {
      ticketToken: document.getElementById("qrcode").value,
    });
    const disapproveModal = bootstrap.Modal.getInstance(
      document.getElementById("exampleModal")
    );
    disapproveModal.hide();
    showToast(true, getText("checkInSuccess"));
  } catch (error) {
    console.log(error);
    if (
      !(
        error.response &&
        error.response.data &&
        typeof error.response.data === "object"
      )
    ) {
      return showToast();
    }

    const messages = error.response.data.message;
    const errorMessages = Array.isArray(messages) ? messages : [messages];

    handleErrorMessages(errorMessages, fields);
  }
};
