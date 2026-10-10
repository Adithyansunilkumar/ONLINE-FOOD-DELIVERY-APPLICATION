const foodItems = [
   {
      id: 1,
      name: "Smashhouse Burger",
      category: "Burgers",
      price: 249,
      rating: 4.9,
      time: "20–25 min",
      tag: "CROWD FAVOURITE",
      description: "Double smash patty, cheddar, house sauce.",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&h=550&fit=crop",
      popular: 99,
   },
   {
      id: 2,
      name: "Hot Honey Pizza",
      category: "Pizza",
      price: 329,
      rating: 4.8,
      time: "25–30 min",
      tag: "TRENDING",
      description: "Wood-fired crust, hot honey, fresh basil.",
      image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?w=700&h=550&fit=crop",
      popular: 95,
   },
   {
      id: 3,
      name: "Spicy Miso Ramen",
      category: "Asian",
      price: 279,
      rating: 4.9,
      time: "20–30 min",
      tag: "CHEF'S PICK",
      description: "Rich miso broth, noodles, chilli oil.",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700&h=550&fit=crop",
      popular: 92,
   },
   {
      id: 4,
      name: "Malabar Chicken Bowl",
      category: "Indian",
      price: 229,
      rating: 4.8,
      time: "20–25 min",
      tag: "LOCAL LOVE",
      description: "Pepper chicken, fragrant rice, crunchy salad.",
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=700&h=550&fit=crop",
      popular: 96,
   },
   {
      id: 5,
      name: "Loaded Truffle Fries",
      category: "Burgers",
      price: 159,
      rating: 4.7,
      time: "15–20 min",
      tag: "GREAT SIDEKICK",
      description: "Golden fries, truffle mayo, parmesan dust.",
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=700&h=550&fit=crop",
      popular: 86,
   },
   {
      id: 6,
      name: "Mango Cheesecake",
      category: "Desserts",
      price: 189,
      rating: 4.9,
      time: "15–20 min",
      tag: "SWEET SPOT",
      description: "Creamy cheesecake with bright mango swirl.",
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=700&h=550&fit=crop",
      popular: 89,
   },
   {
      id: 7,
      name: "Green Goddess Bowl",
      category: "Healthy",
      price: 219,
      rating: 4.6,
      time: "15–20 min",
      tag: "FEEL-GOOD FOOD",
      description: "Avocado, greens, chickpeas, lemon dressing.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&h=550&fit=crop",
      popular: 81,
   },
   {
      id: 8,
      name: "Crispy Chilli Momos",
      category: "Asian",
      price: 179,
      rating: 4.8,
      time: "20–25 min",
      tag: "A LITTLE HEAT",
      description: "Crispy dumplings tossed in chilli garlic sauce.",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=700&h=550&fit=crop",
      popular: 91,
   },
];
const state = {
   category: "All",
   search: "",
   sort: "popular",
   cart: new Map(),
   favorites: new Set(),
};
const $ = (selector) => document.querySelector(selector);
const foodGrid = $("#foodGrid");
const cartDrawer = $("#cartDrawer");
const overlay = $("#overlay");
let toastTimer;

function money(value) {
   return `₹${value.toLocaleString("en-IN")}`;
}
function showToast(message) {
   const toast = $("#toast");
   toast.textContent = message;
   toast.classList.add("show");
   clearTimeout(toastTimer);
   toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function getFilteredItems() {
   let list = foodItems.filter(
      (item) =>
         (state.category === "All" || item.category === state.category) &&
         `${item.name} ${item.category} ${item.description}`
            .toLowerCase()
            .includes(state.search.toLowerCase()),
   );
   if (state.sort === "rating") list.sort((a, b) => b.rating - a.rating);
   else if (state.sort === "price-low") list.sort((a, b) => a.price - b.price);
   else if (state.sort === "price-high") list.sort((a, b) => b.price - a.price);
   else list.sort((a, b) => b.popular - a.popular);
   return list;
}
function renderFood() {
   const items = getFilteredItems();
   foodGrid.innerHTML = items
      .map((item) => {
         const qty = state.cart.get(item.id) || 0;
         const liked = state.favorites.has(item.id);
         return `<article class="food-card"><div class="food-photo"><img src="${item.image}" alt="${item.name}" loading="lazy"><span class="food-tag">${item.tag}</span><button class="favorite-button ${liked ? "liked" : ""}" data-favorite="${item.id}" aria-label="${liked ? "Remove" : "Add"} ${item.name} ${liked ? "from" : "to"} favourites">${liked ? "♥" : "♡"}</button></div><div class="food-info"><div class="food-name-row"><h3 class="food-name">${item.name}</h3><span class="food-rating"><span>★</span> ${item.rating}</span></div><p class="food-description">${item.description}</p><div class="food-bottom"><span class="food-price">${money(item.price)}</span><button class="add-button ${qty ? "added" : ""}" data-add="${item.id}" aria-label="Add ${item.name} to bag">${qty ? `+ ${qty}` : "+"}</button></div><div class="food-meta"><span>${item.category}</span><span>${item.time}</span></div></div></article>`;
      })
      .join("");
   $("#emptyState").hidden = items.length !== 0;
   foodGrid.hidden = items.length === 0;
}
function cartQuantity() {
   return [...state.cart.values()].reduce((sum, qty) => sum + qty, 0);
}
function cartSubtotal() {
   return [...state.cart.entries()].reduce(
      (sum, [id, qty]) =>
         sum + foodItems.find((item) => item.id === id).price * qty,
      0,
   );
}
function renderCart() {
   const entries = [...state.cart.entries()];
   $("#cartCount").textContent = cartQuantity();
   $("#cartCount").setAttribute("aria-label", `${cartQuantity()} items in bag`);
   $("#cartSummary").hidden = entries.length === 0;
   if (!entries.length) {
      $("#cartItems").innerHTML =
         '<div class="cart-empty"><span>🥡</span><h3>Your bag is taking a nap.</h3><p>Add a little deliciousness to wake it up.</p><button id="startOrdering">Browse food</button></div>';
      $("#startOrdering").addEventListener("click", closeCart);
      return;
   }
   $("#cartItems").innerHTML = entries
      .map(([id, qty]) => {
         const item = foodItems.find((food) => food.id === id);
         return `<div class="cart-row"><img src="${item.image}" alt=""><div><h4>${item.name}</h4><small>${money(item.price)} each</small><div class="quantity-control"><button data-quantity="${id}" data-delta="-1" aria-label="Remove one ${item.name}">−</button><span>${qty}</span><button data-quantity="${id}" data-delta="1" aria-label="Add one ${item.name}">+</button></div></div><span class="cart-row-price">${money(item.price * qty)}</span></div>`;
      })
      .join("");
   const subtotal = cartSubtotal();
   $("#subtotalValue").textContent = money(subtotal);
   $("#totalValue").textContent = money(subtotal);
}
function addToCart(id) {
   state.cart.set(id, (state.cart.get(id) || 0) + 1);
   renderCart();
   renderFood();
   showToast(
      `${foodItems.find((item) => item.id === id).name} added to your bag`,
   );
}
function changeQuantity(id, delta) {
   const qty = (state.cart.get(id) || 0) + delta;
   if (qty <= 0) state.cart.delete(id);
   else state.cart.set(id, qty);
   renderCart();
   renderFood();
}
function openCart() {
   cartDrawer.classList.add("open");
   overlay.classList.add("visible");
   cartDrawer.setAttribute("aria-hidden", "false");
   document.body.style.overflow = "hidden";
   $("#closeCart").focus();
}
function closeCart() {
   cartDrawer.classList.remove("open");
   overlay.classList.remove("visible");
   cartDrawer.setAttribute("aria-hidden", "true");
   document.body.style.overflow = "";
}
function applyFilters() {
   renderFood();
}

foodGrid.addEventListener("click", (event) => {
   const add = event.target.closest("[data-add]");
   const favorite = event.target.closest("[data-favorite]");
   if (add) addToCart(Number(add.dataset.add));
   if (favorite) {
      const id = Number(favorite.dataset.favorite);
      state.favorites.has(id)
         ? state.favorites.delete(id)
         : state.favorites.add(id);
      renderFood();
      showToast(
         state.favorites.has(id)
            ? "Saved to your favourites ♥"
            : "Removed from favourites",
      );
   }
});
$("#categoryList").addEventListener("click", (event) => {
   const button = event.target.closest("[data-category]");
   if (!button) return;
   state.category = button.dataset.category;
   document
      .querySelectorAll(".category-pill")
      .forEach((pill) => pill.classList.toggle("active", pill === button));
   applyFilters();
});
$("#searchForm").addEventListener("submit", (event) => {
   event.preventDefault();
   state.search = $("#searchInput").value.trim();
   applyFilters();
   $("#restaurants").scrollIntoView({ behavior: "smooth" });
});
$("#searchInput").addEventListener("input", (event) => {
   if (!event.target.value.trim()) {
      state.search = "";
      applyFilters();
   }
});
$("#sortSelect").addEventListener("change", (event) => {
   state.sort = event.target.value;
   applyFilters();
});
$("#resetFilters").addEventListener("click", () => {
   state.category = "All";
   state.search = "";
   state.sort = "popular";
   $("#searchInput").value = "";
   $("#sortSelect").value = "popular";
   document
      .querySelectorAll(".category-pill")
      .forEach((pill) =>
         pill.classList.toggle("active", pill.dataset.category === "All"),
      );
   applyFilters();
});
$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
$("#cartItems").addEventListener("click", (event) => {
   const control = event.target.closest("[data-quantity]");
   if (control)
      changeQuantity(
         Number(control.dataset.quantity),
         Number(control.dataset.delta),
      );
});
document.addEventListener("keydown", (event) => {
   if (event.key === "Escape") {
      closeCart();
      $("#locationDialog").close?.();
   }
});
$("#checkoutButton").addEventListener("click", () => {
   if (!cartQuantity()) return;
   const orderId = `BR-${Math.floor(1000 + Math.random() * 9000)}`;
   const itemCount = cartQuantity();
   const total = cartSubtotal();
   $("#orderNumber").textContent = orderId;
   $("#orderItemCount").textContent =
      `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
   $("#orderTotal").textContent = money(total);
   state.cart.clear();
   renderCart();
   renderFood();
   closeCart();
   $("#orderDialog").showModal();
});
$("#copyCoupon").addEventListener("click", async () => {
   try {
      await navigator.clipboard.writeText("FIRSTBITE20");
      showToast("Coupon FIRSTBITE20 copied!");
   } catch {
      showToast("Use coupon code FIRSTBITE20 at checkout.");
   }
});
$(".announcement-close").addEventListener("click", () =>
   $(".announcement").remove(),
);
$("#mobileMenu").addEventListener("click", () => {
   const nav = $("#mainNav");
   nav.classList.toggle("open");
   $("#mobileMenu").textContent = nav.classList.contains("open") ? "×" : "☰";
});
$("#mainNav").addEventListener("click", (event) => {
   if (event.target.closest("a")) {
      $("#mainNav").classList.remove("open");
      $("#mobileMenu").textContent = "☰";
   }
});
$("#locationButton").addEventListener("click", () =>
   $("#locationDialog").showModal(),
);
$("#saveLocation").addEventListener("click", () => {
   const input = $("#locationInput");
   const value = input.value.trim();
   if (!value) {
      input.focus();
      return;
   }
   $("#locationText").textContent = value;
   $("#locationDialog").close();
   showToast(`Delivery area updated to ${value}`);
});
renderFood();
renderCart();
