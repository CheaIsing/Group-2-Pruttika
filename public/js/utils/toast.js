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

const btnShowLoading = (id) => {
  const btnEle = document.getElementById(id);
  console.log(btnEle);
  
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

  console.log(url);
  

  window.navigator.clipboard.writeText(url).then(() => {
    showToast(true, "Copied to Clipboard.");
  });
}

async function addWishlist(id, btn) {
    // console.log(btn);
  try {
    btn.disabled = true
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