let notiUnreadCount = 0;
async function getAllNotifications() {
  try {
    const { data } = await axiosInstance.get("/notification");
    const { data: json } = data;
    // console.log(json);

    let notiHtml = "";
    let notiUnreadHtml = "";
    

    const notisUnread = [];

    document.getElementById("notiUnreadCount");

    if (json.length > 0) {
      json.forEach((noti) => {
        const title = noti.eng_title;
        const message = noti.eng_message;

        let status = "";
        switch (noti.type.type_id) {
          case 1:
          case 3: {
            status = `<div
                                          class="d-flex align-items-center justify-content-center"
                                          style="width: 3rem;height: 3rem;border-radius: 50%; background-color: #DCFCE7; color: #37CC6D;">
                                          <i data-lucide="check"
                                              style="width: 1.5rem;height: 1.5rem;"></i>
                                      </div>`;
            break;
          }
          case 2:
          case 4: {
            status = `<div
                                          class="d-flex align-items-center justify-content-center"
                                          style="width: 3rem;height: 3rem;border-radius: 50%; background-color: #FEE2E2; color: #EF4444;">
                                          <i data-lucide="x"
                                              style="width: 1.5rem;height: 1.5rem;"></i>
                                      </div>
                      `;
            break;
          }
          default: {
            status = `<div
                                          class="d-flex align-items-center justify-content-center"
                                          style="width: 3rem;height: 3rem;border-radius: 50%; background-color: #DBEAFE; color: #3B82F6;">
                                          <i data-lucide="info"
                                              style="width: 1.5rem;height: 1.5rem;"></i>
                                      </div>
                      `;
          }
        }

        if (!noti.is_read) {
          notiUnreadCount++;
          notisUnread.push(noti);
          notiUnreadHtml += `<div class="col-12">
                    
          <div class="notification mb-3 py-3 rounded-3 d-flex align-items-start noti-hover" >
              <!-- <div class="line-style-noti me-3"></div> -->
              <div class="d-flex align-items-start justify-content-between w-100" onclick='showNotificationDetail(${JSON.stringify(noti)})'>
                  <div class="d-flex">
                      <div class="me-2">
                          ${status}
                      </div>
                      </div>
      
                      <div class="message mt-1">
                          <h6
                              style="color: #333;font-size: 1.2rem;">${title}</h6>
                          <div
                              class="d-flex align-items-center">
                              <p class="content mb-2 text-1-line"
                                  style="color: #4b5563;"
                                  id="message">${message}</p>
      
                          </div>
                          <div style="color: #4b5563;"
                              class="d-flex align-items-center">
                              <i
                                  data-lucide="clock"
                                  style="stroke-width: 1.25; width: 1.25rem;" class=""></i>
                              <div class="ms-2 me-3">${moment(noti.created_at)
                                .fromNow()}</div> 
                              ${
                                noti.is_read
                                  ? ""
                                  : `<div
                                  class="icon-unread bg-brand"  id="noti-read-${noti.id}"></div>`
                              }
                          </div>
                          
                              
                         
                      </div>
                  </div>
  
                  <div class="dropdown">
                      <button
                          type="button"
                          class="btn btn-icon border-0 rounded-pill dropdown-toggle hide-arrow"
                          data-bs-toggle="dropdown"
                          aria-expanded="false">
                          <i
                              data-lucide="ellipsis-vertical"></i>
                      </button>
                      <ul
                          class="dropdown-menu dropdown-menu-end">
                          <li><a role="button" class="dropdown-item ${
                            noti.is_read && "d-none"
                          }"
                                  onclick="markNotification(${
                                    noti.id
                                  }, this)" >Mark As Read</a></li>
                          
                          <li><a role="button" class="dropdown-item"
                                  onclick="deleteNotification(${
                                    noti.id
                                  }, this)">Delete</a></li>
                          
                      </ul>
                  </div>
  
              </div>
              
             
          </div>
      </div>`;
        }

        notiHtml += `<div class="col-12">
                                  <div class="notification mb-3 py-3 rounded-3 d-flex align-items-start noti-hover">
                                      <!-- <div class="line-style-noti me-3"></div> -->
                                      <div class="d-flex align-items-start justify-content-between w-100" onclick='showNotificationDetail(${JSON.stringify(noti)})'>
                                          <div class="d-flex">
                                              <div class="me-2">
                                                  ${status}
                                              </div>
                                              </div>
                              
                                              <div class="message mt-1">
                                                  <h6
                                                      style="color: #333;font-size: 1.2rem;">${title}</h6>
                                                  <div
                                                      class="d-flex align-items-center">
                                                      <p class="content mb-2 text-1-line"
                                                          style="color: #4b5563;"
                                                          id="message">${message} </p>
                              
                                                  </div>
                                                  <div style="color: #4b5563;"
                                                      class="d-flex align-items-center">
                                                      <i
                                                          data-lucide="clock"
                                                          style="stroke-width: 1.25; width: 1.25rem;" class=""></i>
                                                      <div class="ms-2 me-3">${moment(noti.created_at)
                                .fromNow()}</div> 
                                                      ${
                                                        noti.is_read
                                                          ? ""
                                                          : `<div
                                                          class="icon-unread bg-brand"></div>`
                                                      }
                                                  </div>
                                                 
                                              </div>
                                          </div>
                          
                                          <div class="dropdown">
                                              <button
                                                  type="button"
                                                  class="btn btn-icon border-0 rounded-pill dropdown-toggle hide-arrow"
                                                  data-bs-toggle="dropdown"
                                                  aria-expanded="false">
                                                  <i
                                                      data-lucide="ellipsis-vertical"></i>
                                              </button>
                                              <ul
                                                  class="dropdown-menu dropdown-menu-end">
                                                  <li><a role="button" class="dropdown-item ${
                                                    noti.is_read && "d-none"
                                                  }"
                                                          onclick="markNotification(${
                                                            noti.id
                                                          }, this)" >Mark As Read</a></li>
                                                  
                                                  <li><a role="button" class="dropdown-item"
                                                          onclick="deleteNotification(${
                                                            noti.id
                                                          }, this)">Delete</a></li>
                                                  
                                              </ul>
                                          </div>
                          
                                      </div>
                                      
                                     
                                  </div>
                              </div>`;
      });
    } else {
      notiHtml = `<div class="text-center w-100 my-5">
        <img src="/img/noFound.png" alt="..." height="220px;">
        <h4 class="text-center text-brand mt-2">No Notification to Display</h4>
      </div>`;

      notiUnreadHtml = `<div class="text-center w-100 my-5">
        <img src="/img/noFound.png" alt="..." height="220px;">
        <h4 class="text-center text-brand mt-2">No Notification to Display</h4>
      </div>`;
    }

    if (notiUnreadCount > 0) {
      document.getElementById(
        "notiUnreadCount"
      ).innerText = `(${notiUnreadCount})`;
      document.getElementById("pills-home").classList.remove("show", "active");
      document.getElementById("pills-profile").classList.add("show", "active");
      document.getElementById("pills-home-tab").classList.remove("active");
      document.getElementById("pills-profile-tab").classList.add("active");
    } else {
      document.getElementById("pills-home").classList.add("show", "active");
      document
        .getElementById("pills-profile")
        .classList.remove("show", "active");
      document.getElementById("pills-home-tab").classList.add("active");
      document.getElementById("pills-profile-tab").classList.remove("active");
      notiUnreadHtml = `<div class="text-center w-100 my-5">
        <img src="/img/noFound.png" alt="..." height="220px;">
        <h4 class="text-center text-brand mt-2">No Notification to Display</h4>
      </div>`;
    }

    document.getElementById("notification-container").innerHTML = notiHtml;
    document.getElementById("notification-container-unread").innerHTML =
      notiUnreadHtml;
    lucide.createIcons();
  } catch (error) {
    console.log(error);
  }
}
getAllNotifications();

document.getElementById("btnMarkAll").addEventListener("click", async (e) => {
  try {
    await axiosInstance.put("/notification/read");
    showToast(true, "Marked all notification successfully.");
    document.querySelectorAll(".icon-unread").forEach((btn) => {
      btn.remove();
    });
  } catch (error) {
    console.log(error);

    showToast();
  }
});

async function deleteNotification(id, btn) {
  try {
    await axiosInstance.delete("/notification/" + id);
    showToast(true, "Notification deleted successfully.");
    const notification = btn.closest(".notification");
    if (notification && notification.parentElement) {
      notification.parentElement.remove();
    }
  } catch (error) {
    console.log(error);

    showToast();
  }
}

async function markNotification(id, btn) {
  try {
    await axiosInstance.put("/notification/read/" + id);
    showToast(true, "Notification marked successfully.");
    const unread = btn.closest(".notification").querySelector(".icon-unread");
    if (unread) {
      unread.remove();
    }
    document.getElementById(
      "notiUnreadCount"
    ).innerText = `(${notiUnreadCount - 1})`;
  } catch (error) {
    console.log(error);

    showToast();
  }
}

async function updateEventLink(id, btn) {
  const link = btn.closest(".ticket-notification").querySelector("input").value;
  const schema = Joi.object({
    event_link: Joi.string().uri().required(),
  });
  const { error } = schema.validate({ event_link: link });
  if (error) {
    return btn
      .closest(".ticket-notification")
      .querySelector(".input-field")
      .classList.add("is_invalid");
  } else {
    btn
      .closest(".ticket-notification")
      .querySelector(".input-field")
      .classList.remove("is_invalid");
  }
  try {
    const result = await axiosInstance.post("/notification/set-link/" + id, {
      event_link: link,
    });
    // console.log(result);
    // console.log(id);
    
    // console.log(link);
    
    
    showToast(true, "Event Online has sent to attendees successfully.");
  } catch (error) {
    console.log(error);
    if(error.response && error.response.data && error.response.data.message ){
      return showToast(false, error.response.data.message)
    }
    showToast();
  }
}
async function showNotificationDetail(noti) {
  try {
    // console.log(noti);
    let status = "";
    let link = ""
    switch (noti.type.type_id) {
      case 1:
      case 2: {
        link = `<p><a href="/ticket/my-ticket" class="link text-brand ">Go to My Ticket</a></p>`
        break;
      }

      case 3:
      case 4: {
        link = `<p><a href="/profile/organizer-view" class="link text-brand ">Go to Organizer Setting</a></p>`
        break;
      }

      case 5: 
      case 6:
      case 7:{
        link = `<p><a href="/event/detail?e=${noti.event.id}" class="link text-brand ">Go to Event Detail</a></p>`
      }
    }
    switch (noti.type.type_id) {
      case 1:
      case 3: {
        status = `<div
                                      class="d-flex align-items-center justify-content-center"
                                      style="width: 2rem;height: 2rem;border-radius: 50%; background-color: #DCFCE7; color: #37CC6D;">
                                      <i data-lucide="check"
                                          style="width: 1rem;height: 1rem;"></i>
                                  </div>`;
        
        break;
      }
      case 2:
      case 4: {
        status = `<div
                                      class="d-flex align-items-center justify-content-center"
                                      style="width: 2rem;height: 2rem;border-radius: 50%; background-color: #FEE2E2; color: #EF4444;">
                                      <i data-lucide="x"
                                          style="width: 1rem;height: 1rem;"></i>
                                  </div>
                  `;
                  
        break;
      }
      default: {
        status = `<div
                                      class="d-flex align-items-center justify-content-center"
                                      style="width: 2rem;height: 2rem;border-radius: 50%; background-color: #DBEAFE; color: #3B82F6;">
                                      <i data-lucide="info"
                                          style="width: 1rem;height: 1rem;"></i>
                                  </div>
                  `;
      }
    }

    // return
    
    // Fetch API to mark notification as read
    // await axiosInstance.put(`/notification/read/${notiId}`, { is_read: true });

    // Update modal content
    document.getElementById("modal-noti-content").innerHTML = `
    <div class="modal-header d-flex justify-content-between mb-3">
                      <div class="d-flex align-items-center">
                          ${status}
                          <h5 class="modal-title mb-0 ms-2" style="font-size: 1rem;" id="notificationModalLabel">${noti.eng_title}</h5>
                      </div>
                      
                      <div class="d-flex align-items-center">
                          <small class="mt-1">${moment(noti.created_at).format('lll')}</small>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
            
                    </div>
    <div class="ticket-notification">
    
                            <div class="notif-content">
                                <p>${noti.eng_message}</p>
                                <!-- Online Link -->
                          <div class="my-3 d-flex ${
                            noti.type.type_id != 7 && "d-none"
                          } w-100">
                                  <div class="w-100">
                                  <div class="input-field input-field-setting input-group px-0 d-flex" id="input-field-confirm-new-password" style="height: 40px !important;border-right: 0 !important; border-top-right-radius: 0 !important;border-bottom-right-radius: 0 !important;">
                                      <i class="fa-solid fa-link fs-6"></i>
                                      <input type="text" placeholder="Online Event Link"
                                      ${
                                        noti.type.type_id == 7 &&
                                        `id="event-link-${noti.event.id}"`
                                      }
                                         />
                                        
                                    </div>
                                    
                                    <div
                                      class="invalid_feedback text-danger d-flex align-items-center mb-2"
                                      id="invalid_feedback_confirm_new_password">
                                      <i
                                        class="bi bi-exclamation-triangle-fill d-flex align-items-center"></i>
                                      <div class="ms-2">Invalid Url Link.</div>
                                    </div>
                                    
                                  </div>
                                  
                                  
                                      <button onclick="updateEventLink(${
                                        noti.event.id
                                      }, this)" style="height: 40px !important;border-right: 0 !important; border-top-left-radius: 0 !important;border-bottom-left-radius: 0 !important;" type="button" class="btn btn-brand fw-normal">Send</button>
                                  
                              </div>
                                ${link}
                            </div>
                            <div class="notif-footer ${(noti.type.type_id == 3 || noti.type.type_id == 4) && "d-none"}">
                                <div class="user-info">

                                    <img src="/uploads/${noti.sender.avatar != null ? noti.sender.avatar : "default.jpg"}" alt="User Profile" class="rounded-circle border-brand-sm">

                                    <div>
                                        <h6 class="mb-1">${noti.sender.eng_name}</h6>
                                        Event Organizer
                                    </div>
                                </div>
                                <div class="event-infoss">
                                    Event: ${noti.event.eng_name}
                                </div>
                            </div>
                        </div>`
                        lucide.createIcons();
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('notificationModal'));
    modal.show();



    // console.log(document.getElementById(`noti-read-${noti.id}`));
    
    if(document.getElementById(`noti-read-${noti.id}`)){
      await axiosInstance.put("/notification/read/"+noti.id)
      document.getElementById(`noti-read-${noti.id}`).remove();
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
    showToast();
  }
}