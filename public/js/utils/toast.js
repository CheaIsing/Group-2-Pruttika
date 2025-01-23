const showToast = (result = false, msg = "Something went wrong. Please try again later.") => {
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
