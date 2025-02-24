const header = document.getElementById("header");
const toggleClass = "is-sticky";

if (header) {
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 1500) {
      header.classList.add(toggleClass);
    } else {
      header.classList.remove(toggleClass);
    }
  });
}