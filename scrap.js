var links = [];
var scrollId = 0;
var HOST = "localhost";
var path = "/marketplace/add_links.php";

var main_url = "https://web.facebook.com/marketplace/nyc/";

const categories = ["vehicles", "apparel", "electronics", "pets", "sports"];

var category = categories[0];

console.log("Loading Scrapper...");

var progress = 0;
function getLinks() {
  window.scrollTo({
    left: 0,
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
  var anchors = document.getElementsByTagName("a");
  for (i in anchors) {
    try {
      var link = anchors[i].href.split("?")[0];
    } catch {
      continue;
    }
    if (
      !links.includes(link) &&
      link.includes("facebook.com/marketplace/item/")
    ) {
      links.push(link);

      payload = {
        itemId: link,
        category: sessionStorage.getItem("category"),
      };
      json_body = JSON.stringify(payload);
      url = "http://" + HOST + path;
      var req = new XMLHttpRequest();
      req.onreadystatechange = () => {
        if (req.readyState == 4) {
          console.log(req.responseText);
          // console.log("testing");
        }
      };
      req.open("POST", url, true);
      req.send(json_body);
      console.log("link : " + link);
      progress++;
      console.log(progress);
      if (progress > 100) {
        progress = 0;
        changeCategory();
        // return 0;
      }
    }
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("Connected");
  if (request.todo == "trigger") {
    var status = request.triggerStatus;
    category = request.category;
    sessionStorage.setItem("category", category);
    if (status) {
      if (scrollId == 0) {
        setTimeout(getLinks, 2000);
        scrollId = setInterval(getLinks, 25000);
        sessionStorage.setItem("run", 1);
      }
    } else {
      sessionStorage.setItem("run", 0);
      clearInterval(scrollId);
      scrollId = 0;
    }
  }
});

function changeCategory() {
  let randomValue = Math.floor(Math.random() * categories.length);
  category = categories[randomValue];
  sessionStorage.setItem("category", category);
  // main_url += category;
  window.location.replace(main_url + category);
}

// setInterval(() => {
//   if (sessionStorage.getItem("run")) {
//   }
// }, 60000);

setTimeout(() => {
  if (sessionStorage.getItem("run")) {
    getLinks();
    scrollId = setInterval(getLinks, 25000);
  }
}, 10000);
