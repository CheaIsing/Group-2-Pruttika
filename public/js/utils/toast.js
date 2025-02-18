const showToast = (
  result = false,
  msg = "Something went wrong. Please try again later."
) => {
  const styleBg = result
    ? `linear-gradient(to right, rgb(251, 45, 155), #FF1694)`
    : `linear-gradient(to right,rgb(231, 57, 74), #dc3545)`;

  Toastify({
    text: msg,
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
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

  console.log(window.location.href);
  

  navigator.clipboard.writeText(url).then(() => {
    showToast("Event URL copied to clipboard:", true);
  });
}