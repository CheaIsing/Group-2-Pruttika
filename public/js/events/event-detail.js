const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.has("e")
  ? urlParams.get("e")
  : sessionStorage.getItem("itemID");

let eventId = urlParams.has("e")
  ? urlParams.get("e")
  : sessionStorage.getItem("event-detail-id") || 28;
async function getEventDetail() {
  try {
    const { data } = await axiosInstance.get(`/events/${eventId}`);
    const { data: json } = data;
    console.log(json);

    document.getElementById('event-hero-banner-img').setAttribute("style", `background-image: url('/uploads/${json.thumbnail}');`) 

    document.getElementById('event-thumbnail').src = `/uploads/${json.thumbnail}`

    document.getElementById('title-event').innerText = json.eng_name

    document.getElementById("event-type").innerText =
      json.event_type == "online" ? "Online" : "In Person";

    document.getElementById("snippet-date").innerText = moment(
      json.started_date
    ).format("ddd, MMM Do YYYY");
    document.getElementById("created-at").innerText = moment(json.updated_at)
      .startOf("hour")
      .fromNow();
    document.getElementById("title").innerText = json.eng_name;
    document.getElementById("short-desc").innerText = json.short_description;
    document.getElementById("creator-name").innerText = json.creator.name;
    if (json.creator.avatar) {
      document.getElementById("creator-img").src = json.creator.avatar;
    }

    document.getElementById("date").innerText =
      moment(json.started_date).format("ll") +
      " - " +
      moment(json.ended_date).format("ll");

    document.getElementById("time").innerText =
      moment(json.start_time, "HH:mm:ss").format("LT") +
      " - " +
      moment(json.end_time, "HH:mm:ss").format("LT");

    if (json.location) {
      document.getElementById("location").innerText = json.location;
    } else {
      document.getElementById("location-container").classList.add("d-none");
    }

    document.getElementById("category").innerText = json.event_categories
      .map((category) => category.name)
      .join(", ");

    if (json.event_tickets.length > 0) {
      document.getElementById("ticket-category").innerText = json.event_tickets
        .map((category) => category.type)
        .join(", ");

        document.getElementById('capacity').innerText = json.event_tickets.map(ticket=>ticket.ticket_opacity).reduce((acc, curr) => acc + curr, 0)

    } else {
      document
        .getElementById("purchase-ticket-container")
        .classList.add("d-none");
      document
        .getElementById("ticket-category-container")
        .classList.add("d-none");
    }

    document.getElementById("desc").innerHTML = json.description;

    if (json.event_tickets.length > 1) {
      const numbers = json.event_tickets.map((et) => et.price);
      const minNumber = Math.min(...numbers);
      const maxNumber = Math.max(...numbers);
      document.getElementById("range-price").innerText = `$${minNumber.toFixed(
        2
      )} - $${maxNumber.toFixed(2)}`;
    } else if (json.event_tickets.length == 1) {
      document.getElementById(
        "range-price"
      ).innerText = `${json.event_tickets[0].price > 0 ? `$${json.event_tickets[0].price.toFixed(2)}` : 'Free Ticket'}`;
      
      
    }

    let agendaHtml = '';

    if(json.event_agenda.length > 0){
      json.event_agenda.forEach(agenda=>{
        agendaHtml += `
        <div class="agenda-card mb-3 rounded-4 py-3 px-4">
                            <div class="agenda-content ps-4">
                                <p class="text-secondary" id="agenda-time">${agenda.agendaEnd_time}</p>
                                <h4 id="agenda-title" style="color: #333333;">${agenda.title}</h4>
                                <p id="agenda-desc" class="mb-0 text-secondary">${agenda.
                                  agendaDescription}</p>
                            </div>
                        </div>`
      })
    }

    document.getElementById('agenda-container').innerHTML = agendaHtml

    
  } catch (error) {
    console.log(error);
    showToast();
  }
}
getEventDetail();
document.getElementById("btn-copylink-event").onclick = () => {
  copyEventUrlToClipboard(eventId);
};

