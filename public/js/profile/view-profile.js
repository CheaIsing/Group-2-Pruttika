let userId = sessionStorage.getItem("view-profile-id") || 1
let meId = null
async function getOrganizer() {
  try {
    const { data } = await axiosInstance.get("/profile/display/" + userId);
    // console.log(data);


    const {data: user} = data
    let avatar = user.avatar ? `/uploads/${user.avatar}` : `/uploads/default.jpg`

    // document.getElementById('pfp').src = '/uploads/' + user.thumbnail;


    const {data: result} = await axiosInstance.get("/follow/followers/" + userId);
    const {data: result2} = await axiosInstance.get("/follow/following/" + userId);

    const {data: getMe} = await axiosInstance.get("/auth/me")
    // console.log(getMe);

    meId = getMe.data.id
    

    const { data: result3 } = await axiosInstance.get(
      `/follow/following/${meId}`
    );

    // console.log(result3);

    document.getElementById("btnFollow").setAttribute("onclick", `toggleFollow(${userId}, this)`)

    if (result3.data.some(item => item.id === userId)){
      document.getElementById("btnFollow").innerText = `Unfollow`
    }else{
      document.getElementById("btnFollow").innerText = `Follow`
    }
    // console.log(meId, userId);
    
    if(meId == userId){
      document.getElementById("btnFollow").classList.add("d-none")
    }
    

    // console.log(result);

    const {data: followers} = result
    const {data: following} = result2

    document.getElementById('total-follower').innerText = followers.length
    document.getElementById('total-following').innerText = following.length
    document.getElementById('pfp').src = avatar

    if(!user.Organizer_info.id){
      document.getElementById('name').innerText = user.eng_name;
      document.getElementById("organizer-info").classList.add("d-none")
      
      document.getElementById("event-list").innerHTML = `<div class="col-12">No event to show.</div>`
      document.getElementById("event-list").classList.add("h-auto");
      // console.log(document.getElementById("event-list").innerHTML);
      document.getElementById("select-sort").classList.add("d-none")
      document.getElementById("pagination").classList.add("d-none")
      document.getElementById("contactModal").classList.add("d-none");
      document.getElementById("openModalBtn").classList.add("d-none")
    }else{
      document.getElementById("contact-phone").innerText = user.Organizer_info.phone
      document.getElementById("contact-email").innerText = user.Organizer_info.email
      document.getElementById("contact-location").innerText = user.Organizer_info.location
      document.getElementById('name').innerText = user.Organizer_info.name;
      document.getElementById('smallName').innerText = user.eng_name;
      document.getElementById('social-media').innerHTML = `
      <a href="${user.Organizer_info.facebook}" id="fb" class="social-icon mx-0 social-icon-organizer ${!(user.Organizer_info.facebook) && "d-none"} fs-6" style="width: 36px;height: 36px;">
                    <i class="fab fa-facebook-f"></i>
                </a>
                <a href="${user.Organizer_info.telegram}" id="tel" class="social-icon mx-0 fs-6 ${!(user.Organizer_info.telegram) && "d-none"}" style="width: 36px;height: 36px;">
                    <i class="fab fa-telegram"></i>
                </a>
                <a href="${user.Organizer_info.tiktok}" id="tt" class="social-icon mx-0  fs-6 ${!(user.Organizer_info.tiktok) && "d-none"}" style="width: 36px;height: 36px;">
                    <i class="fab fa-tiktok"></i>
                </a>
                <a href="${user.Organizer_info.linkin}" id="li" class="social-icon mx-0 fs-6 ${!(user.Organizer_info.linkin) && "d-none"}" style="width: 36px;height: 36px;">
                    <i class="fab fa-linkedin-in"></i>
                </a>`

                renderEvents();

      document.getElementById("contactModal").innerHTML = `
      <div class="close-button-container">
            <a href="#" class="close-button">
                <i data-lucide="x"></i>
            </a>
        </div>
        
        <div class="modal-header mb-4 d-flex flex-column align-items-start">
            <h2 class="modal-title">Contact</h2>
            <p class="modal-subtitle">Get in touch with ${user.Organizer_info.name}</p>
        </div>
        
        <div class="contact-list">
            <div class="contact-item-container">
                <div class="contact-item has-link" onclick="window.open('tel:${user.Organizer_info.phone}', '_blank')">
                    <div class="social-icon social-icon-phone">
                        <i class="fa-solid fa-phone"></i>
                    </div>
                    <div class="contact-item-content">
                        <p class="contact-item-label">Phone</p>
                        <p class="contact-item-value mb-0">${user.Organizer_info.phone}</p>
                    </div>
                    <div class="contact-item-icon">
                        <i data-lucide="external-link"></i>
                    </div>
                </div>
            </div>
            <div class="contact-item-container">
                <div class="contact-item has-link" onclick="window.open('mailto:${user.Organizer_info.email}', '_blank')">
                    <div class="social-icon social-icon-email">
                        <i class="fa-solid fa-envelope"></i>
                    </div>
                    <div class="contact-item-content">
                        <p class="contact-item-label">Email</p>
                        <p class="contact-item-value mb-0">${user.Organizer_info.email}</p>
                    </div>
                    <div class="contact-item-icon">
                        <i data-lucide="external-link"></i>
                    </div>
                </div>
            </div>
            <div class="contact-item-container ${!(user.Organizer_info.facebook) && "d-none"}">
                <div class="contact-item has-link" onclick="window.open('${user.Organizer_info.facebook}', '_blank')">
                    <div class="social-icon social-icon-facebook">
                        <i class="fab fa-facebook-f"></i>
                    </div>
                    <div class="contact-item-content">
                        <p class="contact-item-label">Facebook</p>
                        <p class="contact-item-value mb-0">${user.Organizer_info.facebook}</p>
                    </div>
                    <div class="contact-item-icon">
                        <i data-lucide="external-link"></i>
                    </div>
                </div>
            </div>
            <div class="contact-item-container ${!(user.Organizer_info.telegram) && "d-none"}">
                <div class="contact-item has-link" onclick="window.open('${user.Organizer_info.telegram}', '_blank')">
                    <div class="social-icon social-icon-instagram">
                        <i class="fab fa-telegram"></i>
                    </div>
                    <div class="contact-item-content">
                        <p class="contact-item-label">Telegram</p>
                        <p class="contact-item-value mb-0">${user.Organizer_info.telegram}</p>
                    </div>
                    <div class="contact-item-icon">
                        <i data-lucide="external-link"></i>
                    </div>
                </div>
            </div>
            <div class="contact-item-container ${!(user.Organizer_info.linkin) && "d-none"}">
                <div class="contact-item has-link" onclick="window.open('${user.Organizer_info.linkin}', '_blank')">
                    <div class="social-icon social-icon-linkedin">
                        <i class="fab fa-linkedin-in"></i>
                    </div>
                    <div class="contact-item-content">
                        <p class="contact-item-label">LinkedIn</p>
                        <p class="contact-item-value mb-0">${user.Organizer_info.linkin}</p>
                    </div>
                    <div class="contact-item-icon">
                        <i data-lucide="external-link"></i>
                    </div>
                </div>
            </div>
            <div class="contact-item-container ${!(user.Organizer_info.tiktok) && "d-none"}">
                <div class="contact-item has-link" onclick="window.open('${user.Organizer_info.tiktok}', '_blank')">
                    <div class="social-icon social-icon-tiktok">
                        <i class="fab fa-tiktok"></i>
                    </div>
                    <div class="contact-item-content">
                        <p class="contact-item-label">TikTok</p>
                        <p class="contact-item-value mb-0">${user.Organizer_info.tiktok}</p>
                    </div>
                    <div class="contact-item-icon">
                        <i data-lucide="external-link"></i>
                    </div>
                </div>
            </div>
        </div>`
    }
    

    
  } catch (error) {
    console.log(error);
    showToast();
  }
}

async function renderEvents(page = 1, perpage = 10, is_published = true) {
  const eventList = document.getElementById("event-list");
  eventList.innerHTML = "";

  const dateStatus = document.getElementById("select-sort").value;

  let queryParams = new URLSearchParams();

  if(dateStatus){
    queryParams.append("date_status", dateStatus)
  }

  queryParams.append("sort", "created_at");

  queryParams.append("creator", userId)

  queryParams.append("page", `${page}`);
  queryParams.append("is_published", `${is_published}`);
  queryParams.append("perpage", `${perpage}`);

  try {
    let qryStr = queryParams.toString();

    // console.log(qryStr);

    const { data } = await axiosInstance.get(`/events?${qryStr}`);
    const { data: events, paginate } = data;
    document.getElementById('total-event').innerText = paginate.total;
    document.getElementById('total-event-2').innerText = paginate.total;
    // console.log(data);

    if(events.length == 0){
      document.querySelector('.pagination-container').classList.add("d-none")
      return eventList.innerHTML = `<div class="text-center w-100 my-5">
              <img src="/img/noFound.png" alt="..." height="220px;">
              <h4 class="text-center text-brand mt-2">No Event to Display</h4>
            </div>`
    }



    events.forEach((event) => {
      let pricing = null;
      // Get the current date and time
      //         const eventDate = new Date(event.started_date);
      //         const endDate = new Date(event.ended_date);

      //         const currentDate = new Date();
      //   currentDate.setHours(0, 0, 0, 0);
      //         let eventStatus = null;

      //         console.log(eventDate);
      //         console.log(currentDate);
      //         console.log(endDate);

      //         if (currentDate < eventDate) {
      //           eventStatus = "Upcoming";
      //         } else if (currentDate >= eventDate && currentDate <= endDate) {
      //           eventStatus = "Showing";
      //         } else {
      //           eventStatus = "Past";
      //         }

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
                                <div class="event-details" style="cursor: pointer;" onclick="goEventDetail(${
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

    // Initialize pagination on load
    renderPagination(paginate);
  } catch (error) {
    console.log(error);
    showToast();
  }
}

getOrganizer() 

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

  document.getElementById("prevBtn").onclick = () =>
    changePage(currentPage - 1);
  document.getElementById("nextBtn").onclick = () =>
    changePage(currentPage + 1);
}

async function changePage(newPage) {
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set("page", newPage); // Update page parameter

  await renderEvents(newPage); // Call renderEvents with new page
}

async function toggleFollow(id, btn) {
  try {
    const { data } = await axiosInstance.get(`/follow/following/${meId}`);
    const { data: following } = data;

    const isFollowing = following.some((follower) => follower.id === id);
    // console.log(isFollowing);

    if (isFollowing) {
      await axiosInstance.delete(`/follow/unfollow/${id}`);
      showToast(true, "Unfollowed Successfully");
      btn.innerText = "Follow";
    } else {
      await axiosInstance.post(`/follow/${id}`);
      showToast(true, "Followed Successfully");
      btn.innerText = "Unfollow";
    }
  } catch (error) {
    console.log(error);
    showToast();
  }
}

document.getElementById("select-sort").onchange = async (e)=>{
  await renderEvents()
}