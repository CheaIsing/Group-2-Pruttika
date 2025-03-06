const headerNavbar = document.getElementById("header");
const toggleClass = "is-sticky";

if (headerNavbar) {
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 1500) {
      headerNavbar.classList.add(toggleClass);
    } else {
      headerNavbar.classList.remove(toggleClass);
    }
  });
}

const notiWrapper = document.getElementById("noti-wrapper")

if(notiWrapper){
  getAllNotifications()
}

async function getAllNotifications() {
  try {
    const { data } = await axiosInstance.get("/notification?order=asc&read=false");
    const { data: json } = data;

    let notiUnreadHtml = ""
    let unreadCount = json.length

    document.getElementById("unreadCount1").innerText = unreadCount
    document.getElementById("unreadCount2").innerText = unreadCount

    if(json.length <= 0){

      document.getElementById("noti-wrapper").innerHTML =  `
      <div class="notification text-center w-100 my-4 d-flex flex-column">
              <img src="/img/noFound.png" alt="..." height="180px;">
              <h4 class="text-center text-brand mt-2">No Notification to Display</h4>
            </div>`

      return 
    }

    json.forEach((noti) => {
      const title = noti.eng_title;
      const message = noti.eng_message;

      let status = "";
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

      
        notiUnreadHtml +=  `<div>
        <div class="notification pt-3 rounded-3 shadow-hover d-flex align-items-start">
            <!-- <div class="line-style-noti me-3"></div> -->
            <div class="d-flex align-items-start justify-content-between w-100">
                <div class="d-flex">
                    <div class="me-1">
                        ${status}
                    </div>
                    </div>
    
                    <div class="message">
                        <h6
                            style="color: #333;">${title}</h6>
                        <div
                            class="d-flex align-items-center">
                            <small class="content mb-2 text-1-line"
                                style="color: #4b5563;"
                                id="message">${message}</small>
    
                        </div>
                        <div style="color: #4b5563;"
                            class="d-flex align-items-center">
                            <i
                                data-lucide="clock"
                                style="stroke-width: 1.25; width: 1rem;" class=""></i>
                            <small class="ms-2 me-2">${moment(
                              noti.created_at
                            )
                              .startOf("day")
                              .fromNow()}</small> 
                           
                               <div
                                class="icon-unread bg-brand"></div>
                            
                        </div>
    
                    </div>
                </div>

                <!-- <div class="dropdown">
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
                </div> -->

            </div>
            
           
        </div>
    </div>`;
      
  })

    document.getElementById("noti-wrapper").innerHTML = notiUnreadHtml;
    lucide.createIcons();
  } catch (error) {
    console.log(error);
  }
}

let searchClicked = document.getElementById("searchEvent");

if (searchClicked) {
  searchClicked.addEventListener("focus", () => {
    let searchEventbyName = document.getElementById("searchEvent").value;
    if (searchEventbyName == "") {
      document.querySelector(".search-dropdown").style.display = "none";
    } else {
      document.querySelector(".search-dropdown").style.display = "block";
      document.querySelector(".overlay").style.display = "block";
    }
  });

  searchClicked.addEventListener("blur", () => {
    document.querySelector(".overlay").style.display = "none";
    // document.querySelector('.search-dropdown').style.display = 'none';
  });
  document.getElementById("searchEvent").addEventListener("keyup", async function () {
    let searchEventbyName = document.getElementById("searchEvent").value;

    document.getElementById("search-dropdown").style.display = "block";
    if (searchEventbyName == "") {
      document.querySelector(".search-dropdown").style.display = "none";
    }

    try {
      const {data} = await axiosInstance.get(`/events?search=${searchEventbyName}`);
      const {data: events} = data;
      let searchList = "";
        if (events.length == 0) {
          searchList = `<li class="search-dropdown-item">
                                <i class="fa-solid fa-magnifying-glass text-brand fs-6 pe-2"></i>
                                <span>No result</span>
                            </li>`;
        } else {
          events.slice(0, 5).forEach((element) => {
            searchList += `<li class="search-dropdown-item" style="cursor: pointer;" onclick="goEventDetail(${
                                                  element.id
                                                })">
                                  <i class="fa-solid fa-magnifying-glass text-brand fs-6 pe-2"></i>
                                  <span>${element.eng_name}</span>
                              </li>`;
          });
        }
        document.getElementById("search-dropdown").innerHTML = searchList;

    } catch (error) {
      console.log(error);
      
    }

  });
}