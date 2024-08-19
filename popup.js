const api = 'https://api.exchangerate-api.com/v4/latest/';

const topUpEl = document.getElementById('topUp');

const minEl = document.getElementById('min');
const maxEl = document.getElementById('max');
const resEl = document.getElementById('res');
const minCEl = document.getElementById('minC');
const maxCEl = document.getElementById('maxC');
const Cfrom = document.getElementById('Cfrom');
const Cto = document.getElementById('Cto');

// popup.js
document.getElementById('sendMessage').addEventListener('click', () => {
	// Get the active tab
	getData();
});

document.addEventListener('keydown', (ev) => {
	if (ev.key == 'Enter') {
		getData();
	}
});

function getData() {
	try {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			let activeTab = tabs[0];

			// Send a message to the content script
			chrome.tabs.sendMessage(activeTab.id, {}, (response) => {
				if (!response) return showBestTopUp();
				if (response.type == 'topUp') {
					showBestTopUp(response.data);
				} else if (response.type == 'items') {
					console.log(response.data);
				}
			});
		});
	} catch (err) {
		showBestTopUp();
	}
}

// // Listen for messages from the content script
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// 	console.log(request.msg);
// });
/**
 *
 * @param {TopUpObj[]} data
 */
async function showBestTopUp(data) {
	topUpEl.innerHTML = '';
	console.log(
		'----------------------------------------------------------------------'
	);

	try {
		if (!data) throw new Error('No data');

		let converted = await getCurrency(data);

		const filtered = converted.filter(
			(o) =>
				parseInt(o.price) > parseInt(minEl.value || 0) &&
				parseInt(o.price) < parseInt(maxEl.value || 10000) &&
				parseInt(o.dia) > parseInt(minCEl.value || 0) &&
				parseInt(o.dia) < parseInt(maxCEl.value || 10000)
		);

		filtered.sort((a, b) => b.diaPrice - a.diaPrice);

		let topTen = filtered.slice(0, parseInt(resEl.value || 10));

		topTen.forEach((t) => {
			topUpEl.innerHTML += `<li>Dia: ${t.dia}, price: ${t.price}, dia/price: ${t.diaPrice}</li>`;

			console.log(
				`Dia: ${t.dia}, price: ${t.price}, dia/price: ${t.diaPrice}`
			);
		});
	} catch (err) {
		topUpEl.innerHTML = 'Data not found! Please try refreshing the page';
		console.log(err);
	}

	console.log(
		'----------------------------------------------------------------------'
	);
}

function getCurrency(data) {
	return new Promise((res, rej) => {
		try {
			fetch(`${api}${Cfrom.value}`)
				.then((currency) => {
					return currency.json();
				})
				.then((currency) => {
					return res(convertCurrency(currency, data));
				});
		} catch (err) {
			rej(err);
		}
	});
}

function convertCurrency(currency, data) {
	let fromRate = currency.rates[Cfrom.value];
	let toRate = currency.rates[Cto.value];

	for (let o in data) {
		data[o].price = ((toRate / fromRate) * data[o].price).toFixed(2);
		data[o].diaPrice = (data[o].dia / data[o].price).toFixed(3);
	}

	return data;
	// sendTopUp();
}

//! Toggle theme
document.addEventListener('DOMContentLoaded', () => {
	const themeToggleButton = document.getElementById('toggleTheme');

	// Retrieve the stored theme from localStorage or default to light-theme
	const currentTheme = localStorage.getItem('theme') || 'light-theme';
	document.body.classList.add(currentTheme);

	themeToggleButton.addEventListener('click', () => {
		// Toggle between light-theme and dark-theme
		const isLightTheme = document.body.classList.contains('light-theme');
		const newTheme = isLightTheme ? 'dark-theme' : 'light-theme';

		// Remove the current theme and add the new theme
		document.body.classList.remove(
			isLightTheme ? 'light-theme' : 'dark-theme'
		);
		document.body.classList.add(newTheme);

		// Save the new theme in localStorage
		localStorage.setItem('theme', newTheme);
	});
});
