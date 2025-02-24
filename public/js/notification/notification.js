async function getAllNotifications() {
  try {
    const { data } = await axiosInstance.get("/notification");
    const { data: json } = data;
    console.log(json);

    let notiHtml = "";
    let notiUnreadHtml = "";
    let notiUnreadCount = 0;

    const notisUnread = []

    document.getElementById("notiUnreadCount")
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

      if(!noti.is_read){
        notiUnreadCount++;
        notisUnread.push(noti)
        notiUnreadHtml +=  `<div class="col-12">
        <div class="notification mb-3 py-3 rounded-3 shadow-hover d-flex align-items-start">
            <!-- <div class="line-style-noti me-3"></div> -->
            <div class="d-flex align-items-start justify-content-between w-100">
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
                            <p class="content mb-2"
                                style="color: #4b5563;"
                                id="message">${message}</p>
    
                        </div>
                        <div style="color: #4b5563;"
                            class="d-flex align-items-center">
                            <i
                                data-lucide="clock"
                                style="stroke-width: 1.25; width: 1.25rem;" class=""></i>
                            <div class="ms-2 me-3">${moment(
                              noti.created_at
                            )
                              .startOf("day")
                              .fromNow()}</div> 
                            ${
                              noti.is_read
                                ? ""
                                : `<div
                                class="icon-unread bg-brand"></div>`
                            }
                        </div>
                        <!-- Online Link -->
                        <div class="mt-3 d-flex ${
                          noti.type.type_id != 7 &&
                          "d-none"
                        } w-100">
                            
                           
                                <div class="w-100">
                                <div class="input-field input-field-setting input-group px-0 d-flex" id="input-field-confirm-new-password" style="height: 40px !important;border-right: 0 !important; border-top-right-radius: 0 !important;border-bottom-right-radius: 0 !important;">
                                    <i class="fa-solid fa-link fs-6"></i>
                                    <input type="text" placeholder="Online Event Link"
                                    ${
                                      noti.type
                                        .type_id == 7 &&
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
                                
                                
                                    <button onclick="updateEventLink(${noti.event_id}, this)" style="height: 40px !important;border-right: 0 !important; border-top-left-radius: 0 !important;border-bottom-left-radius: 0 !important;" type="button" class="btn btn-brand fw-normal">Send</button>
                                
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
                        <li><a role="button" class="dropdown-item ${noti.is_read && "d-none"}"
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
                                <div class="notification mb-3 py-3 rounded-3 shadow-hover d-flex align-items-start">
                                    <!-- <div class="line-style-noti me-3"></div> -->
                                    <div class="d-flex align-items-start justify-content-between w-100">
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
                                                    <p class="content mb-2"
                                                        style="color: #4b5563;"
                                                        id="message">${message}</p>
                            
                                                </div>
                                                <div style="color: #4b5563;"
                                                    class="d-flex align-items-center">
                                                    <i
                                                        data-lucide="clock"
                                                        style="stroke-width: 1.25; width: 1.25rem;" class=""></i>
                                                    <div class="ms-2 me-3">${moment(
                                                      noti.created_at
                                                    )
                                                      .startOf("day")
                                                      .fromNow()}</div> 
                                                    ${
                                                      noti.is_read
                                                        ? ""
                                                        : `<div
                                                        class="icon-unread bg-brand"></div>`
                                                    }
                                                </div>
                                                <!-- Online Link -->
                                                <div class="mt-3 d-flex ${
                                                  noti.type.type_id != 7 &&
                                                  "d-none"
                                                } w-100">
                                                    
                                                   
                                                        <div class="w-100">
                                                        <div class="input-field input-field-setting input-group px-0 d-flex" id="input-field-confirm-new-password" style="height: 40px !important;border-right: 0 !important; border-top-right-radius: 0 !important;border-bottom-right-radius: 0 !important;">
                                                            <i class="fa-solid fa-link fs-6"></i>
                                                            <input type="text" placeholder="Online Event Link"
                                                            ${
                                                              noti.type
                                                                .type_id == 7 &&
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
                                                        
                                                        
                                                            <button onclick="updateEventLink(${noti.event_id}, this)" style="height: 40px !important;border-right: 0 !important; border-top-left-radius: 0 !important;border-bottom-left-radius: 0 !important;" type="button" class="btn btn-brand fw-normal">Send</button>
                                                        
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
                                                <li><a role="button" class="dropdown-item ${noti.is_read && "d-none"}"
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

    if(notiUnreadCount >0){
        document.getElementById("notiUnreadCount").innerText = `(${notiUnreadCount})`
        document.getElementById("pills-home").classList.remove("show", "active");
        document.getElementById("pills-profile").classList.add("show", "active");
        document.getElementById("pills-home-tab").classList.remove("active");
        document.getElementById("pills-profile-tab").classList.add("active");
    }else{
        document.getElementById("pills-home").classList.add("show", "active");
        document.getElementById("pills-profile").classList.remove("show", "active");
        document.getElementById("pills-home-tab").classList.add("active");
        document.getElementById("pills-profile-tab").classList.remove("active");
    }

    document.getElementById("notification-container").innerHTML = notiHtml;
    document.getElementById("notification-container-unread").innerHTML = notiUnreadHtml;
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
        await axiosInstance.put("/notification/" + id);
        showToast(true, "Notification marked successfully.");
        const unread = btn.closest(".notification").querySelector(".icon-unread");
        if (unread) {
            unread.remove();
        }
      } catch (error) {
        console.log(error);
    
        showToast();
      }
}

async function updateEventLink(id, btn){
    const link = btn.closest(".notification").querySelector("input").value;
    const schema = Joi.object({
        event_link: Joi.string().uri().required()
      });
      const {error} = schema.validate({event_link: link});
      if(error){
        return btn.closest(".notification").querySelector(".input-field").classList.add("is_invalid")
      }else{
        btn.closest(".notification").querySelector(".input-field").classList.remove("is_invalid")
      }
    try {
        await axiosInstance.post("/notification/set-link/"+id, {event_link: link})
        showToast(true, "Event Online has sent to attendees successfully.");
    } catch (error) {
        console.log(error);
        
        showToast()
    }
}