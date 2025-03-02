// const moment = require("moment");

    document.getElementById('searchInput').addEventListener('keyup', filterTable);
    // document.getElementById('dateFilter').addEventListener('change', filterTable);
    document.getElementById('statusFilter').addEventListener('change', filterTable);

    function filterTable() {
        const nameFilter = document.getElementById('searchInput').value.toLowerCase();
        // const dateFilter = document.getElementById('dateFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;

        const rows = document.querySelectorAll('#ticketTable tbody tr');

        rows.forEach(row => {
            const nameCell = row.cells[2].textContent.toLowerCase();
            const dateCell = row.cells[5].textContent;
            const statusCell = row.cells[6].textContent.trim();

            const matchesName = nameCell.includes(nameFilter);
            // const matchesDate = dateFilter ? dateCell.startsWith(dateFilter) : true;
            const matchesStatus = statusFilter ? statusCell.includes(statusFilter) : true;

            if (matchesName  && matchesStatus) {
                row.classList.remove("d-none")
            } else {
                row.classList.add("d-none")
            }
        });
    }

    let eventId = sessionStorage.getItem("event-request-ticket-list");

    async function getRequestTicketList(page=1, perpage=25) {
        let queryParams = new URLSearchParams()
        console.log(queryParams);
        queryParams.append("page", page)
        queryParams.append("per_page", perpage)
        queryParams.append("event_id", eventId)

        document.getElementById("request-tbody").innerHTML =""
        
        try {
            const {data} = await axiosInstance.get(`/tickets/request-ticket?${queryParams.toString()}`);
            const { data:event } = await axiosInstance.get(`/events/${eventId}`);

            console.log(event);
    
            document.getElementById("title").innerText = event.data.eng_name
            document.getElementById("ev-date").innerText = moment(event.data.started_date).format("llll")
            const {data:json, paginate} = data
            console.log(data);

            if(json.length ==0){
              document.getElementById("request-tbody").innerHTML = `<tr><td colspan="6"><div class="text-center w-100 my-5">
              <img src="/img/noFound.png" alt="..." height="220px;">
              <h4 class="text-center text-brand mt-2">No Request to Display</h4>
            </div></td></tr>`
            }
            

            json.forEach((r, i)=>{
                let statusClass = ""
                switch(r.status){
                    case "Approved": {
                        statusClass = "approved"
                        break;
                    }
                    case "Pending": {
                        statusClass = "pending"
                        break;
                    }
                    case "Rejected": {
                        statusClass = "rejected"
                        break;
                    }
                }
                document.getElementById("request-tbody").innerHTML += `<tr>
                    <td colspan="1" class="text-nowrap">${i+1}</td>
                    <td colspan="1" class="text-nowrap"><img width="60px" height="60px" class="border-brand rounded-circle" src="/uploads/${r.buyer.avatar ? r.buyer.avatar :"default.jpg"}"></img></td>
                    <td colspan="1" class="">${r.buyer.eng_name}</td>
                    <td colspan="1" class="text-nowrap">${r.ticket_qty} tickets</td>
                    <td colspan="1" class="text-nowrap">$${r.total_amount.toFixed(2)}</td>
                    <td colspan="1" class="text-nowrap">${moment(r.created_at).format('llll')}</td>
                    <td colspan="1" class="text-nowrap"><span class="badge ${statusClass}">${r.status}</span></td>
                    <td style="max-width: 340px;">
                        <div>
                            <button onclick="showTransaction(${r.transaction_id}, ${r.event_id})" type="button" class="btn btn-brand views-transaction" style="height: auto !important;"><i class="fa-solid fa-eye"></i></button>
                        </div>
                    </td>
                </tr>`
            })
            renderPagination(paginate)

            
        } catch (error) {
            showToast()
            console.log(error);
            
        }
    }

    getRequestTicketList()

 function showTransaction(id, eventid){
    sessionStorage.setItem("transaction_id", id)
    sessionStorage.setItem("event_transaction_id", eventid)
    window.location.href = "/event/request-transaction"
 }

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
  
    await getRequestTicketList(newPage); // Call renderEvents with new page
  }
  