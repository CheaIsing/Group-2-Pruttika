async function renderEvents() {
    const eventList = document.getElementById("event-list");
    eventList.innerHTML = "";
  

    try {
  
      const { data } = await axiosInstance.get(
        `/wishlist/display`
      );
      const { data: events} = data;
      // console.log(data);

      if(events.length == 0){
        return eventList.innerHTML = `<div class="text-center w-100 my-5">
        <img src="/img/noFound.png" alt="..." height="220px;">
        <h4 class="text-center text-brand mt-2">No Wishlist to Display</h4>
      </div>`
      }
  
      events.forEach((event) => {
        let pricing = null;
        // Get the current date and time
        const eventDate = new Date(event.started_date);
        const currentDate = new Date();
        let eventStatus = null;
  
        if (currentDate < eventDate) {
          eventStatus = "Upcoming";
        } else if (currentDate > eventDate) {
          eventStatus = "Past";
        } else {
          eventStatus = "Ongoing";
        }
  
        if (event.event_tickets.length > 1) {
          const numbers = event.event_tickets.map((et) => et.price);
          const minNumber = Math.min(...numbers);
          const maxNumber = Math.max(...numbers);
  
          pricing = `$${minNumber.toFixed(2)} - $${maxNumber.toFixed(2)}`;
        } else if (event.event_tickets.length == 1) {
          pricing = `${
            event.event_tickets[0].price > 0
              ? `$${event.event_tickets[0].price.toFixed(2)}`
              : "Free Ticket"
          }`;
        } else if (event.event_tickets.length == 0) {
          pricing = ``;
        }
  
        let categories = "";
        event.event_categories.forEach((c, i) => {
          categories += `<span class="event-category pill${i + 1} fw-medium">${
            c.name
          }</span>`;
        });
        const eventCard = `
                  <div class="col-12" data-event-id="${event.event_id}">
                                  <div class="event-card shadow-light-sm">
                                      <div class="event-card-container">
                                          <!-- Event Thumbnail -->
                                          <div
                                              class="event-thumbnail object-fit-cover d-flex justify-content-between">
                                              <img style="cursor: pointer;" onclick="goEventDetail(${event.event_id})"
                                                  class="img-fluid object-fit-cover"
                                                  src="${
                                                    event.thumbnail
                                                      ? `/uploads/${event.thumbnail}`
                                                      : ""
                                                  }"
                                                  alt="Event Image"/>
                                              <div style="cursor: pointer;" onclick="goEventDetail(${event.event_id})"
                                                  class="event-thumbnail-overlay"></div>
  
                                              <!-- Wishlist & Copy buttons -->
                                              <div class="button-group z-3">
                                                  <div>
                                                      <button onclick="addWishlist(${
                                                        event.event_id
                                                      }, this)"  class="button z-3 active">
                                                          <i
                                                              class="fa-regular fa-heart"></i>
                                                          <!-- Wishlist Icon -->
                                                      </button>
                                                  </div>
                                                  <button class="button z-3" onclick="copyEventUrlToClipboard(${
                                                    event.event_id
                                                  })">
                                                      <i data-lucide="link" style="stroke-width: 2; width: 1.25rem;"></i>
                                                      <!-- Copy Link Icon -->
                                                  </button>
                                              </div>
  
                                              <!-- Event Type Tag -->
                                              <div style="cursor: pointer;" onclick="goEventDetail(${event.event_id})" class="event-type text-brand ${
                                                event.event_type == "offline"
                                                  ? "d-none"
                                                  : ""
                                              }">
                                                  <i
                                                      class="fas fa-map-marker-alt"></i>
                                                  <span>${
                                                    event.event_type == "offline"
                                                      ? "In Person"
                                                      : "Online"
                                                  }</span>
                                              </div>
                                          </div>
  
                                          <!-- Event Details -->
                                          <div class="event-details" style="cursor: pointer;" onclick="goEventDetail(${event.event_id})">
                                              <div
                                                  class="d-flex justify-content-between">
  
                                                  <h3
                                                      class="event-title text-wrap">${
                                                        event.eng_name
                                                      }</h3>
                                                  <span
                                                      class="event-category pill5 fw-medium d-none d-sm-flex">${eventStatus}</span>
                                                  
                                              </div>
                                              <p
                                                  class="event-description d-none d-lg-block text-1-line">
                                                  ${event.short_description}
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
                                                        event.started_date
                                                      ).format("ll")}</span>
                                                  </div>
                                                  <div class="event-meta-item">
                                                      <i
                                                          class="fas fa-clock text-brand"></i>
                                                      <span>${
                                                        moment(
                                                          event.start_time,
                                                          "HH:mm"
                                                        ).format("LT") +
                                                        " - " +
                                                        moment(
                                                          event.end_time,
                                                          "HH:mm"
                                                        ).format("LT")
                                                      }</span>
                                                  </div>
  
                                              </div>
  
                                              <div class="event-meta-item ${
                                                event.location ? "" : "d-none"
                                              }"
                                                  style="margin-bottom: 0.75rem !important;">
                                                  <i
                                                      class="fas fa-map-marker-alt text-brand"></i>
                                                  <p
                                                      class="text-1-line mb-0">${
                                                        event.location
                                                      }</p>
                                                  <div
                                                      class=" text-brand fw-medium"
                                                      style="border-color: var(--c-brand) !important;">
  
                                                  </div>
  
                                              </div>
                                              <div class="event-meta-item ${
                                                !pricing && "d-none"
                                              }">
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
  
                              </div>
              `;
        eventList.innerHTML += eventCard;
        lucide.createIcons();
      });
  

    } catch (error) {
      // console.log(error);
      showToast();
    }
  }
  renderEvents()