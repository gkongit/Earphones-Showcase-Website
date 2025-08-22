let nextButton = document.getElementById("next");
let prevButton = document.getElementById("prev");
let backButton = document.getElementById("back");
let carousel = document.querySelector(".carousel");
let listHTML = document.querySelector(".carousel .list");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================================
// 1. Load products from JSON
// ================================
fetch("products.json")
  .then((res) => res.json())
  .then((products) => {
    products.forEach((product) => {
      const item = document.createElement("div");
      item.classList.add("item");

      item.innerHTML = `
        <img src="${product.image}" alt="${product.topic}">
        <div class="intro">
            <div class="title">${product.model}</div>
            <div class="topic">${product.topic}</div>
            <div class="des">${product.intro}</div>
            <div class="price">₹${product.price}</div>
            <button class="seeMore">See more &#8599</button>
        </div>
        <div class="detail">
            <div class="title">${product.title}</div>
            <div class="des">${product.description}</div>
            <div class="specifications">
                ${Object.entries(product.specs)
                  .map(
                    ([key, value]) => `<div><p>${key}</p><p>${value}</p></div>`
                  )
                  .join("")}
            </div>
            <div class="checkout">
                <button data-id="${
                  product.id
                }" class="addToCartBtn">ADD TO CART</button>
                <button>CHECKOUT</button>
            </div>
        </div>
      `;

      listHTML.appendChild(item);
    });

    // after rendering products, attach event listeners
    attachCarouselEvents();
    attachCartEvents();
  })
  .catch((err) => console.error("Error loading products:", err));

// ================================
// 2. Carousel controls
// ================================
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

function attachCarouselEvents() {
  // See more buttons
  document.querySelectorAll(".seeMore").forEach((button) => {
    button.onclick = function () {
      carousel.classList.add("showDetail");
    };
  });

  backButton.onclick = function () {
    carousel.classList.remove("showDetail");
  };

  nextButton.onclick = function () {
    showSlider("next");
  };
  prevButton.onclick = function () {
    showSlider("prev");
  };
}

// ================================
// 3. Cart logic
// ================================
function attachCartEvents() {
  document.querySelectorAll(".addToCartBtn").forEach((btn) => {
    btn.addEventListener("click", function () {
      let itemElement = this.closest(".item");
      let model = itemElement.querySelector(".intro .title").innerText;
      let image = itemElement.querySelector("img").src;
      let priceText = itemElement.querySelector(".intro .price").innerText;

      let price = parseInt(priceText.replace(/[^\d]/g, ""));

      let product = {
        id: Number(this.dataset.id),
        name: model,
        image: image,
        price: price,
        quantity: 1,
      };

      let existing = cart.find((p) => p.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        cart.push(product);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(product.name + " added to cart!");
    });
  });
}

// ================================
// 4. Ensure home param resets carousel
// ================================
window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("home") === "true") {
    while (
      !document
        .querySelector(".carousel .list .item:first-child")
        .matches(":nth-child(1)")
    ) {
      listHTML.appendChild(document.querySelector(".carousel .list .item"));
    }
  }
});
