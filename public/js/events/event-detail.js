const urlParams = new URLSearchParams(window.location.search);

let isFreeTicket = false;
let eventId = urlParams.has("e")
  ? urlParams.get("e")
  : sessionStorage.getItem("event-detail-id") || 28;

let eventObj = null;
let isRedeemTicket = false;
let isAuth = false;
let isOnlineEvent = false;
let userId = null;

let categories = []

async function getEventDetail() {
  try {
    isAuth = false;
    let data3 = null;
    try {
      const { data: data33 } = await axiosInstance.get("/auth/me");
      data3 = data33;

      console.log(data33);
      
      isAuth = true;
    } catch (error) {
      console.log("unauthorized");
      isAuth = false;
    }

    let wishlist = null;
    let data2 = null;
    let freeTicket = null;
    console.log(isAuth);
    
    if (isAuth) {
      const { data: resultFreeTicket } = await axiosInstance.get(
        "/profile/own-request-ticket"
      );
      const { paginate } = resultFreeTicket;

      const { data: resultFreeTicket2 } = await axiosInstance.get(
        `/profile/own-request-ticket?page=1&perpage=${paginate.total}`
      );
      freeTicket = resultFreeTicket2.data;

      const { data: wish } = await axiosInstance.get("/wishlist/display");
      wishlist = wish.data;

      const { data: user } = data3;
      userId = user.id;

      const { data: data22 } = await axiosInstance.get(
        `/follow/following/${userId}`
      );
      data2 = data22;
    }

    const { data } = await axiosInstance.get(`/events/${eventId}`);
    eventObj = data.data;

    isOnlineEvent = eventObj.event_type === "online";

    if (isAuth && userId) {
      const isFollowing = data2.data.some(
        (following) => following.id == eventObj.creator.id
      );
      const isWishlist = wishlist.some((w) => w.id == eventObj.id);

      document
        .getElementById("buttonWish")
        .setAttribute("onclick", `addWishlist(${eventObj.id}, this)`);
      document
        .getElementById("buttonWish")
        .classList.toggle("active", isWishlist);

      if (eventObj.creator.id == userId) {
        document.getElementById("btnFollow").classList.add("opacity-0");
      }
      document
        .getElementById("btnFollow")
        .setAttribute("onclick", `toggleFollow(${eventObj.creator.id}, this)`);
      document.getElementById("btnFollow").innerText = isFollowing
        ? "Unfollow"
        : "Follow";

      isRedeemTicket = freeTicket.some(
        (r) =>
          r.ticket_type.ticket_event_id == eventObj.id &&
          r.ticket_type.price == 0
      );
      document.getElementById("btnPurchaseTicket").disabled = isRedeemTicket;
    }

    document.getElementById(
      "event-hero-banner-img"
    ).style.backgroundImage = `url('/uploads/${eventObj.thumbnail}')`;
    document.getElementById(
      "event-thumbnail"
    ).src = `/uploads/${eventObj.thumbnail}`;
    document.getElementById("title").innerText = eventObj.eng_name;
    document.getElementById("title-event").innerText = eventObj.eng_name;
    document.getElementById("event-type").innerText =
      eventObj.event_type === "online" ? "Online" : "In Person";
    document.getElementById("snippet-date").innerText = moment(
      eventObj.started_date
    ).format("ddd, MMM Do YYYY");
    document.getElementById("created-at").innerText = moment(
      eventObj.updated_at
    )
      .startOf("hour")
      .fromNow();
    document.getElementById("short-desc").innerText =
      eventObj.short_description;
    document.getElementById("creator-name").innerText = eventObj.creator.name;
    document.getElementById("creator-img").src = eventObj.creator.avatar
      ? `/uploads/${eventObj.creator.avatar}`
      : `/uploads/default.jpg`;

    document.querySelectorAll(".click-profile").forEach((btn) => {
      btn.style.cursor = "pointer";
      btn.onclick = () => {
        sessionStorage.setItem("view-profile-id", eventObj.creator.id);
        window.location.href = "/profile/view-profile";
      };
    });

    document.getElementById("date").innerText = `${moment(
      eventObj.started_date
    ).format("ll")} - ${moment(eventObj.ended_date).format("ll")}`;
    document.getElementById("time").innerText = `${moment(
      eventObj.start_time,
      "HH:mm:ss"
    ).format("LT")} - ${moment(eventObj.end_time, "HH:mm:ss").format("LT")}`;

    if (eventObj.location) {
      document.getElementById("location").innerText = eventObj.location;
    } else {
      document.getElementById("location-container").classList.add("d-none");
    }

    document.getElementById("category").innerText = eventObj.event_categories
      .map((c) => c.name)
      .join(", ");

      categories = eventObj.event_categories;

    if (eventObj.event_tickets.length > 0) {
      document.getElementById("ticket-category").innerText =
        eventObj.event_tickets.map((t) => t.type).join(", ");
      document.getElementById("capacity").innerText =
        eventObj.event_tickets.reduce((acc, t) => acc + t.ticket_opacity, 0);
    } else if (
      eventObj.event_tickets.length == 0 &&
      eventObj.event_type == "online"
    ) {

      document.getElementById("btnPurchaseTicket").innerText = "Redeem"
    } else {
      document
        .getElementById("purchase-ticket-container")
        .classList.add("d-none");
      document
        .getElementById("ticket-category-container")
        .classList.add("d-none");
    }

    if (
      eventObj.event_tickets.length === 1 &&
      eventObj.event_tickets[0].price === 0
    ) {
      isFreeTicket = true;
      document.getElementById("btnPurchaseTicket").innerText = "Redeem Ticket";
    }

    document.getElementById("desc").innerHTML = eventObj.description;

    if (eventObj.event_tickets.length > 1) {
      const prices = eventObj.event_tickets.map((t) => t.price);
      document.getElementById("range-price").innerText = `$${Math.min(
        ...prices
      ).toFixed(2)} - $${Math.max(...prices).toFixed(2)}`;
    } else if (eventObj.event_tickets.length == 1) {
      document.getElementById("range-price").innerText =
        eventObj.event_tickets[0].price > 0
          ? `$${eventObj.event_tickets[0].price.toFixed(2)}`
          : "Free Ticket";
    } else {
      document.getElementById("range-price").innerText = "Free Ticket";
    }

    let agendaHtml = eventObj.event_agenda
      .map(
        (a) => `
      <div class="agenda-card mb-3 rounded-4 py-3 px-4">
        <div class="agenda-content ps-4">
          <p class="text-secondary">${a.agendaEnd_time}</p>
          <h4 style="color: #333333;">${a.title}</h4>
          <p class="mb-0 text-secondary">${a.agendaDescription}</p>
        </div>
      </div>`
      )
      .join("");
    document.getElementById("agenda-container").innerHTML =
      agendaHtml || document.getElementById("agenda-section").remove();
  } catch (error) {
    console.log(error);
    showToast();
  }
}

async function renderRelatedEvents(page = 1, perpage = 1000, is_published = true) {
  await getEventDetail()
  const relatedEventsContainer = document.getElementById("related-events");
  relatedEventsContainer.innerHTML = ""; // Clear existing content


  let queryParams = new URLSearchParams();
  queryParams.append("sort", "created_at");
  queryParams.append("page", `${page}`);
  queryParams.append("is_published", `${is_published}`);
  queryParams.append("perpage", `${perpage}`);

  try {
      let qryStr = queryParams.toString();

      if (categories.length > 0) {
        categories = categories.map(c=>c.id)
        
        let resultCate = categories.map(Number);
        qryStr += `&cateId=[${resultCate}]`;
      }

      console.log(qryStr);
      

      const { data } = await axiosInstance.get(`/events?${qryStr}`);
      const { data: events } = data;

      // console.log(data);

      if (events.length === 0) {
          relatedEventsContainer.innerHTML = `
              <div class="text-center w-100 my-5">
                  <img src="/img/noFound.png" alt="No events found" height="220px;">
                  <h4 class="text-center text-brand mt-2">No Related Events to Display</h4>
              </div>
          `;
      } else {
          events.forEach((event, index) => {
              if(index <=7){
                let pricing = null;
              if (event.event_tickets.length > 1) {
                  const numbers = event.event_tickets.map((et) => et.price);
                  const minNumber = Math.min(...numbers);
                  const maxNumber = Math.max(...numbers);
                  pricing = `$${minNumber.toFixed(2)}`;
              } else if (event.event_tickets.length === 1) {
                  pricing = `${event.event_tickets[0].price > 0 ? `$${event.event_tickets[0].price.toFixed(2)}` : "Free"}`;
              } else if (event.event_tickets.length === 0) {
                  pricing = `Online`;
              }

              let categories = "";
              event.event_categories.forEach((c) => {
                  categories += `<span class="badge">${c.name}</span>`;
              });

              const eventCard = `
                  <div class="swiper-slide">
                      <div class="event-card mb-3 mb-lg-3">
                          <img src="/uploads/${event.thumbnail}" alt="Event" class="event-images" style="cursor:pointer;" onclick="goEventDetail(${

                                                event.id

                                              })">
                          <div class="event-card-hover">
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
                                  <div class="event-meta px-4 d-block">
                                      <p class="mb-1"><i class="fa-regular fa-calendar me-2"></i> ${moment(event.started_date).format("ll")} • ${moment(event.start_time, "HH:mm").format("LT")}</p>
                                      <p class="mb-0"><i class="bi bi-geo-alt me-2"></i> ${event.event_type === "offline" ? event.location : "Online Event"}</p>
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
              relatedEventsContainer.innerHTML += eventCard;
              lucide.createIcons();
              }
          });

      }
  } catch (error) {

    if(error.status == 401){
      return
    }
      console.log(error);
      showToast();
  }
}

// Call the function to render related events
// getEventDetail();
renderRelatedEvents();

document.getElementById("btn-copylink-event").onclick = () => {
  copyEventUrlToClipboard(eventId);
};

document
  .getElementById("btnPurchaseTicket")
  .addEventListener("click", async (e) => {
    if(!isAuth){
      return window.location.href = "/auth/signin"
    }
    if (isOnlineEvent && isAuth) {
      try {
        const frmData = {
          ticket_type_id: null,
          quantity: 1,
          event_id: eventObj.id,
        };
        btnShowLoading("btnPurchaseTicket");
        await axiosInstance.post("/tickets/request-ticket", frmData);

        showToast(
          true,
          "Redeem ticket has submitted. Please wait for confirmation from organizer."
        );

        
      } catch (error) {
        showToast();
        console.log(error);
      } finally {
        btnCloseLoading("btnPurchaseTicket", "Redeem");
        document.getElementById("btnPurchaseTicket").disabled = true;
      }
    } else if (isFreeTicket && !isRedeemTicket) {
      if (eventObj) {
        const frmData = {
          ticket_type_id: eventObj.event_tickets[0].id,
          quantity: 1,
          event_id: eventObj.id,
        };
        try {
          btnShowLoading("btnPurchaseTicket");
          await axiosInstance.post("/tickets/request-ticket", frmData);

          showToast(
            true,
            "Redeem ticket has submitted. Please wait for confirmation from organizer."
          );
        } catch (error) {
          showToast();
          console.log(error);
        } finally {
          btnCloseLoading("btnPurchaseTicket", "Redeem");
          document.getElementById("btnPurchaseTicket").disabled = true;
        }
      }
    } else {
      if (eventObj) {
        sessionStorage.setItem("event_obj", JSON.stringify(eventObj));
        window.location.href = "/ticket/buy-ticket";
      }
    }
  });

async function toggleFollow(id, btn) {
  try {
    const { data } = await axiosInstance.get(`/follow/following/${userId}`);
    const { data: following } = data;

    const isFollowing = following.some((follower) => follower.id === id);
    console.log(isFollowing);

    if (isFollowing) {
      await axiosInstance.delete(`/follow/unfollow/${id}`);
      showToast(true, "Unfollowed successfully");
      btn.innerText = "Follow";
    } else {
      await axiosInstance.post(`/follow/${id}`);
      showToast(true, "Followed successfully");
      btn.innerText = "Unfollow";
    }
  } catch (error) {
    console.log(error);
    showToast();
  }
}
