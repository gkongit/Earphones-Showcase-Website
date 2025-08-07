let nextButton = document.getElementById("next");
let prevButton = document.getElementById("prev");
let backButton = document.getElementById("back");
let seeMoreButton = document.querySelectorAll(".seeMore");
let carousel = document.querySelector(".carousel");
let listHTML = document.querySelector(".carousel .list");

nextButton.onclick = function () {
  showSlider("next");
};

prevButton.onclick = function () {
  showSlider("prev");
};

let unAcceptClick;
const showSlider = (type) => {
  nextButton.style.pointerEvents = "none";
  prevButton.style.pointerEvents = "none";

  carousel.classList.remove("prev", "next");
  let items = document.querySelectorAll(".carousel .list .item");
  if (type === "next") {
    listHTML.appendChild(items[0]);
    carousel.classList.add("next");
  } else {
    let positionLast = items.length - 1;
    listHTML.prepend(items[positionLast]);
    carousel.classList.add("prev");
  }

  clearTimeout(unAcceptClick);
  unAcceptClick = setTimeout(() => {
    nextButton.style.pointerEvents = "auto";
    prevButton.style.pointerEvents = "auto";
  }, 1000);
};

seeMoreButton.forEach((button) => {
  button.onclick = function () {
    carousel.classList.add("showDetail");
  };
});

backButton.onclick = function () {
  carousel.classList.remove("showDetail");
};

document
  .querySelectorAll(
    ".carousel .list .item:not(:nth-child(2)) a, .carousel .list .item:not(:nth-child(2)) button, .carousel .list .item:not(:nth-child(2)) img"
  )
  .forEach((el) => {
    el.setAttribute("tabindex", "-1");
  });

document
  .querySelectorAll(
    ".carousel .list .item:nth-child(2) a, .carousel .list .item:nth-child(2) button, .carousel .list .item:not(:nth-child(2)) img"
  )
  .forEach((el) => {
    el.removeAttribute("tabindex");
  });
