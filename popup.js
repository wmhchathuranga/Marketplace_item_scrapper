const categories = [
  "vehicles",
  "apparel",
  "electronics",
  "propertyrentals",
  "pets",
  "sports",
];

var category = categories[0];

var start_btn = document.getElementById("start");
var stop_btn = document.getElementById("stop");

start_btn.addEventListener("click", runScrap);
stop_btn.addEventListener("click", stopScrap);

if (localStorage.getItem("status") != null) {
  start_btn.classList.toggle("d-none");
  stop_btn.classList.toggle("d-none");
}

var main_url = "https://web.facebook.com/marketplace/nyc/";

try {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    let url = tabs[0].url;
    if (!url.includes("facebook.com/marketplace")) {
      window.open(main_url + "vehicles", "_blank");
    }
  });
} catch {
  pass;
}

function runScrap() {
  localStorage.setItem("status", 1);
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      todo: "trigger",
      triggerStatus: 1,
      category: category,
    });
  });
  window.close();
}

function stopScrap() {
  localStorage.removeItem("status");
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { todo: "trigger", triggerStatus: 0 });
  });
  window.close();
}

function changeCategory() {
  let randomValue = Math.floor(Math.random() * categories.length);
  category = categories[randomValue];
  main_url += category;
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    window.open(main_url);
  });
}

setInterval(() => {
  changeCategory();
}, 6000);
