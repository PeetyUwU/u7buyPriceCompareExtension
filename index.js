const api = 'https://api.exchangerate-api.com/v4/latest/EUR';

/**
 * @typedef Obj
 * @prop {number} dia
 * @prop {number} price
 * @prop {number} diaPrice
 */

/**
 * @type {Obj[]}
 */
const arr = [];

function init() {
	const lis = document.querySelectorAll('li.product-item');
	lis.forEach((li) => {
		let dia = li.getElementsByClassName('product-item-name')[0].innerHTML;
		let price =
			li.getElementsByClassName('product-item-price')[0].innerHTML;

		dia = dia.split(' ')[0];
		price = price.split(' ')[0];

		if (isNaN(dia)) return;

		// console.log(
		// 	`Dia: ${dia}, price: ${price}, dia/price: ${(dia / price).toFixed(
		// 		3
		// 	)}`
		// );
		arr.push({ dia, price, diaPrice: (dia / price).toFixed(3) });
	});

	getCurrency();
}

function showBestTopUp() {
	console.log(
		'----------------------------------------------------------------------'
	);

	const filtered = arr.filter((o) => o.dia > 2000);

	filtered.sort((a, b) => b.diaPrice - a.diaPrice);

	let topTen = filtered.slice(0, 9);

	topTen.forEach((t) => {
		console.log(
			`Dia: ${t.dia}, price: ${t.price}, dia/price: ${t.diaPrice}`
		);
	});

	console.log(
		'----------------------------------------------------------------------'
	);
}

function getCurrency() {
	fetch(`${api}`)
		.then((currency) => {
			return currency.json();
		})
		.then(eurToCZKTopUp);
}

function eurToCZKTopUp(currency) {
	let fromRate = currency.rates['EUR'];
	let toRate = currency.rates['CZK'];

	for (let o in arr) {
		arr[o].price = ((toRate / fromRate) * arr[o].price).toFixed(0);
		arr[o].diaPrice = (arr[o].dia / arr[o].price).toFixed(3);
	}

	showBestTopUp();
}

init();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.message === 'Hello from Popup') {
		console.log('Message received from popup:', request.message);

		// Respond back to the popup
		sendResponse({ reply: 'Hello from Content Script' });
	}
});
