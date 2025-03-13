// const moment = require("moment");



let eventId = sessionStorage.getItem("event_transaction_id");
let transactionId = sessionStorage.getItem("transaction_id");
async function getTransaction() {


    eventId = Number(eventId);
    transactionId = Number(transactionId);

    try {
        

        const { data } = await axiosInstance.get(`/tickets/request-ticket?event_id=${eventId}`);
        const { data: json, paginate } = data;

        const result = json.find(obj => obj.transaction_id === transactionId && obj.event_id === eventId);

        let statusClass = ""
        let disble = null
                switch(result.status){
                    case "Approved": {
                        statusClass = "approved"
                        disble = true
                        break;
                    }
                    case "Pending": {
                        statusClass = "pending"
                        disble = false
                        break;
                    }
                    case "Rejected": {
                        statusClass = "rejected"
                        disble = true
                        break;
                    }
                }

        let transactionHtml = `<div class="col-12">
    <div class="mt-4 d-flex w-100 align-items-center justify-content-between">
        <div class="d-flex align-content-center">
            <div class="me-3 mb-4">
                <img src="/uploads/${result.buyer.avatar ? result.buyer.avatar : 'default.jpg'}" alt class="object-fit-cover rounded-circle" width="75" height="75" id="requester-avarta">
            </div>
            <div>
                <h5 class="mb-0" id="requester">${result.buyer.eng_name}</h5>
                <div>
                    <small id="request-date">${moment(result.created_at).format("llll")}</small>
                </div>
                <div>
                    <small>
                        <a href="mailto:${result.buyer.email}" class="text-decoration-none" style="color: inherit;" id="request-email">${result.buyer.email}</a>
                    </small>
                </div>
            </div>
        </div>
        <div class="d-flex">
            <button ${disble && "disabled"} id="btnApproved" type="button" class="btn btn-brand me-2" onclick="approveRequest(${result.transaction_id}, 'btnApproved')">Approve</button>
            <button ${disble && "disabled"} type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal">Disapprove</button>
        </div>
    </div>
</div>
<div class="col-12">
    <span class="badge fw-medium ${statusClass} rounded-5 mb-3 d-inline-block" style="font-size: 16px !important;">Status: ${result.status}</span>
    <p>Ticket Request Quantity : <span id="amount">${result.ticket_qty} tickets</span></p>
    <p>Price per ticket: <span id="price-unit">$${result.price.toFixed(2)}</span></p>
    <p>Total: <span id="total">$${result.total_amount.toFixed(2)}</span></p>
    <p id="label-Reject" class="w-25 ${!result.rejection_reason && "d-none"}">Reject Reason: ${result.rejection_reason}</p>
    <h5>Transaction File:</h5>
    <img src="${result.transaction_img ? `/uploads/transaction/${result.transaction_img}` : "/uploads/transaction/no-photo.png"}" class="border border-2" alt="transaction-img" id="transaction-img" width="400">
</div>
`


        console.log(result); 

        document.getElementById("row-transaction").innerHTML = transactionHtml

    } catch (error) {
        console.log(error);
        showToast();
    }
}

getTransaction()


async function approveRequest(id, btn){
    try {
        btnShowLoading(btn)
        await axiosInstance.put("/tickets/approve-req-ticket/"+ id)

        showToast(true, "Request Approved Successfully.")

        setTimeout(()=>{
            window.location.href = "/event/request-ticket-list"
        }, 1200)
    } catch (error) {
        console.log(error);
        showToast()
        
    }finally{
        btnCloseLoading(btn, "Approve")
        document.getElementById(btn).disabled =  true
    }
}

document.getElementById("btn-disapprove").onclick = async ()=>{
    const fields = [
        {
          name: "reject",
          id: "input-field-reject", // Ensure this matches your input field ID
          textErrorElement: "#invalid_feedback_reject div",
          isInvalidClass: "is_invalid",
        }
    ];

    const schema = Joi.object({
        rejected_reason: Joi.string()
            .min(10)
            .trim()
            .required()
            .messages({
                "string.min": "Reject Reason must be at least 10 characters long.",
                "string.empty": "Reject Reason is required.",
                "any.required": "Reject Reason is required."
            })
    });

    // Validate the input value
    const { error } = schema.validate({ rejected_reason: document.getElementById("reject").value });

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        handleErrorMessages(errorMessages, fields);
        return;
    }

    handleErrorMessages([], fields);

      try {
        await axiosInstance.put("/tickets/reject-req-ticket/" + transactionId, { rejected_reason: document.getElementById("reject").value });
        const disapproveModal = bootstrap.Modal.getInstance(
            document.getElementById("exampleModal")
          );
          disapproveModal.hide();
        showToast(true, "Request rejected successfully.")

       setTimeout(() => {
         window.location.href = "/event/request-ticket-list";
       }, 1200);
      } catch (error) {
        console.log(error);
        showToast()
      }
}