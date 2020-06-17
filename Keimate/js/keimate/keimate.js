function isNullOrUndefined(a) {
	return (a === null) || (a === undefined);
}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function numberFormat(labelValue, i) {
	// Nine Zeroes for Billions
	return Math.abs(Number(labelValue)) >= 1.0e+9 ?
		i === 0 ? parseFloat((Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2)) : parseFloat((Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2)) + " b"
		// Six Zeroes for Millions
		:
		Math.abs(Number(labelValue)) >= 1.0e+6 ?
		i === 0 ? parseFloat((Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2)) : parseFloat((Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2)) + " m"
		// Three Zeroes for Thousands
		:
		Math.abs(Number(labelValue)) >= 1.0e+3 ?
		i === 0 ? parseFloat((Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2)) : parseFloat((Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2)) + " k" :
		Math.abs(Number(labelValue));
}

function random(min, max) { // min and max included
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isCombat() {
	return window.location.hash.indexOf("#raid_multi/") > -1 ||
		window.location.hash.indexOf("#raid/") > -1;
}

var simulateClick = function (elem) {
	try {
		var rect = elem.getBoundingClientRect(),
			topEnter = rect.top,
			leftEnter = rect.left, // coordinates of elements topLeft corner
			topMid = random(rect.bottom, rect.top), // Math.floor(Math.random() * (rect.bottom-rect.top+1)) + rect.top,
			leftMid = random(rect.right, rect.left), //Math.floor(Math.random() * (rect.right-rect.left+1)) + rect.left
			//topMid = topEnter + rect.height / 2,
			//leftMid = topEnter + rect.width / 2, // coordinates of elements center
			ddelay = (rect.height + rect.width) * 0.1, // delay depends on elements size, default 2x
			ducInit = {
				bubbles: true,
				clientX: leftMid,
				clientY: topMid
			}, // create init object
			// set up the four events, the first with enter-coordinates,
			mover = new MouseEvent('mouseover', {
				bubbles: true,
				clientX: leftEnter,
				clientY: topEnter
			}),
			// the other with center-coordinates
			mdown = new MouseEvent('mousedown', ducInit),
			mup = new MouseEvent('mouseup', ducInit),
			mclick = new MouseEvent('click', ducInit);
		// trigger mouseover = enter element at toLeft corner
		elem.dispatchEvent(mover);
		// trigger mousedown  with delay to simulate move-time to center
		window.setTimeout(function () {
			elem.dispatchEvent(mdown)
		}, ddelay);
		// trigger mouseup and click with a bit longer delay
		// to simulate time between pressing/releasing the button
		window.setTimeout(function () {
			elem.dispatchEvent(mup);
			elem.dispatchEvent(mclick);
		}, ddelay * random(.99, 1.2)); //default 1.2x
	} catch (e) {}
}

function pResetBonus() {
	var resetMarkBtn = document.querySelector("div.prt-bonus-reset-button.btn-bonus-reset.weapon");
	!isNullOrUndefined(resetMarkBtn) ? simulateClick(resetMarkBtn) : null;
}

function pSpaceBar(e) {
	var buttons = ['div.btn-usual-ok', //normal ok button
		'div.btn-usual-ok.btn-summon-use',
		'div.btn-settle', //upgrade button step 1
		'div.btn-synthesis', //upgrade button step 2
		'div.btn-usual-text.exchange', //casino
		'div.btn-usual-text.buy', //all shops
		'div.btn-evolution.active',
		'div.btn-use-item',
		'div.btn-follow-again', //uncapping
		'div.btn-usual-exchange', //reset btn
		"div.btn-move-division", //arcarum move button
		"div.btn-usual-close" //close button
	];
	var elem;

	var okButton = document.querySelector(buttons[0]);
	if (!isNullOrUndefined(okButton)) {
		elem = document.querySelector(buttons[0]).className.includes("btn-usual-ok") ?
			document.querySelector(buttons[0]) :
			document.querySelectorAll(buttons[0])[1];
	} else {
		for (var i = 1; i < buttons.length; i++) {
			var btn = document.querySelector(buttons[i]);			
			if (!isNullOrUndefined(btn)) {
				elem = btn;
			} else if (buttons[i] === "div.btn-evolution.active") {
				elem = document.querySelector("#btn-evolution");
			}
		}
	}

	if (!isNullOrUndefined(elem)) {
		var overlayMask = document.querySelector('div.onm-anim-mask');
		if (!isNullOrUndefined(overlayMask) && getComputedStyle(overlayMask).getPropertyValue('display') === "none") {
			simulateClick(overlayMask);			
		}else{
			simulateClick(elem);
		}
	}
}

//qwer -> 113,119,101,114 (skill) || QWER -> 81, 87, 69, 82 (skill)
var combat = [81, 87, 69, 82];
//1234 -> 49, 50, 51, 52 (character)
var combat2 = [49, 50, 51, 52];

//Keypress handler
document.addEventListener('keydown', function (e) {
	if (e.which === 32) {
		var typing = true;
		var textAreas = document.querySelectorAll("textarea");
		for (var i = 0; i < textAreas.length; i++) {
			if (!isNullOrUndefined(textAreas[i].getAttribute("disabled") && textAreas[i].getAttribute("disabled") == true)) {
				typing = false;
			}
		}

		if (!typing) {
			pSpaceBar(e);
			e.preventDefault();
			e.stopPropagation();
		} else {
			return true;
		}
	}

	if (e.keyCode === 67) pCA();
	if (e.keyCode === 82) pResetBonus();

	if (e.key === "Escape" || e.key === "Esc") {
		if (!isCombat()) {
			return;
		}
		var backButton = document.querySelectorAll("div.btn-command-back");
		selectedCombatChara = {};
		sSkill = [];
		if (backButton.length > 0 && !isNullOrUndefined(backButton[0])) {
			simulateClick(backButton[0]);
		}
	}

	if (combat2.includes(e.keyCode)) {
		if (!isCombat()) {
			return;
		};
		var index = combat2.indexOf(e.keyCode);
		shortcutSelectChara(index)
	}

	if (combat.includes(e.keyCode)) {
		if (!isCombat()) {
			return;
		};
		var index = combat.indexOf(e.keyCode);
		shortcutSkill(index);
	}
});