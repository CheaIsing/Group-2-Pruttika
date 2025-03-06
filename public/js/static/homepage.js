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

      let events = eventss.filter(ev => ev.event_type == "offline");
      let eventOnline = eventss.filter(ev => ev.event_type == "online");
      let html = '';
      let htmlOnline = '';

      if (events.length == 0) {
          html = `<div class="text-center w-100 my-5">
                      <img src="/img/noFound.png" alt="..." height="220px;">
                      <h4 class="text-center text-brand mt-2">No Event to Display</h4>
                  </div>`;
      } else {
          events.forEach((event, index) => {
              if (index <= 7) {
                  let pricing = null;
                  const eventDate = new Date(event.started_date);
                  const endDate = new Date(event.ended_date);
                  const currentDate = new Date();
                  currentDate.setHours(0, 0, 0, 0);
                  let eventStatus = null;

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
                      pricing = `$${minNumber.toFixed(2)}`;
                  } else if (event.event_tickets.length == 1) {
                      pricing = `${event.event_tickets[0].price > 0 ? `$${event.event_tickets[0].price.toFixed(2)}` : "Free"}`;
                  } else if (event.event_tickets.length == 0) {
                      if (event.event_type == "online") {
                          pricing = `Online`;
                      }
                  }

                  let categories = "";
                  event.event_categories.forEach((c, i) => {
                      categories += `<span class="badge">${c.name}</span>`;
                  });

                  const eventCard = `
                      <div class="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3">
                          <div class="event-card mb-3 mb-lg-3  position-relative"  >
                              <img src="/uploads/${event.thumbnail}" alt="Event" class="event-images" style="cursor: pointer;" onclick="goEventDetail(${

                                                event.id

                                              })">
                              <div class="event-card-hover">
                                  <div class="button-group z-2" style="z-index: 999 !important;">
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
                              </div>
                              <div class="event-detail" style="cursor: pointer;" onclick="goEventDetail(${

                                                event.id

                                              })">
                                  <div class="position-relative z-3 pt-3">
                                      <div class="event-prices text-center">${pricing}</div>
                                      <h5 class="fw-bold mb-3 text-center event-titles text-1-line">${event.eng_name}</h5>
                                      <div class="event-tags mb-3 text-center ">
                                          ${categories}
                                      </div>
                                      <div class="event-meta px-4">
                                          <p class="mb-1"><i class="fa-regular fa-calendar me-2"></i> ${moment(event.started_date).format("ll")} • ${moment(event.start_time, "HH:mm").format("LT")}</p>
                                          <p class="mb-0"><i class="bi bi-geo-alt me-2"></i> ${event.event_type == "offline" ? event.location : "Online Event"}</p>
                                      </div>
                                      <div class="event-authors d-flex align-items-center px-4 my-3">
                                          <img src="/uploads/${event.creator.avatar ? event.creator.avatar : "default.jpg"}" alt="Author" class="me-3 rounded-circle" style="width: 30px; height: 30px; object-fit: cover;">
                                          <span class="fw-bold">${event.creator.name}</span>
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

      if (eventOnline.length == 0) {
          htmlOnline = `<div class="text-center w-100 my-5">
                          <img src="/img/noFound.png" alt="..." height="220px;">
                          <h4 class="text-center text-brand mt-2">No Event to Display</h4>
                        </div>`;
      } else {
          eventOnline.forEach((event, index) => {
              if (index <= 7) {
                  let pricing = null;
                  const eventDate = new Date(event.started_date);
                  const endDate = new Date(event.ended_date);
                  const currentDate = new Date();
                  currentDate.setHours(0, 0, 0, 0);
                  let eventStatus = null;

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
                      pricing = `${event.event_tickets[0].price > 0 ? `$${event.event_tickets[0].price.toFixed(2)}` : "Free Ticket"}`;
                  } else if (event.event_tickets.length == 0) {
                      if (event.event_type == "online") {
                          pricing = `Online`;
                      }
                  }

                  let categories = "";
                  event.event_categories.forEach((c, i) => {
                      categories += `<span class="badge">${c.name}</span>`;
                  });

                  const eventCard = `
                      <div class="col-12 col-sm-10 col-md-6 col-lg-3 col-xl-3">
                          <div class="event-card mb-3 mb-lg-3"  >
                              <img src="/uploads/${event.thumbnail}" alt="Event" class="event-images" style="cursor:pointer;" onclick="goEventDetail(${

                                                event.id

                                              })">
                              <div class="event-card-hover">
                                  <div class="button-group z-3" style="z-index: 999 !important;">
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
                              </div>
                              <div class="event-detail" style="cursor:pointer;" onclick="goEventDetail(${

                                                event.id

                                              })">
                                  <div class="position-relative z-3 pt-3">
                                      <div class="event-prices text-center">${pricing}</div>
                                      <h5 class="fw-bold mb-3 text-center event-titles text-1-line">${event.eng_name}</h5>
                                      <div class="event-tags mb-3 text-center">
                                          ${categories}
                                      </div>
                                      <div class="event-meta px-4">
                                          <p class="mb-1"><i class="fa-regular fa-calendar me-2"></i> ${moment(event.started_date).format("ll")} • ${moment(event.start_time, "HH:mm").format("LT")}</p>
                                          <p class="mb-0"><i class="bi bi-geo-alt me-2"></i> ${event.event_type == "offline" ? event.location : "Online Event"}</p>
                                      </div>
                                      <div class="event-authors d-flex align-items-center px-4 my-3">
                                          <img src="/uploads/${event.creator.avatar ? event.creator.avatar : "default.jpg"}" alt="Author" class="me-3 rounded-circle" style="width: 30px; height: 30px; object-fit: cover;">
                                          <span class="fw-bold">${event.creator.name}</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  `;
                  htmlOnline += eventCard;
                  lucide.createIcons();
              }
          });
      }

      document.getElementById("inperson-event").innerHTML = html;
      document.getElementById("online-event").innerHTML = htmlOnline;
      lucide.createIcons();

  } catch (error) {
      console.log(error);
      showToast();
  }
}
  renderEvents()