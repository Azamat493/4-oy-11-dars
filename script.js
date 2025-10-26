
const API = "https://68fae18894ec96066023c657.mockapi.io/api/v2/products";


const list = document.querySelector("#list");
const form = document.querySelector("#form");
const loader = document.querySelector(".loader");
const searchInput = document.querySelector("#search");
const sortSelect = document.querySelector("#sort");


const nameInput = document.querySelector("#name");
const priceInput = document.querySelector("#price");
const imageInput = document.querySelector("#image");
const descriptionInput = document.querySelector("#description");
const ratingInput = document.querySelector("#rating");
const categoryInput = document.querySelector("#category");


let productsData = [];


const isAdminPage = window.location.pathname.includes("admin.html");


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
      <img src="${x.image}" alt="${x.name}">
      <h3>${x.name}</h3>
      <p class="description">${x.description}</p>
      <p class="price">${x.price} so‘m</p>
      <p class="rating">⭐ ${x.rating}</p>
      <p class="category">Kategoriya: ${x.category}</p>
      ${
        isAdminPage
          ? `
        <div class="actions">
          <button class="btn-edit" onclick="edit('${x.id}', '${x.name}', '${x.price}', '${x.image}', '${x.description}', '${x.rating}', '${x.category}')">✏️</button>
          <button class="btn-del" onclick="del('${x.id}')">🗑️</button>
        </div>
      `
          : ""
      }
    `;
    list.appendChild(div);
  });
  AOS.init({ duration: 800 });
}


function filterAndSort() {
  let filtered = productsData.filter((p) =>
    p.name.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  if (sortSelect?.value === "asc") filtered.sort((a, b) => a.price - b.price);
  else if (sortSelect?.value === "desc")
    filtered.sort((a, b) => b.price - a.price);

  showData(filtered);
}

searchInput?.addEventListener("input", filterAndSort);
sortSelect?.addEventListener("change", filterAndSort);


if (form && isAdminPage) {
  form.onsubmit = function (e) {
    e.preventDefault();

    let newProduct = {
      name: nameInput.value,
      price: priceInput.value,
      image: imageInput.value,
      description: descriptionInput.value,
      rating: ratingInput.value,
      category: categoryInput.value,
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
  if (!isAdminPage) return; 
  fetch(`${API}/${id}`, { method: "DELETE" }).then(fetchProducts);
}




function edit(id, n, p, img, desc, rating, category) {
  if (!isAdminPage) return; 

  let newName = prompt("Yangi nomi:", n);
  let newPrice = prompt("Yangi narxi:", p);
  let newImg = prompt("Yangi rasm URL:", img);
  let newDesc = prompt("Yangi tavsif:", desc);
  let newRating = prompt("Yangi bahosi:", rating);
  let newCategory = prompt("Yangi kategoriyasi:", category);

  if (
    newName === null ||
    newPrice === null ||
    newImg === null ||
    newDesc === null ||
    newRating === null ||
    newCategory === null
  ) {
    return; 
  }

  fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: newName,
      price: newPrice,
      image: newImg,
      description: newDesc,
      rating: newRating,
      category: newCategory,
    }),
  }).then(fetchProducts);
}
