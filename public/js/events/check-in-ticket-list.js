// const moment = require("moment");

document.getElementById('searchInput').addEventListener('keyup', filterTable);
// document.getElementById('dateFilter').addEventListener('change', filterTable);
// document.getElementById('statusFilter').addEventListener('change', filterTable);

function filterTable() {
    const nameFilter = document.getElementById('searchInput').value.toLowerCase();
    const dateFilter = document.getElementById('dateFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    const rows = document.querySelectorAll('#ticketTable tbody tr');

    rows.forEach(row => {
        const nameCell = row.cells[2].textContent.toLowerCase();
        // const dateCell = row.cells[5].textContent;
        // const statusCell = row.cells[6].textContent.trim();

        const matchesName = nameCell.includes(nameFilter);
        // const matchesDate = dateFilter ? dateCell.startsWith(dateFilter) : true;
        // const matchesStatus = statusFilter ? statusCell.includes(statusFilter) : true;

        if (matchesName ) {
            row.classList.remove("d-none")
        } else {
            row.classList.add("d-none")
        }
    });
}

let eventId = sessionStorage.getItem("event-check-in-ticket-list");

async function getCheckInTicketList(page=1, perpage=25) {
    let queryParams = new URLSearchParams()
    console.log(queryParams);
    queryParams.append("page", page)
    queryParams.append("per_page", perpage)

    document.getElementById("request-tbody").innerHTML =""
    
    try {
        const {data} = await axiosInstance.get(`/events/check-in-data/`+eventId);
        const { data:event } = await axiosInstance.get(`/events/${eventId}`);

        console.log(event);

        document.getElementById("title").innerText = event.data.eng_name
        document.getElementById("ev-date").innerText = moment(event.data.started_date).format("llll")
        const {data:json} = data
        console.log(data);
        

        json.forEach((r, i)=>{

            document.getElementById("request-tbody").innerHTML += `<tr>
                <td colspan="1" class="text-nowrap">${i+1}</td>
                <td colspan="1" class=""><img width="60px" height="60px" class="border-brand rounded-circle" src="/uploads/${r.avatar}"></img></td>
                <td colspan="1" class="">${r.eng_name}</td>
                <td colspan="1" class="text-nowrap">${r.type_name}</td>
                <td colspan="1" class="text-nowrap">${r.email}</td>
                <td colspan="1" class="text-nowrap">${moment(r.created_at).format('llll')}</td>
            </tr>`
        })
        // renderPagination(paginate)

        
    } catch (error) {
        showToast()
        console.log(error);
        
    }
}

getCheckInTicketList()


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

document.getElementById("prevBtn").onclick = () => changePage(currentPage - 1);
document.getElementById("nextBtn").onclick = () => changePage(currentPage + 1);
}


async function changePage(newPage) {
const queryParams = new URLSearchParams(window.location.search);
queryParams.set("page", newPage); // Update page parameter

await getCheckInTicketList(newPage); // Call renderEvents with new page
}
