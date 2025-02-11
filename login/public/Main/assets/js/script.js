'use strict';

/**
 * Add event on element
 */
const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}

/**
 * Section scrolling and active nav link
 */
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
  let top = window.scrollY;

  sections.forEach(sec => {
    let offset = sec.offsetTop - 10;
    let height = sec.offsetHeight;
    let id = sec.getAttribute('id');

    if (top >= offset && top < offset + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
      });

      let currentLink = document.querySelector(`header nav a[href*=${id}]`);
      if (currentLink) {
        currentLink.classList.add('active');
      }
    }
  });
};

/**
 * Navbar toggle
 */
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const navToggler = document.querySelector("[data-nav-toggler]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  navToggler.classList.toggle("active");
  document.body.classList.toggle("active");
}

addEventOnElem(navToggler, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  navToggler.classList.remove("active");
  document.body.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);

/**
 * Header active on scroll
 */
const header = document.querySelector("[data-header]");

const activeHeader = function () {
  if (window.scrollY > 1) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", activeHeader);

/**
 * Toggle active on add to favorites
 */
const addToFavBtns = document.querySelectorAll("[data-add-to-fav]");

const toggleActive = function () {
  this.classList.toggle("active");
}

addEventOnElem(addToFavBtns, "click", toggleActive);

/**
 * Scroll reveal effect
 */
const scrollSections = document.querySelectorAll("[data-section]");

const scrollReveal = function () {
  scrollSections.forEach(section => {
    if (section.getBoundingClientRect().top < window.innerHeight-1.5) {
      section.classList.add("active");
    } else {
      section.classList.remove("active");
    }
  });
}

scrollReveal();
addEventOnElem(window, "scroll", scrollReveal);

/**
 * Pop-up functionality
 */
const exploreMoreBtn = document.getElementById("exploreMore");
const popup = document.getElementById("popup");
const popupContent = document.querySelector(".popup-content");
const closePopupBtn = document.getElementById("closePopup");

const disableScroll = () => {
  document.body.style.overflow = 'hidden';
};

const enableScroll = () => {
  document.body.style.overflow = '';
};

exploreMoreBtn.addEventListener("click", (e) => {
  e.preventDefault();
  popup.style.display = "block";
  setTimeout(() => {
    popup.style.opacity = "1";
    popupContent.style.opacity = "1";
  }, 10);
  disableScroll();
});

closePopupBtn.addEventListener("click", () => {
  popupContent.style.opacity = "0";
  popup.style.opacity = "0";
  setTimeout(() => {
    popup.style.display = "none";
    enableScroll();
  }, 500);
});

window.addEventListener("click", (event) => {
  if (event.target === popup) {
    popupContent.style.opacity = "0";
    popup.style.opacity = "0";
    setTimeout(() => {
      popup.style.display = "none";
      enableScroll();
    }, 500);
  }
});
'use strict';

/**
 * Add event on element
 */
const addEventOnElemnt = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}

// Initialize wallet and account balance
let walletCoins = []; // Array to store coins in the wallet
let accountBalance = 500000000; // Set initial balance to 500000000

// Load wallet data and account balance from localStorage if available
function loadWalletData() {
  const storedCoins = localStorage.getItem("walletCoins");
  const storedBalance = localStorage.getItem("accountBalance");

  if (storedCoins) {
    walletCoins = JSON.parse(storedCoins);
  }
  if (storedBalance) {
    accountBalance = parseFloat(storedBalance);
  }

  updateAccountBalance();
}

// Save wallet data and account balance to localStorage
function saveWalletData() {
  localStorage.setItem("walletCoins", JSON.stringify(walletCoins));
  localStorage.setItem("accountBalance", accountBalance.toString());
}

// Update the account balance display
function updateAccountBalance() {
  document.getElementById("account-balance").textContent = `My Account Balance: ₹${accountBalance.toLocaleString('en-IN')}`;
}

// Open wallet popup
function openWallet(event) {
  if (event) event.preventDefault(); // Prevent default scroll behavior
  document.getElementById("popup-title").textContent = "My Crypto Wallet";

  if (walletCoins.length === 0) {
    document.getElementById("wallet-empty-message").style.display = "block";
    document.getElementById("wallet-coins-list").style.display = "none";
  } else {
    document.getElementById("wallet-empty-message").style.display = "none";
    document.getElementById("wallet-coins-list").style.display = "block";
    updateCoinList();
  }

  document.getElementById("wallet-popup").classList.add("show");
}

// Close the wallet popup
function closeWallet() {
  document.getElementById("wallet-popup").classList.remove("show");
}

// Update the wallet coin list with sell button
function updateCoinList() {
  const walletList = document.getElementById("wallet-coins-list");
  walletList.innerHTML = ""; // Clear existing list

  if (walletCoins.length === 0) {
    document.getElementById("wallet-empty-message").style.display = "block";
    walletList.style.display = "none";
  } else {
    document.getElementById("wallet-empty-message").style.display = "none";
    walletList.style.display = "block";

    walletCoins.forEach((coin, index) => {
      const coinItem = document.createElement("div");
      coinItem.classList.add("coin-item");

      coinItem.innerHTML = `
        <img src="${coin.imageSrc}" alt="${coin.name} logo" width="30" height="30">
        <span>${coin.name} - ₹${coin.price}</span>
        <button class="sell-btn" onclick="sellCoin(${index}, '${coin.name}')">Sell</button>
      `;

      walletList.appendChild(coinItem);
    });
  }
}

// Sell a coin and update the wallet
async function sellCoin(index, coinName) {
  const coinPrice = await getCoinRealPrice(coinName); // Fetch real-time price from API

  const sellMessage = document.getElementById("sell-message");
  sellMessage.style.display = "block";

  setTimeout(() => {
    sellMessage.style.display = "none";

    accountBalance += coinPrice; // Add the real price back to the balance
    updateAccountBalance();
    walletCoins.splice(index, 1); // Remove coin from wallet
    saveWalletData(); // Save updated wallet data
    updateCoinList(); // Update wallet display
  }, 2000); // Delay for showing the sell confirmation
}

// Get real-time coin price from the CoinGecko API
async function getCoinRealPrice(coinName) {
  try {
    const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coinName.toLowerCase()}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.length > 0) {
      return data[0].current_price; // Return the real price in INR
    } else {
      console.error('Coin not found:', coinName);
      return 0;
    }
  } catch (error) {
    console.error('Error fetching real price:', error);
    return 0;
  }
}

// Buy a coin and redirect to payment page
async function buyCoin(coinName, coinImageSrc) {
  window.open('Payment/index.html', '_blank');
  const realPrice = await getCoinRealPrice(coinName); // Fetch real-time price from API
  
  // Open the wallet pop-up immediately
  openWallet();

  // Check if there's enough balance to buy the coin using real-time price
  if (accountBalance >= realPrice) {
    const successMessage = document.getElementById("success-message");
    successMessage.style.display = "block";
    successMessage.textContent = "Congratulations, coin bought!";

    setTimeout(() => {
      successMessage.style.display = "none";
      accountBalance -= realPrice;  // Deduct the real price from the balance
      updateAccountBalance();
      walletCoins.push({ name: coinName, price: realPrice, imageSrc: coinImageSrc });

      document.getElementById("wallet-empty-message").style.display = "none";
      document.getElementById("wallet-coins-list").style.display = "block";

      saveWalletData();  // Save updated wallet data
      updateCoinList();  // Update wallet coin list
    }, 2000); // Delay to show the success message
  } else {
    // Display low balance message if not enough funds
    const lowBalanceMessage = document.getElementById("success-message");
    lowBalanceMessage.style.display = "block";
    lowBalanceMessage.textContent = "Low Balance";

    setTimeout(() => {
      lowBalanceMessage.style.display = "none";
    }, 2000);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const coinName = 'ethereum'; // Replace with the default or selected coin name
  fetchRealTimePrice(coinName);
});

// Fetch the real-time crypto data for the table
async function fetchCryptoData() {
  try {
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=bitcoin,ethereum,tether,solana,ripple,cardano,dogecoin,avalanche-2';
    const response = await fetch(apiUrl);
    const data = await response.json();

    data.forEach(coin => {
      const coinId = coin.id;

      // Update price
      const priceElement = document.getElementById(`${coinId}-price`);
      if (priceElement) {
        priceElement.textContent = `₹${Math.round(coin.current_price).toLocaleString('en-IN')}`;
      }

      // Update market cap
      const marketCapElement = document.getElementById(`${coinId}-market-cap`);
      if (marketCapElement) {
        marketCapElement.textContent = `₹${Math.round(coin.market_cap).toLocaleString('en-IN')}`;
      }

      // Update price change
      const changeElement = document.getElementById(`${coinId}-change`);
      if (changeElement) {
        const priceChange = parseFloat(coin.price_change_percentage_24h);
        changeElement.textContent = `${priceChange.toFixed(2)}%`;
        changeElement.style.color = priceChange >= 0 ? '#50C878' : '#EE4B2B';
        changeElement.style.fontWeight = 'bold';
      }
    });
  } catch (error) {
    console.error('Error fetching crypto data:', error);
  }
}


// Load wallet data and fetch initial data
document.addEventListener("DOMContentLoaded", () => {
  loadWalletData();
  fetchCryptoData();
  setInterval(fetchCryptoData, 60000); // Refresh every 60 seconds
});
// Function to open a popup with real-time data of the selected coin
let chartInstance = null; // Global variable to hold chart instance

function openPopup2(name) {
  const apiUrl = `https://api.coingecko.com/api/v3/coins/${name.toLowerCase()}`;
  const historyApiUrl = `https://api.coingecko.com/api/v3/coins/${name.toLowerCase()}/market_chart?vs_currency=inr&days=7`;

  // Fetch both real-time and historical data in parallel
  Promise.all([fetch(apiUrl), fetch(historyApiUrl)])
    .then(async ([realTimeResponse, historyResponse]) => {
      const data = await realTimeResponse.json();
      const historyData = await historyResponse.json();

      // Extract and display real-time data
      displayRealTimeData(data);

      // Process and display historical data in chart
      displayChartData(historyData, 'prices');

      // Show the popup after all data is loaded
      document.getElementById("popup2").style.display = "flex";
    })
    .catch(error => {
      console.error("Error fetching data from CoinGecko:", error);
      displayErrorData(name);
    });
}

function displayRealTimeData(data) {
  document.getElementById("coin-image").src = data.image.large;
  document.getElementById("coin-name").innerText = data.name;
  document.getElementById("coin-price").innerText = "Price: ₹" + data.market_data.current_price.inr.toLocaleString('en-IN');
  document.getElementById("coin-marketcap").innerText = "₹" + data.market_data.market_cap.inr.toLocaleString('en-IN');
  document.getElementById("coin-fully-diluted-valuation").innerText = "₹" + data.market_data.fully_diluted_valuation.inr.toLocaleString('en-IN');
  document.getElementById("coin-total-volume").innerText = "₹" + data.market_data.total_volume.inr.toLocaleString('en-IN');
  document.getElementById("coin-low-24h").innerText = "₹" + data.market_data.low_24h.inr.toLocaleString('en-IN');
  document.getElementById("coin-high-24h").innerText = "₹" + data.market_data.high_24h.inr.toLocaleString('en-IN');
  document.getElementById("coin-circulating-supply").innerText = data.market_data.circulating_supply.toLocaleString();
  document.getElementById("coin-max-supply").innerText = data.market_data.max_supply ? data.market_data.max_supply.toLocaleString() : 'N/A';
  document.getElementById("coin-marketcap-rank").innerText = data.market_cap_rank;

  const priceChange24H = data.market_data.price_change_percentage_24h;
  const priceChangeText = priceChange24H >= 0
    ? `${priceChange24H.toFixed(2)}% 🔼`
    : `${Math.abs(priceChange24H).toFixed(2)}% 🔻`;

  const priceChangeTextElement = document.getElementById("price-change");
  priceChangeTextElement.innerText = priceChangeText;
  priceChangeTextElement.style.color = priceChange24H >= 0 ? "#50C878" : "#EE4B2B";
}

function displayChartData(historyData, dataType) {
  const dataPoints = historyData[dataType].map(point => point[1]);
  const dates = historyData[dataType].map(point => new Date(point[0]).toLocaleDateString('en-IN'));

  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = document.getElementById("priceChart").getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(76, 175, 80, 0.3)");
  gradient.addColorStop(1, "rgba(76, 175, 80, 0)");

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [{
        label: dataType.replace('_', ' ').toUpperCase(),
        data: dataPoints,
        borderColor: "#4CAF50",
        backgroundColor: gradient,
        pointRadius: 0,
        fill: true,
        borderWidth: 2,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: true,
          grid: { display: false },
          ticks: { maxTicksLimit: 10 }
        },
        y: {
          display: true,
          grid: { color: "rgba(200, 200, 200, 0.1)" }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `₹${context.parsed.y.toLocaleString('en-IN')}`;
            }
          }
        }
      }
    }
  });
}

function updateChart(dataType, days) {
  const historyApiUrl = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=inr&days=${days}`;
  
  fetch(historyApiUrl)
    .then(response => response.json())
    .then(historyData => displayChartData(historyData, dataType))
    .catch(error => console.error("Error fetching historical data:", error));
}

function displayErrorData(name) {
  document.getElementById("coin-name").innerText = name;
  document.getElementById("coin-price").innerText = "Data not available";
  document.getElementById("coin-marketcap").innerText = "Data not available";
  document.getElementById("coin-fully-diluted-valuation").innerText = "Data not available";
  document.getElementById("coin-total-volume").innerText = "Data not available";
  document.getElementById("coin-low-24h").innerText = "Data not available";
  document.getElementById("coin-high-24h").innerText = "Data not available";
  document.getElementById("coin-circulating-supply").innerText = "Data not available";
  document.getElementById("coin-max-supply").innerText = "Data not available";
  document.getElementById("coin-marketcap-rank").innerText = "Data not available";
  
  document.getElementById("popup2").style.display = "flex";
}

function closePopup2() {
  document.getElementById("popup2").style.display = "none";
}


