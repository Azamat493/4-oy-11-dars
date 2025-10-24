const API = "https://68fae18894ec96066023c657.mockapi.io/api/v2/products";
const list = document.querySelector("#list");
const form = document.querySelector("#form");
const loader = document.querySelector(".loader");
const searchInput = document.querySelector("#search");
const sortSelect = document.querySelector("#sort");

let productsData = [];

window.addEventListener("load", function () {
  fetchProducts();
});

function fetchProducts() {
  loader.style.display = "flex";
  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      productsData = data;
      showData(productsData);
    })
    .finally(() => (loader.style.display = "none"));
}

function showData(data) {
  list.innerHTML = "";
  data.forEach((x, i) => {
    let div = document.createElement("div");
    div.className = "card";
    div.setAttribute("data-aos", "fade-up");
    div.setAttribute("data-aos-delay", i * 50);
    div.innerHTML = `
      <img src="${x.image}" alt="">
      <h3>${x.name}</h3>
      <p>${x.price} so‘m</p>
    `;
    if (form) {
      div.innerHTML += `
        <button class="btn-edit" onclick="edit('${x.id}', '${x.name}', '${x.price}', '${x.image}')">✏️</button>
        <button class="btn-del" onclick="del('${x.id}')">🗑️</button>
      `;
    }
    list.appendChild(div);
  });
  AOS.init({ duration: 800 });
}

// search + sort funksiyasi
function filterAndSort() {
  let filtered = productsData.filter((p) =>
    p.name.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  if (sortSelect.value === "asc") filtered.sort((a, b) => a.price - b.price);
  else if (sortSelect.value === "desc")
    filtered.sort((a, b) => b.price - a.price);

  showData(filtered);
}

searchInput?.addEventListener("input", filterAndSort);
sortSelect?.addEventListener("change", filterAndSort);

if (form) {
  form.onsubmit = function (e) {
    e.preventDefault();
    let newProduct = {
      name: name.value,
      price: price.value,
      image: image.value,
    };
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    }).then(() => {
      form.reset();
      fetchProducts();
    });
  };
}

function del(id) {
  fetch(`${API}/${id}`, { method: "DELETE" }).then(fetchProducts);
}

function edit(id, n, p, img) {
  let newName = prompt("Yangi nomi:", n);
  let newPrice = prompt("Yangi narxi:", p);
  let newImg = prompt("Yangi rasm URL:", img);
  fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newName, price: newPrice, image: newImg }),
  }).then(fetchProducts);
}
