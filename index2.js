const currentUrl = window.location.href;

/**
 * @typedef TopUpObj
 * @prop {number} dia
 * @prop {number} price
 * @prop {number} diaPrice
 *
 * @typedef ItemObj
 */

if (currentUrl.endsWith('top-up')) {
	topUp();
} else if (currentUrl.endsWith('items')) {
	items();
}

function topUp() {
	/**
	 * @type {TopUpObj[]}
	 */
	const array = [];
	const lis = document.querySelectorAll('li.product-item');
	lis.forEach((li) => {
		let dia = li.getElementsByClassName('product-item-name')[0].innerHTML;
		let price =
			li.getElementsByClassName('product-item-price')[0].innerHTML;

		dia = dia.split(' ')[0];
		price = price.split(' ')[0];

		price = parseFloat(price);

		price = (price + (price / 100) * 3.6 + 0.4653).toFixed(2);

		if (isNaN(dia)) return;

		array.push({ dia, price, diaPrice: (dia / price).toFixed(3) });
	});

	return array;

	// euroToCZKTopUp
}

// function showBestTopUp() {
// 	console.log(
// 		'----------------------------------------------------------------------'
// 	);

// 	const filtered = arrTopUp.filter((o) => o.dia > 2000);

// 	filtered.sort((a, b) => b.diaPrice - a.diaPrice);

// 	let topTen = filtered.slice(0, 9);

// 	topTen.forEach((t) => {
// 		console.log(
// 			`Dia: ${t.dia}, price: ${t.price}, dia/price: ${t.diaPrice}`
// 		);
// 	});

// 	console.log(
// 		'----------------------------------------------------------------------'
// 	);
// }

// function eurToCZKTopUp(currency) {
// 	let fromRate = currency.rates['EUR'];
// 	let toRate = currency.rates['CZK'];

// 	for (let o in arrTopUp) {
// 		arrTopUp[o].price = ((toRate / fromRate) * arrTopUp[o].price).toFixed(
// 			0
// 		);
// 		arrTopUp[o].diaPrice = (arrTopUp[o].dia / arrTopUp[o].price).toFixed(3);
// 	}

// 	// sendTopUp();
// }

function items() {
	/**
	 * @type {ItemObj[]}
	 */
	const array = [];
	const lis = document.querySelectorAll('a.section-item');
	lis.forEach((li) => {
		let name = li.getElementsByTagName('span')[0].innerHTML;
		let price = li.getElementsByClassName('price-num')[0].innerHTML;

		console.log(name, price);
	});

	return array;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (currentUrl.endsWith('top-up')) {
		sendResponse({ type: 'topUp', data: topUp() });
	} else if (currentUrl.endsWith('items')) {
		sendResponse({ type: 'items', data: items() });
	}
});
