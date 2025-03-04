async function renderEvents(page = 1, perpage = 1000, is_published = true) {
    const eventList = document.getElementById("inperson-event");
    eventList.innerHTML = "";
  
    let queryParams = new URLSearchParams();
  
    queryParams.append("sort", "created_at");
  
  
    queryParams.append("page", `${page}`);
    queryParams.append("is_published", `${is_published}`);
    queryParams.append("perpage", `${perpage}`);
  
    try {
      let qryStr = queryParams.toString();
  
      console.log(qryStr);
  
      const { data } = await axiosInstance.get(`/events?${qryStr}`);
      const { data: eventss } = data;

      console.log(data);

        let events = eventss.filter(ev=>ev.event_type == "offline");
        let eventOnline = eventss.filter(ev=>ev.event_type == "online");
        let html = ''
        let htmlOnline = ''

        if(events.length == 0){
          html = `<div class="text-center w-100 my-5">
              <img src="/img/noFound.png" alt="..." height="220px;">
              <h4 class="text-center text-brand mt-2">No Event to Display</h4>
            </div>`
        }else{
          events.forEach((event, index) => {
            if(index <= 7){
    
                let pricing = null;
                // Get the current date and time
                        const eventDate = new Date(event.started_date);
                        const endDate = new Date(event.ended_date);
          
                        const currentDate = new Date();
                  currentDate.setHours(0, 0, 0, 0);
                        let eventStatus = null;
          
                        console.log(eventDate);
                        console.log(currentDate);
                        console.log(endDate);
          
                        if (currentDate < eventDate) {
                          eventStatus = "Upcoming";
                        } else if (currentDate >= eventDate && currentDate <= endDate) {
                          eventStatus = "Showing";
                        } else {
                          eventStatus = "Past";
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
                  if (event.event_type == "online") {
                    pricing = `Online`;
                  }
                }
          
                let categories = "";
                event.event_categories.forEach((c, i) => {
                    
                  categories += `<span class="event-category pill${
                    i + 1
                  } fw-medium d-inline-block ${i == 2 ? "d-none" : ""}">${c.name}</span>`;
                });
          
                const eventCard = `
                <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                      <div class="event-card mb-0 shadow-light-sm">
                          <div class="event-card-container event-card-container-horizontal">
                              <!-- Event Thumbnail -->
                              <div
                                  class="event-thumbnail object-fit-cover d-flex justify-content-between" >
                                  <img 
                                      class="img-fluid object-fit-cover"
                                      src="/uploads/${event.thumbnail}"
                                      alt="Event Image"/>
                                  <div
                                      class="event-thumbnail-overlay" style="cursor: pointer;" onclick="goEventDetail(${
                                                event.id
                                              })"></div>
        
                                  <!-- Wishlist & Copy buttons -->
                                  <div class="button-group z-2">
                                              <div>
                                                  <button onclick="addWishlist(${
                                                    event.id
                                                  }, this)" class="button ${
        event.is_Wishlist && "active"
        }">
                                                      <i
                                                          class="fa-regular fa-heart"></i>
                                                      <!-- Wishlist Icon -->
                                                  </button>
                                              </div>
                                              <button class="button" onclick="copyEventUrlToClipboard(${
                                                event.id
                                              })">
                                                  <i data-lucide="link" style="stroke-width: 2; width: 1.25rem;"></i>
                                                  <!-- Copy Link Icon -->
                                              </button>
                                          </div>
        
                                  <!-- Event Type Tag -->
                                  <div class="event-type text-brand">
                                      <i
                                          class="fa-solid fa-tag text-brand"></i>
                                      <!-- <i class="fa-solid fa-tag"></i> -->
                                      <span>${pricing}</span>
                                      <!-- <small class=" badge">$50</small> -->
                                  </div>
                              </div>
        
                              <!-- Event Details -->
                              <div class="event-details px-3" style="cursor: pointer;" onclick="goEventDetail(${
                                                event.id
                                              })">
                                  <div
                                      class="d-flex justify-content-between">
        
                                      <h3
                                          class="event-title text-wrap">${
                                            event.eng_name
                                          }</h3>
                                      <span
                                          class="event-category pill1 fw-medium d-none">Upcoming</span>
                                     
                                  </div>
                                  <!-- <p
                                      class="event-description d-none text-1-line">
                                      Join us for an unforgettable
                                      culinary experience with the
                                      best
                                      local chefs and street food.
                                  </p> -->
        
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
                                    event.location ? "" : ""
                                  }"
                                              style="">
                                              <i
                                                  class="fas fa-map-marker-alt text-brand fs-6"></i>
                                              <p
                                                  class="text-1-line mb-0 pb-0">${
                                                    event.event_type ==
                                                    "offline"
                                                      ? event.location
                                                      : "Online Event"
                                                  }</p>
                                              <div
                                                  class=" text-brand fw-medium"
                                                  style="border-color: var(--c-brand) !important;">
        
                                              </div>
        
                                          </div>
        
                                  <!-- Event Price -->
        
                                  <!-- Creator Profile -->
                                  <div class="creator-profile">
                                      <div class="creator-avatar">
                                          <img
                                              src="/uploads/${event.creator.avatar ? event.creator.avatar : "default.jpg"}"
                                              alt="Creator" />
                                      </div>
                                      <a href=""
                                          class="creator-name">${event.creator.name}</a>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
            `;
                html += eventCard;
            }
        });
        }
        
        if(eventOnline.length == 0){
         htmlOnline = eventList.innerHTML = `<div class="text-center w-100 my-5">
         <img src="/img/noFound.png" alt="..." height="220px;">
         <h4 class="text-center text-brand mt-2">No Event to Display</h4>
         </div>`
        }else{
          eventOnline.forEach((event, index) => {
            if(index <= 7){
    
                let pricing = null;
                // Get the current date and time
                        const eventDate = new Date(event.started_date);
                        const endDate = new Date(event.ended_date);
          
                        const currentDate = new Date();
                  currentDate.setHours(0, 0, 0, 0);
                        let eventStatus = null;
          
                        console.log(eventDate);
                        console.log(currentDate);
                        console.log(endDate);
          
                        if (currentDate < eventDate) {
                          eventStatus = "Upcoming";
                        } else if (currentDate >= eventDate && currentDate <= endDate) {
                          eventStatus = "Showing";
                        } else {
                          eventStatus = "Past";
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
                  if (event.event_type == "online") {
                    pricing = `Online`;
                  }
                }
          
                let categories = "";
                event.event_categories.forEach((c, i) => {
                    
                  categories += `<span class="event-category pill${
                    i + 1
                  } fw-medium d-inline-block ${i == 2 ? "d-none" : ""}">${c.name}</span>`;
                });
          
                const eventCard = `
                <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                      <div class="event-card mb-0 shadow-light-sm">
                          <div class="event-card-container event-card-container-horizontal">
                              <!-- Event Thumbnail -->
                              <div
                                  class="event-thumbnail object-fit-cover d-flex justify-content-between" >
                                  <img 
                                      class="img-fluid object-fit-cover"
                                      src="/uploads/${event.thumbnail}"
                                      alt="Event Image"/>
                                  <div
                                      class="event-thumbnail-overlay" style="cursor: pointer;" onclick="goEventDetail(${
                                                event.id
                                              })"></div>
        
                                  <!-- Wishlist & Copy buttons -->
                                  <div class="button-group z-2">
                                              <div>
                                                  <button onclick="addWishlist(${
                                                    event.id
                                                  }, this)" class="button ${
        event.is_Wishlist && "active"
        }">
                                                      <i
                                                          class="fa-regular fa-heart"></i>
                                                      <!-- Wishlist Icon -->
                                                  </button>
                                              </div>
                                              <button class="button" onclick="copyEventUrlToClipboard(${
                                                event.id
                                              })">
                                                  <i data-lucide="link" style="stroke-width: 2; width: 1.25rem;"></i>
                                                  <!-- Copy Link Icon -->
                                              </button>
                                          </div>
        
                                  <!-- Event Type Tag -->
                                  <div class="event-type text-brand">
                                      <i
                                          class="fa-solid fa-tag text-brand"></i>
                                      <!-- <i class="fa-solid fa-tag"></i> -->
                                      <span>${pricing}</span>
                                      <!-- <small class=" badge">$50</small> -->
                                  </div>
                              </div>
        
                              <!-- Event Details -->
                              <div class="event-details px-3" style="cursor: pointer;" onclick="goEventDetail(${
                                                event.id
                                              })">
                                  <div
                                      class="d-flex justify-content-between">
        
                                      <h3
                                          class="event-title text-wrap text-white">${
                                            event.eng_name
                                          }</h3>
                                      <span
                                          class="event-category pill1 fw-medium d-none">Upcoming</span>
                                     
                                  </div>
                                  <!-- <p
                                      class="event-description d-none text-1-line text-white">
                                      Join us for an unforgettable
                                      culinary experience with the
                                      best
                                      local chefs and street food.
                                  </p> -->
        
                                  <!-- Event Tags -->
                                  <div
                                      class="d-flex align-items-center justify-content-between mb-3 mt-2 mt-lg-0">
                                      <div
                                          class="event-categories flex-nowrap text-white">
                                          ${categories}
                                      </div>
                                      <div
                                          class="d-flex align-items-center">
        
                                      </div>
                                  </div>
        
                                  <!-- Date & Location -->
                                  <div class="event-meta">
                                      <div class="event-meta-item text-white">
                                          <i
                                              class="fas fa-calendar-alt text-brand"></i>
                                          <span>${moment(
                                            event.started_date
                                          ).format("ll")}</span>
                                      </div>
                                      <div class="event-meta-item text-white">
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
        
                                  <div class="event-meta-item text-white ${
                                    event.location ? "" : ""
                                  }"
                                              style="">
                                              <i
                                                  class="fas fa-map-marker-alt text-brand fs-6"></i>
                                              <p
                                                  class="text-1-line mb-0 pb-0">${
                                                    event.event_type ==
                                                    "offline"
                                                      ? event.location
                                                      : "Online Event"
                                                  }</p>
                                              <div
                                                  class=" text-brand fw-medium"
                                                  style="border-color: var(--c-brand) !important;">
        
                                              </div>
        
                                          </div>
        
                                  <!-- Event Price -->
        
                                  <!-- Creator Profile -->
                                  <div class="creator-profile">
                                      <div class="creator-avatar">
                                          <img
                                              src="/uploads/${event.creator.avatar ? event.creator.avatar : "default.jpg"}"
                                              alt="Creator" />
                                      </div>
                                      <a href=""
                                          class="creator-name">${event.creator.name}</a>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
            `;
                htmlOnline += eventCard;
            }
        });
        }

     


    document.getElementById("inperson-event").innerHTML = html
    document.getElementById("online-event").innerHTML = htmlOnline
    lucide.createIcons();
  
    } catch (error) {
      console.log(error);
      showToast();
    }
  }

  renderEvents()