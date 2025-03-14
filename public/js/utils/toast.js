const showToast = (
  result = false,
  msg = "Something went wrong. Please try again later.",
  gravity = "top",
  position= "center", 
  close = true
) => {
  const styleBg = result
    ? `linear-gradient(to right, rgb(251, 45, 155), #FF1694)`
    : `linear-gradient(to right,rgb(231, 57, 74), #dc3545)`;

  Toastify({
    // avatar: "https://static-00.iconduck.com/assets.00/success-icon-2048x2048-8woikx05.png",
    text: msg,
    duration: 3000,
    newWindow: true,
    close,
    gravity, // `top` or `bottom`
    position, // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: styleBg,
      boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.12)",
      borderRadius: "4px",
    },
  }).showToast();
};

const showNotification = (
  result = false,
  msg = "Something went wrong. Please try again later.",
  link = "/ticket/my-ticket",
  gravity = "top",
  position = "center",
  close = true,
  status = `<div
                                          class="d-flex align-items-center justify-content-center"
                                          style="width: 2.5rem;height: 2.5rem;border-radius: 50%; background-color: #DCFCE7; color: #37CC6D;">
                                          <i data-lucide="check"
                                              style="width: 1.2rem;height: 1.2rem;"></i>
                                      </div>`, // Add status (icon HTML) parameter
  title = "Notification Title", //add title parameter
  borderColor = "#37CC6D" // Add borderColor parameter with default value
) => {
  const styleBg = `#fff`;
  lucide.createIcons();

  Toastify({
    text: `<div class="notification rounded-3 shadow-hover d-flex align-items-start me-2">
              <div class="d-flex align-items-start justify-content-between w-100">
                  <div class="d-flex">
                      <div class="me-2 text-3-line">
                          ${status} 
                          
                      </div>
                  </div>
                  <div class="message px-1">
                      <h6 style="color: #333;font-size: 1rem;" class="mb-1">${title}</h6>
                      <div class="d-flex align-items-center">
                          <small class="content mb-0" style="color: #4b5563;" id="message">${msg}</small>
                      </div>
                  </div>
              </div>
          </div>`,
    duration: 20000,
    destination: link,
    newWindow: false,
    close: true,
    gravity,
    position,
    stopOnFocus: true,
    style: {
      background: styleBg,
      boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.12)",
      borderRadius: "4px",
      color: "#333",
      display: "flex",
      borderLeft: `4px solid ${borderColor}`, // Apply borderColor
      borderRight: "4px solid transparent",
    },
    escapeMarkup: false,
  }).showToast();
  lucide.createIcons();
};

const btnShowLoading = (id) => {
  const btnEle = document.getElementById(id);
  // console.log(btnEle);
  
  btnEle.disabled = true;
  btnEle.innerHTML = `<div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>`;
};

const btnCloseLoading = (id, msg) => {
  const btnEle = document.getElementById(id);
  btnEle.disabled = false;
  btnEle.innerHTML = msg;
};

function extractDate(isoString) {
  return isoString.split('T')[0]; // Extracts only the date part
}

function toHHMMFormat(timeValue) {
  // Split by colon
  const [hours, minutes] = timeValue.split(':');
  // Return as "HH:MM"
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}

function copyEventUrlToClipboard(eventId) {
  const url = `${window.location.protocol}//${window.location.host}/event/detail?e=${eventId}`;
  // console.log(url);

  if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
          .then(() => {
              showToast(true, "Copied to Clipboard.");
          })
          .catch(err => {
              console.error("Failed to copy: ", err);
              showToast(false, "Failed to copy. Please try again.");
          });
  } else {
      // Fallback method (using a temporary textarea)
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try{
          document.execCommand('copy');
          showToast(true, "Copied to Clipboard.");
      }catch(err){
          showToast(false, "Copying not supported in this browser.");
      }

      document.body.removeChild(textArea);
  }
}

async function addWishlist(id, btn) {
    // console.log(btn);
  try {
    btn.disabled = true
    const result = await axiosInstance("/auth/me")
    const {data} = await axiosInstance.get(`/wishlist/display/${id}`);

    if(data.result){
      await axiosInstance.delete(`wishlist/delete/${id}`);
      btn.classList.remove("active")
      showToast(true, "Event removed from wishlist.")
    }else{
      
      await axiosInstance.post("/wishlist/create", {event_id: id});
      btn.classList.add("active")
      showToast(true, "Event added to wishlist.")
    }

  } catch (error) {
    console.error(error);
    if (error.response && error.response.status == 401) {
      return window.location.href = "/auth/signin"
    }

    showToast()
  }finally{
    btn.disabled = false
  }
}

function goEventDetail(id){
  sessionStorage.setItem("event-detail-id", id);
  window.location.href = "/event/detail"
}

async function logOut (){
  try {

    await axiosInstance.delete("/auth/logout")
    showToast(true, "Logged out successfully.")

    setTimeout(()=>{
      window.location.href = "/"
    }, 1200)

  } catch (error) {
    
    console.log(error);
    showToast();

  }
}

function convertUtcToSpecificTimezone(utcDateString, targetTimezoneOffset = 0) {
  const utcDate = new Date(utcDateString);
  const targetTime = new Date(utcDate.getTime() + targetTimezoneOffset * 3600000); // offset in milliseconds

  const year = targetTime.getFullYear();
  const month = String(targetTime.getMonth() + 1).padStart(2, '0');
  const day = String(targetTime.getDate()).padStart(2, '0');
  const hours = String(targetTime.getHours()).padStart(2, '0');
  const minutes = String(targetTime.getMinutes()).padStart(2, '0');
  const seconds = String(targetTime.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

