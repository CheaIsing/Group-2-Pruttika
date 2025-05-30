const urlParams = new URLSearchParams(window.location.search);

let isFreeTicket = false;
let eventId = urlParams.has("e")
  ? urlParams.get("e")
  : sessionStorage.getItem("event-detail-id");

if (!eventId) {
  window.location.href = "/event/browse";
}

let eventObj = null;
let isRedeemTicket = false;
let isAuth = false;
let isOnlineEvent = false;
let userId = null;
let isOnlineRedeemTicket = false;

let categories = [];
function setPlaceholder() {
  document.querySelector(".placeholer-content").innerHTML = `
    <div class="skeleton after-skeleton" style="height: 200px;"></div>
        <div class="container py-5 after-skeleton">
            <div class="row g-4">
                <div class="col-12 col-lg-8 order-2 order-lg-1">
                    <!-- <div class="event-image"></div> -->
                    <div class="skeleton" style="height: 150px; width: 100%;"></div>
                    <h1 class="skeleton" style="height: 30px; width: 100%; margin: 10px 0;"></h1>
                    <p class="skeleton" style="height: 20px; width: 100%; margin: 10px 0;"></p>
                    <div class="skeleton" style="height: 100px; width: 100%;"></div>
                    <div class="skeleton" style="height: 20px; width: 100%; margin: 10px 0;"></div>
                </div>
                <div class="col-12 col-lg-4 order-1 order-lg-2">
                    <div class="event-details-card">
                        <h1 class="skeleton" style="height: 30px; width: 100%; margin: 10px 0;"></h1>
                        <p class="skeleton" style="height: 20px; width: 100%; margin: 10px 0;"></p>
                        <div class="skeleton" style="height: 100px; width: 100%;"></div>
                        <div class="skeleton" style="height: 20px; width: 100%; margin: 10px 0;"></div>
                    </div>
                    <div class="event-details-card mt-4">
                        <h1 class="skeleton" style="height: 30px; width: 100%; margin: 10px 0;"></h1>
                        <p class="skeleton" style="height: 20px; width: 100%; margin: 10px 0;"></p>
                    </div>
                    <div class="event-details-card mt-4">
                        <h1 class="skeleton" style="height: 30px; width: 100%; margin: 10px 0;"></h1>
                        <p class="skeleton" style="height: 20px; width: 100%; margin: 10px 0;"></p>
                    </div>
                </div>
            </div>
        </div>
  `;
  document
    .querySelectorAll(".before-skeleton")
    .forEach((el) => el.classList.add("d-none"));
}

async function getEventDetail() {
  // Show skeletons while loading
  setPlaceholder();
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

    console.log(eventObj);

    isOnlineEvent = eventObj.event_type === "online";

    if (isAuth && userId) {
      const isFollowing = data2.data.some(
        (following) => following.id == eventObj.creator.id
      );
      const isWishlist = wishlist.some((w) => w.event_id == eventObj.id);

      document
        .getElementById("buttonWish")
        .setAttribute("onclick", `addWishlist(${eventObj.id}, this)`);

      document
        .getElementById("buttonWish")
        .classList.toggle("active", isWishlist);
      console.log(isWishlist);

      console.log(wishlist);
      console.log(eventObj);

      if (isWishlist) {
        document.getElementById("buttonWish").classList.add("active");
      }

      if (eventObj.creator.id == userId) {
        document.getElementById("btnFollow").classList.add("opacity-0");
        document.getElementById("btnPurchaseTicket").classList.add("disabled");
        document.getElementById("btnPurchaseTicket").innerText = isEnglish
          ? "Owned Event"
          : "ព្រឹត្តិការណ៍របស់អ្នក។";
      }
      document
        .getElementById("btnFollow")
        .setAttribute("onclick", `toggleFollow(${eventObj.creator.id}, this)`);
      document.getElementById("btnFollow").innerText = isFollowing
        ? getText("unfollow")
        : getText("follow");

      isRedeemTicket = freeTicket.some(
        (r) => r.event.id == eventId && r.ticket_type.price == 0
      );
      console.log(isRedeemTicket);
      console.log(freeTicket);
      isOnlineRedeemTicket = freeTicket.some(
        (r) => r.event.id == eventId && r.event.event_type == 1
      );
      console.log(isOnlineRedeemTicket);
      if (isOnlineRedeemTicket) {
        document.getElementById("btnPurchaseTicket").classList.add("disabled");
      }
      if (isRedeemTicket) {
        console.log(true);

        // document.getElementById("btnPurchaseTicket").setAttribute("disabled", "");
        // document.getElementById("btnPurchaseTicket").classList.add("disabled");
      }
    } else {
      document.getElementById("buttonWish").onclick = () => {
        window.location.href = "/auth/signin";
      };
      document.getElementById("btnFollow").onclick = () => {
        window.location.href = "/auth/signin";
      };
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
    ).fromNow();
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
    const endDate = new Date(eventObj.ended_date);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    if (currentDate < endDate) {
      // eventStatus = getText("upcoming")
    } else if (currentDate >= endDate && currentDate <= endDate) {
      // eventStatus =  getText("showing")
    } else {
      document.getElementById("btnPurchaseTicket").innerText = isEnglish
        ? "Already Finished"
        : "កន្លងផុតហើយ";
      document.getElementById("btnPurchaseTicket").classList.add("disabled");
    }

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
      document.getElementById("remain-capacity").innerText =
        eventObj.event_tickets.reduce((acc, t) => acc + t.ticket_opacity, 0) -
        eventObj.event_tickets.reduce((acc, t) => acc + t.ticket_bought, 0);

      if (document.getElementById("remain-capacity").innerText == 0) {
        document.getElementById("btnPurchaseTicket").innerText = isEnglish
          ? "Sold Out"
          : "លក់អស់";
        document.getElementById("btnPurchaseTicket").classList.add("disabled");
      }
    } else if (
      eventObj.event_tickets.length == 0 &&
      eventObj.event_type == "online"
    ) {
      document.getElementById("capacity-container").classList.add("d-none");
      document
        .getElementById("remain-capacity-container")
        .classList.add("d-none");
      document
        .getElementById("remain-capacity-container")
        .classList.add("d-none");
      document
        .getElementById("ticket-category-container")
        .classList.add("d-none");

      document.getElementById("btnPurchaseTicket").innerText =
        getText("redeem");
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
      document.getElementById("btnPurchaseTicket").innerText =
        getText("redeem") + getText("ticket");
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
          : "Free " + getText("ticket");
    } else {
      document.getElementById("range-price").innerText =
        "Free " + getText("ticket");
    }

    let agendaHtml = eventObj.event_agenda
      .map(
        (a) => `
      <div class="agenda-card mb-3 rounded-4 py-3 px-4">
        <div class="agenda-content ps-4">
          <p class="text-secondary">${moment(
            a.agendaStart_time,
            "HH:mm:ss"
          ).format("hh:mm A")} - ${moment(a.agendaEnd_time, "HH:mm:ss").format(
          "hh:mm A"
        )}</p>
          <h4 style="color: #333333;">${a.title}</h4>
          <p class="mb-0 text-secondary">${a.agendaDescription}</p>
        </div>
      </div>`
      )
      .join("");
    document.getElementById("agenda-container").innerHTML =
      agendaHtml || document.getElementById("agenda-section").remove();

    // Hide skeletons after loading is complete
    document.querySelector(".placeholer-content").classList.add("d-none");
    document
      .querySelectorAll(".before-skeleton")
      .forEach((el) => el.classList.remove("d-none"));
  } catch (error) {
    console.log(error);
    showToast();
  }
}

async function renderRelatedEvents(
  page = 1,
  perpage = 1000,
  is_published = true
) {
  await getEventDetail();
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
      categories = categories.map((c) => c.id);

      let resultCate = categories.map(Number);
      qryStr += `&cateId=[${resultCate}]`;
    }

    console.log(qryStr);

    const { data } = await axiosInstance.get(`/events?${qryStr}`);
    const { data: events } = data;

    console.log(data);

    if (events.length === 0) {
      relatedEventsContainer.innerHTML = `
              <div class="text-center w-100 my-5">
                  <img src="/img/noFound.png" alt="No events found" height="220px;">
                  <h4 class="text-center text-brand mt-2">${getText(
                    "noEvent"
                  )}</h4>
              </div>
          `;
    } else {
      events.forEach((event, index) => {
        if (index <= 7) {
          let pricing = null;
          if (event.event_tickets.length > 1) {
            const numbers = event.event_tickets.map((et) => et.price);
            const minNumber = Math.min(...numbers);
            const maxNumber = Math.max(...numbers);
            pricing = `$${minNumber.toFixed(2)}`;
          } else if (event.event_tickets.length === 1) {
            pricing = `${
              event.event_tickets[0].price > 0
                ? `$${event.event_tickets[0].price.toFixed(2)}`
                : "Free"
            }`;
          } else if (event.event_tickets.length === 0) {
            pricing = getText("online");
          }

          let categories = "";
          event.event_categories.forEach((c, i) => {
            if (i < 2) {
              categories += `<span class="badge">${c.name}</span>`;
            }
          });

          const eventCard = `
                  <div class="swiper-slide">
                      <div class="event-card mb-3 mb-lg-3">
                          <img src="/uploads/${
                            event.thumbnail
                          }" alt="Event" class="event-images" style="cursor:pointer;" onclick="goEventDetail(${
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
                                  <h5 class="fw-bold mb-3 text-center event-titles text-1-line">${
                                    event.eng_name
                                  }</h5>
                                  <div class="event-tags mb-3 text-center">
                                      ${categories}
                                  </div>
                                  <div class="event-meta px-4 d-block">
                                      <p class="mb-1 text-1-line"><i class="fa-regular fa-calendar me-2"></i> ${moment(
                                        event.started_date
                                      ).format("ll")} • ${moment(
            event.start_time,
            "HH:mm"
          ).format("LT")}</p>
                                      <p class="mb-0 text-1-line"><i class="bi bi-geo-alt me-2"></i> ${
                                        event.event_type === "offline"
                                          ? event.location
                                          : "Online Event"
                                      }</p>
                                  </div>
                                  <div class="event-authors d-flex align-items-center px-4 my-3">
                                      <img src="/uploads/${
                                        event.creator.avatar
                                          ? event.creator.avatar
                                          : "default.jpg"
                                      }" alt="Author" class="me-3 rounded-circle" style="width: 30px; height: 30px; object-fit: cover;">
                                      <span class="fw-bold text-1-line">${
                                        event.creator.name
                                      }</span>
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
    if (error.status == 401) {
      return;
    }
    console.log(error);
    showToast();
  }
}

// Call the function to render related events
// getEventDetail();
if (document.getElementById("related-events")) {
  renderRelatedEvents();
} else {
  getEventDetail();
}

document.getElementById("btn-copylink-event").onclick = () => {
  copyEventUrlToClipboard(eventId);
};

document
  .getElementById("btnPurchaseTicket")
  .addEventListener("click", async (e) => {
    let msgBtn = document.getElementById("btnPurchaseTicket").innerText;
    if (!isAuth) {
      return (window.location.href = "/auth/signin");
    }
    if (isRedeemTicket || isOnlineRedeemTicket) {
      showToast(false, getText("redeemedAlready"));
      return;
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

        showToast(true, getText("redeemSubmitted"));

        isOnlineRedeemTicket = true;
      } catch (error) {
        showToast();
        console.log(error);
      } finally {
        btnCloseLoading("btnPurchaseTicket", msgBtn);
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

          showToast(true, getText("redeemSubmitted"));

          isRedeemTicket = true;
        } catch (error) {
          showToast();
          console.log(error);
        } finally {
          btnCloseLoading("btnPurchaseTicket", msgBtn);
          document
            .getElementById("btnPurchaseTicket")
            .classList.add("disabled");
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
      showToast(true, getText("unfollowSuccess"));
      btn.innerText = getText("follow");
    } else {
      await axiosInstance.post(`/follow/${id}`);
      showToast(true, getText("followSuccess"));
      btn.innerText = getText("unfollow");
    }
  } catch (error) {
    console.log(error);
    showToast();
  }
}
