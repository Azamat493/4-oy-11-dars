const API = "https://68fae18894ec96066023c657.mockapi.io/api/v2/products";
const loader = document.querySelector(".loader");
window.onload = () => loader.style.display = "none";

const list = document.querySelector("#list");
const form = document.querySelector("#form");

function showData() {
  fetch(API)
    .then(r => r.json())
    .then(d => {
      list.innerHTML = d.map(x => `
        <div class="card">
          <img src="${x.image}" alt="">
          <h3>${x.name}</h3>
          <p>${x.price} so‘m</p>
          ${form ? `
            <button class="btn-edit" onclick="edit('${x.id}', '${x.name}', '${x.price}', '${x.image}')">✏️</button>
            <button class="btn-del" onclick="del('${x.id}')">🗑️</button>
          ` : ""}
        </div>
      `).join("");
    });
}
showData();

if (form) {
  form.onsubmit = e => {
    e.preventDefault();
    let item = {
      name: name.value,
      price: price.value,
      image: image.value
    };
    fetch(API, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(item)
    }).then(showData);
    form.reset();
  };
}

function del(id) {
  fetch(`${API}/${id}`, {method: "DELETE"}).then(showData);
}

function edit(id, n, p, img) {
  let name2 = prompt("Nomi:", n);
  let price2 = prompt("Narxi:", p);
  let img2 = prompt("Rasm URL:", img);
  fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({name: name2, price: price2, image: img2})
  }).then(showData);
}
