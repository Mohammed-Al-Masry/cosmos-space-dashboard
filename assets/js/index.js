"use strict";
// APIs and token key
const tokenKey = "YXoE0mwU7mHNdsdDvwlpJcEKV8fPHZoFk0ZYkcHe";
const apiUrls = {
    todayInSpace: "https://api.nasa.gov/planetary/apod",
    launches: "https://ll.thespacedevs.com/2.3.0/launches/upcoming/?limit=10",
    planets: "https://solar-system-opendata-proxy.vercel.app/api/planets",
};
// nav tabs queries
const navTabs = document.querySelectorAll("nav a");

// Today in Space queries
const todayInSpace = document.querySelector("#today-in-space");
const apodDate = document.querySelector("#apod-date");
const dateInput = document.querySelector("#apod-date-input");
const loadDate = document.querySelector("#load-date-btn");
const nowDate = document.querySelector("#today-apod-btn");
const loader = document.querySelector("#apod-loading");
const apodImage = document.querySelector("#apod-image");
const viewApodImage = document.querySelector("#apod-image-container button");
const apodTitle = document.querySelector("#apod-title");
const apodDateDetail = document.querySelector("#apod-date-detail");
const apodDetail = document.querySelector("#apod-explanation");
const apodCopyright = document.querySelector("#apod-copyright");
const apodDateInfo = document.querySelector("#apod-date-info");

// Launches queries
const launches = document.querySelector("#launches");
const featuredLaunches = document.querySelector("#featured-launch");
const upcomingLaunches = document.querySelector("#launches-grid");

// Planets queries
const planets = document.querySelector("#planets");


// date formatting
function formatDate(date) {
    const dayName = { weekday: "long" }; // name of the day
    const shortDate = { year: "numeric", month: "short", day: "numeric"}; // m-d-y (short month)
    const longDate = { year: "numeric", month: "long", day: "numeric"}; // m-d-y (long month)
    const isoDate = { year: 'numeric', month: '2-digit', day: '2-digit'}; // y-m-d
    const timeFormat = {hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC', timeZoneName: 'short'}; // 00:00 AM/PM UTC
    let day = new Intl.DateTimeFormat("en-US", dayName).format(date);
    let dateLong = new Intl.DateTimeFormat("en-US", longDate).format(date);
    let dateShort = new Intl.DateTimeFormat("en-US", shortDate).format(date);
    let dateISO = new Intl.DateTimeFormat('sv-SE', isoDate).format(date);
    let time = new Intl.DateTimeFormat('en-US', timeFormat).format(date);
    return {dateLong, dateShort, dateISO, time, day};
}

// changing nav tabs design 
for (let i = 0; i < navTabs.length; i++) {
    function unchangedTapLook(){
        for (let j = 0; j < navTabs.length; j++) {
        navTabs[j].classList.add("text-slate-300", "hover:bg-slate-800");
        navTabs[j].classList.remove("bg-blue-500/10", "text-blue-400");
    }};

    function changedTapLook(x){
        navTabs[x].classList.remove("text-slate-300", "hover:bg-slate-800");
        navTabs[x].classList.add("bg-blue-500/10", "text-blue-400");
    };

    navTabs[i].addEventListener("click", function () {
        document.querySelectorAll("section").forEach(function (section) {
            section.classList.add("hidden");
        });
    
    if (navTabs[i].getAttribute("data-section") === "today-in-space") {
        unchangedTapLook();
        changedTapLook(i);
        todayInSpace.classList.remove("hidden");
        launches.classList.add("hidden");
        planets.classList.add("hidden");
    } else if (navTabs[i].getAttribute("data-section") === "launches"){
        unchangedTapLook();
        changedTapLook(i);
        launches.classList.remove("hidden");
        todayInSpace.classList.add("hidden");
        planets.classList.add("hidden");
    } else if (navTabs[i].getAttribute("data-section") === "planets") {
        unchangedTapLook();
        changedTapLook(i);
        planets.classList.remove("hidden");
        todayInSpace.classList.add("hidden");
        launches.classList.add("hidden");
    }
    });
};

// loader functions
function loading() {
    loader.classList.remove("hidden");
    apodImage.classList.add("hidden");
};

function loaded() {
    loader.classList.add("hidden");
    apodImage.classList.remove("hidden");
};

// displaying apod info
function displayTodayApod(data, date) {
  apodDate.textContent = `Astronomy Picture of the Day - ${date.dateLong}`;
  apodImage.getAttribute("src") = data.url;
  viewApodImage.addEventListener("click", () => {
    window.open(data.url, "_blank");
  });
  apodTitle.textContent = data.title;
  apodDateDetail.textContent = date.dateShort;
  apodDetail.textContent = data.explanation;
  apodCopyright.textContent = data.copyright;
  apodDateInfo.textContent = date.dateISO;
};

// today apod space info
async function fetchTodayApod() {
    try {
        loading();
        const response = await fetch(apiUrls.todayInSpace+"?api_key="+tokenKey);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const date = formatDate(new Date());
        dateInput.getAttribute("max") = date.dateISO;
        dateInput.nextElementSibling.textContent = date.dateShort;
        displayTodayApod(data, date);
    } catch (error) {
        console.log(error);
    } finally {
        loaded();
    };
};

fetchTodayApod();

// today apod info
nowDate.addEventListener("click", fetchTodayApod);

// apod space info by date
async function fetchTodayApodByDate(date) {
    try {
        loading();
        const selectedDate = date;
        const response = await fetch(apiUrls.todayInSpace+"?api_key="+tokenKey+"&date="+selectedDate.dateISO);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        dateInput.nextElementSibling.textContent = selectedDate.dateShort;
        displayTodayApod(data, selectedDate);
    } catch (error) {
        console.log(error);
    }finally {
        loaded();
    };
};

// display date that user chosen
dateInput.addEventListener("change", () => {
  const selectedDate = formatDate(new Date(dateInput.value));
  dateInput.nextElementSibling.textContent = selectedDate.dateShort;
});

// apod info by date
loadDate.addEventListener("click",() => {
    const selectedDate = formatDate(new Date(dateInput.value));
    fetchTodayApodByDate(selectedDate);
});

// display incoming launches
function displayLaunches(data) {
    for (let i = 0; i < data.length; i++) {
        if (i == 0) {
            // formatting date to Us timezone            
            const dateOfLaunch = formatDate(new Date(data[i].net));
            console.log(dateOfLaunch);
            // display launch
            const nextLaunch = `<div
              class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all"
            >
              <div
                class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
              ></div>
              <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
                <div class="flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-3 mb-4">
                      <span
                        class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2"
                      >
                        <i class="fas fa-star"></i>
                        Featured Launch
                      </span>
                      <span
                        class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold"
                      >
                        ${data[i].status.abbrev}
                      </span>
                    </div>
                    <h3 class="text-3xl font-bold mb-3 leading-tight">
                      ${data[i].name}
                    </h3>
                    <div
                      class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400"
                    >
                      <div class="flex items-center gap-2">
                        <i class="fas fa-building"></i>
                        <span>${data[i].launch_service_provider.name}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <i class="fas fa-rocket"></i>
                        <span>${data[i].rocket.configuration.name}</span>
                      </div>
                    </div>
                    <div class="grid xl:grid-cols-2 gap-4 mb-6">
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-calendar"></i>
                          Launch Date
                        </p>
                        <p class="font-semibold">${dateOfLaunch.day}, ${
              dateOfLaunch.dateLong
            }</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-clock"></i>
                          Launch Time
                        </p>
                        <p class="font-semibold">${dateOfLaunch.time}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-map-marker-alt"></i>
                          Location
                        </p>
                        <p class="font-semibold text-sm">${
                          data[i].pad.location.name
                        }</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2"
                        >
                          <i class="fas fa-globe"></i>
                          Country
                        </p>
                        <p class="font-semibold">${
                          data[i].pad.location.country.name
                        }</p>
                      </div>
                    </div>
                    <p class="text-slate-300 leading-relaxed mb-6">
                      ${data[i].mission.description}
                    </p>
                  </div>
                  <div class="flex flex-col md:flex-row gap-3">
                    <button
                      class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <i class="fas fa-info-circle"></i>
                      View Full Details
                    </button>
                    <div class="icons self-end md:self-center">
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="far fa-heart"></i>
                      </button>
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors"
                      >
                        <i class="fas fa-bell"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="relative">
                  <div
                    class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50"
                  >
                    ${
                      data[i].image.image_url !== ""
                        ? `<img src="${data[i].image.image_url}" alt="${data[i].name} rocket image" class="w-full h-full object-cover">`
                        : `<img src="https://https://mohammed-al-masry.github.io/cosmos-space-dashboard/assets/images/launch-placeholder.png" alt="${data[i].name} rocket image" class="w-full h-full object-cover">`
                    }
                    <div
                      class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"
                    ></div>
                  </div>
                </div>
              </div>
            </div>`;            
            featuredLaunches.insertAdjacentHTML("beforeend", nextLaunch);
        } else {
          // formatting date to Us timezone
          const dateOfLaunch = formatDate(new Date(data[i].net));
          // display launch
          const laterLaunch = `<div
              class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
            >
              ${
                data[i].image.image_url !== ""
                  ? `<div class="relative h-48 overflow-hidden bg-slate-900/50">
                    <img src="${data[i].image.image_url}" alt="${data[i].name} rocket image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    <div class="absolute top-3 right-3">
                        <span class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
                            Go
                        </span>
                    </div>
                </div>`
                  : `<div class="relative h-48 overflow-hidden bg-slate-900/50">
                    <img src="https://https://mohammed-al-masry.github.io/cosmos-space-dashboard/assets/images/launch-placeholder.png" alt="${data[i].name} rocket image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    <div class="absolute top-3 right-3">
                        <span class="px-3 py-1 bg-green-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
                            Go
                        </span>
                    </div>
                </div>`
              }
              <div class="p-5">
                <div class="mb-3">
                  <h4
                    class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
                  >
                    ${data[i].name}
                  </h4>
                  <p class="text-sm text-slate-400 flex items-center gap-2">
                    <i class="fas fa-building text-xs"></i>
                    ${data[i].launch_service_provider.name}
                  </p>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-calendar text-slate-500 w-4"></i>
                    <span class="text-slate-300">${
                      dateOfLaunch.dateShort
                    }</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-clock text-slate-500 w-4"></i>
                    <span class="text-slate-300">${dateOfLaunch.time}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-rocket text-slate-500 w-4"></i>
                    <span class="text-slate-300">${
                      data[i].rocket.configuration.name
                    }</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                    <span class="text-slate-300 line-clamp-1">${
                      data[i].pad.location.name
                    }</span>
                  </div>
                </div>
                <div
                  class="flex items-center gap-2 pt-4 border-t border-slate-700"
                >
                  <button
                    class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold"
                  >
                    Details
                  </button>
                  <button
                    class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <i class="far fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>`;
          upcomingLaunches.insertAdjacentHTML("beforeend", laterLaunch);
        };
    };
};

// fetching launch data
async function fetchLaunches() {
    try {
        const response = await fetch(apiUrls.launches)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log(data.results);
        
        displayLaunches(data.results);
    } catch (error) {
        console.log(error);
    };
};

fetchLaunches();