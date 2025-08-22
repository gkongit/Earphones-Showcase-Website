let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartItemsContainer = document.getElementById("cartItems");
let cartTotal = document.getElementById("cartTotal");
const quickAddCarousel = document.querySelector(".quickAddCarousel");

/* ---------------- CART FUNCTIONS ---------------- */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<li class="emptyCart">🛒 Cart is empty!</li>`;
    cartTotal.textContent = "";
    document.getElementById("checkoutBtn").style.display = "none";
    return;
  }

  cart.forEach((item, index) => {
    let li = document.createElement("li");
    li.classList.add("cartItem");

    li.innerHTML = `
      <img class="cartImg" src="${item.image}" />
      <span class="cartName">${item.name}</span>
      
      <div class="quantityControls">
        <button class="addBtn" onclick="increaseQuantity(${index})">
          <span class="material-symbols-outlined">add</span>
        </button>
        <input 
          type="number" 
          min="1" 
          max="100"
          class="quantityTextbox" 
          value="${item.quantity}" 
          onchange="updateQuantity(${index}, this.value)" 
        />
        <button class="minusBtn" onclick="decreaseQuantity(${index})">
          <span class="material-symbols-outlined">remove</span>
        </button>
      </div>
      <div class="itemPriceInList">Price: ₹${item.quantity * item.price}</div>
      <button class="removeBtn" onclick="removeItem(${index})">
        <span class="material-symbols-outlined">delete</span>
      </button>
    `;

    cartItemsContainer.appendChild(li);
    total += item.quantity * item.price;
  });

  cartTotal.textContent = "Total: ₹" + total;
  document.getElementById("checkoutBtn").style.display = "block";
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function increaseQuantity(index) {
  if (cart[index].quantity < 100) {
    cart[index].quantity++;
    saveCart();
    renderCart();
  }
}

function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    removeItem(index);
    return;
  }
  saveCart();
  renderCart();
}

function updateQuantity(index, value) {
  let newQuantity = parseInt(value);
  if (isNaN(newQuantity) || newQuantity < 1) {
    cart[index].quantity = 1;
  } else if (newQuantity > 100) {
    cart[index].quantity = 100;
  } else {
    cart[index].quantity = newQuantity;
  }

  saveCart();
  renderCart();
}

/* ---------------- DRAG SCROLL FOR CAROUSEL ---------------- */
let isDown = false;
let startX;
let scrollLeft;

quickAddCarousel.addEventListener("mousedown", (e) => {
  isDown = true;
  quickAddCarousel.classList.add("active");
  startX = e.pageX - quickAddCarousel.offsetLeft;
  scrollLeft = quickAddCarousel.scrollLeft;
});

quickAddCarousel.addEventListener("mouseleave", () => {
  isDown = false;
  quickAddCarousel.classList.remove("active");
});

quickAddCarousel.addEventListener("mouseup", () => {
  isDown = false;
  quickAddCarousel.classList.remove("active");
});

quickAddCarousel.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - quickAddCarousel.offsetLeft;
  const walk = (x - startX) * 1; // drag speed multiplier
  quickAddCarousel.scrollLeft = scrollLeft - walk;
});

/* ---------------- HOVER DELETE EFFECT ---------------- */
cartItemsContainer.addEventListener("mouseover", (e) => {
  const btn = e.target.closest(".removeBtn");
  if (btn) {
    const li = btn.closest(".cartItem");
    li.classList.add("hover-delete");
  }
});

cartItemsContainer.addEventListener("mouseout", (e) => {
  const btn = e.target.closest(".removeBtn");
  if (btn) {
    const li = btn.closest(".cartItem");
    li.classList.remove("hover-delete");
  }
});

/* ---------------- FETCH PRODUCTS AND RENDER ---------------- */
fetch("products.json")
  .then((res) => res.json())
  .then((products) => {
    const quickAddCarousel = document.querySelector(".quickAddCarousel");

    products.forEach((product, index) => {
      let div = document.createElement("div");
      div.classList.add("quickAddItem");

      div.innerHTML = `
        <img src="${product.image}" alt="${product.title}" />
        <h2>${product.model}</h2>
        <p>₹${product.price}</p>
        <button class="quickAddBtn">Add to Cart</button>
      `;

      quickAddCarousel.appendChild(div);

      div.querySelector(".quickAddBtn").addEventListener("click", () => {
        let existing = cart.find((p) => p.id === product.id);
        if (existing) {
          existing.quantity++;
        } else {
          cart.push({
            id: Number(product.id),
            name: product.model,
            quantity: 1,
            price: product.price,
            image: product.image,
          });
        }
        saveCart();
        renderCart();
        alert(product.model + " added to cart!");
      });
    });
  });

/* ---------------- INIT ---------------- */
renderCart();
