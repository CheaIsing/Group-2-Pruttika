const header = document.getElementById("header");

const toggleClass = "is-sticky";

window.addEventListener("scroll", () => {
  if (header) {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 150) {
      header.classList.add(toggleClass);
    } else {
      header.classList.remove(toggleClass);
    }
  }
});
