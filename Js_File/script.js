const productsContainer = document.getElementById("products");
const categoryContainer = document.getElementById("categories");
const trendingContainer = document.getElementById("trendingProducts");
const cartCount = document.getElementById("cartCount");

let cart = [];


async function loadCategories() {
  const res = await fetch("https://fakestoreapi.com/products/categories");
  const data = await res.json();

  createCategoryButton("all");

  data.forEach(cat => createCategoryButton(cat));
}

function createCategoryButton(cat) {
  const btn = document.createElement("button");
  btn.className = "btn btn-outline btn-sm capitalize";
  btn.innerText = cat;
  btn.onclick = () => loadProducts(cat);
  categoryContainer.appendChild(btn);
}


async function loadProducts(category="all") {
  let url = "https://fakestoreapi.com/products";

  if(category !== "all"){
    url = `https://fakestoreapi.com/products/category/${category}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  productsContainer.innerHTML = "";

  data.forEach(product => {
    productsContainer.appendChild(createCard(product));
  });
}


function createCard(product) {
  const div = document.createElement("div");
  div.className = "card bg-base-100 shadow-md";

  div.innerHTML = `
    <figure class="p-4">
      <img src="${product.image}" class="h-40 object-contain"/>
    </figure>
    <div class="card-body">
      <span class="badge badge-primary">${product.category}</span>
      <h2 class="card-title text-sm">
        ${product.title.substring(0,40)}...
      </h2>
      <p class="font-bold">$${product.price}</p>
      <p>⭐ ${product.rating.rate}</p>
      <div class="card-actions justify-between">
        <button class="btn btn-outline btn-sm details">Details</button>
        <button class="btn btn-primary btn-sm add">Add</button>
      </div>
    </div>
  `;

  div.querySelector(".details").onclick = () => openModal(product.id);
  div.querySelector(".add").onclick = () => addToCart(product);

  return div;
}



async function openModal(id) {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  const product = await res.json();

  document.getElementById("modalTitle").innerText = product.title;
  document.getElementById("modalImage").src = product.image;
  document.getElementById("modalDescription").innerText = product.description;
  document.getElementById("modalPrice").innerText = product.price;
  document.getElementById("modalRating").innerText = product.rating.rate;

  document.getElementById("modalAddCart").onclick = () => addToCart(product);

  document.getElementById("productModal").showModal();
}


function addToCart(product) {
  cart.push(product);
  cartCount.innerText = cart.length;
}


async function loadTrending() {
  const res = await fetch("https://fakestoreapi.com/products");
  const data = await res.json();

  const top = data.sort((a,b)=>b.rating.rate-a.rating.rate).slice(0,3);

  top.forEach(product=>{
    trendingContainer.appendChild(createCard(product));
  });
}

loadCategories();
loadProducts();
loadTrending();
