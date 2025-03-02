async function getSummary() {
  let eventId = sessionStorage.getItem("event-summary");

  const { data } = await axiosInstance.get("/events/summary-data/" + eventId);
  console.log(data);
  const {data:json} = data
  const totalEarnings = json.ticket.reduce(
    (acc, t) => acc + t.price * t.ticket_bought,
    0,
  );

  document.getElementById("event-title").innerText = json.eng_name;
  document.getElementById("event-date").innerText = moment(
    json.started_date
  ).format("LLLL");
  document.getElementById("event-type").innerText = json.event_type == 1 ? "Online Event" : "In Person Event"

  document.getElementById("ticket-sold").innerText = json.ticket.reduce(
    (sum, ticket) => sum + ticket.ticket_bought,
    0
  );
  document.getElementById("ticket-earning").innerText = `$${totalEarnings.toFixed(2)}`
  document.getElementById("participated").innerText = json.total_checkin + " attendant"
  document.getElementById("not-participated").innerText = (json.total_approved_registrations - json.total_checkin) + " attendant"

  document.getElementById("ticket-tbody").innerHTML = ''
  if(json.ticket.length <= 0){
    document.getElementById("ticket-section").classList.add("d-none")
  }else{
    json.ticket.forEach(t=>{
      document.getElementById("ticket-tbody").innerHTML += `
      <tr >
          <td>${t.type_name}</td>
          <td
              class="text-end">$${t.price.toFixed(2)}</td>
          <td
              class="text-end">${t.ticket_bought}</td>
          <td class="text-end">
          </td>
      </tr>`
    })
  }


  document.getElementById("ticket-tfoot").innerHTML = `
  <tr
    class="fw-semibold bg-light">
    <td>Total</td>
    <td
        class="text-end">-</td>
    <td class="text-end">
        ${json.ticket.reduce((sum,
        ticket) => sum +
        ticket.ticket_bought,
        0)}
    </td>
    <td
        class="text-end text-brand">
       $ ${totalEarnings.toFixed(2)}
    </td>
</tr>`

const url = `${window.location.protocol}//${window.location.host}/event/detail?e=${eventId}`;

document.getElementById("input-link").value = url
document.getElementById("shareBtn").onclick = (e)=>copyEventUrlToClipboard(eventId)


}
getSummary();
