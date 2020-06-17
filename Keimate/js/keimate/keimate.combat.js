var sSkill = [];
var selectedCombatChara;

function showSkillCD() {
	if (!isCombat()) return;

	//all charater skill nodes
	var charaSkillDetails = document.querySelectorAll('[ability-id]');
	var cdCharaSkills = []; //sorted into chara[index], skills
	for (var i = 0; i <= 3; i++) { //sorting
		var currentChara = {
			skills: []
		}
		for (var j = 0; j < charaSkillDetails.length; j++) {
			if ((charaSkillDetails[j].outerHTML.includes("ability-character-num-" + (i + 1)) === true)) {
				var availableSkill = charaSkillDetails[j].getAttribute("ability-recast");
				if (!isNullOrUndefined(availableSkill)) {
					currentChara.skills.push(availableSkill);
				}
			}
		}

		cdCharaSkills.push(currentChara);
	}
	var cdSkillMini = [];
	var partyAbilityStates = document.querySelectorAll('div.prt-ability-state');
	for (var i = 0; i < partyAbilityStates.length; i++) {
		if (i <= 3) {
			cdSkillMini.push(partyAbilityStates[i]);
		}
	}
	//looping each character, and its skills, to set its skill timer
	for (var i = 0; i < cdSkillMini.length; i++) {
		var skCount = 0;
		var stateChildren = document.querySelectorAll('div.prt-ability-state')[i].childNodes;
		for (var j = 0; j < stateChildren.length; j++) {
			if ((j % 2) === 1) {
				var coolDown = cdCharaSkills[i].skills[skCount];
				if (!isNullOrUndefined(coolDown)) {
					if (coolDown === '0') {
						coolDown = "";
					}
					stateChildren[j].innerHTML = '<p style="position: relative;color:black;font-weight:bold;font-size: 6px;text-align: center;top: -4px;text-shadow: 0 0 10px #ffffff, 0 0 10px #ffffff;">' + coolDown + '</p>';
				}
				skCount++;
			}
		}
	}
}

/**Keyboard Events**/
function pCA() {
	if (!isCombat()) {
		return
	};
	var c = document.querySelector('div.btn-lock.lock1');
	var c1 = document.querySelector('div.btn-lock.lock0'); //no auto
	!isNullOrUndefined(c) ? simulateClick(c) : null;
	!isNullOrUndefined(c1) ? simulateClick(c1) : null;
}

/**Show Enemy HP**/
function showBossHP() {
	if (!isCombat()) {
		return
	};
	try {
		var a = stage.pJsnData.boss;
		var enemyId = -1;
		var combatField = document.querySelectorAll("div.prt-gauge-area")[0].childNodes;
		combatField.forEach(function (enemy, eIndex) {
			if (!isNullOrUndefined(enemy.className) && enemy.classList.contains("prt-enemy-percent")) {
				enemyId++;
				var newStr = numberWithCommas(numberFormat(a.param[enemyId].hp, 1) + " / " + numberFormat(a.param[enemyId].hpmax), 1);
				var accPercHP = ((a.param[enemyId].hp / a.param[enemyId].hpmax) * 100).toFixed(1);
				var stillAlive = a.number;
				a.param.forEach(function (e, i) {
					if (e.alive === 0) {
						stillAlive--;
					}
				});
				if (stillAlive > 1) {
					enemy.childNodes[1].innerText = accPercHP + "%" + "\n (" + newStr + ")";
					enemy.childNodes[1].style.cssText = "text-shadow: 0 0 1px #731400, 0 0 1px #731400, 0 0 1px #731400, 0 0 1px #731400, 0 0 2px #731400, 0 0 2px #731400, 0 0 2px #731400, 0 0 2px #731400; display: -webkit-box; margin: -34px 0 0 -20px; font-size:12px; width: 200px !important";
				} else {
					enemy.childNodes[1].innerText = accPercHP + "%" + "	(" + newStr + ")";
					enemy.childNodes[1].style.cssText = "text-shadow: 0 0 1px #731400, 0 0 1px #731400, 0 0 1px #731400, 0 0 1px #731400, 0 0 2px #731400, 0 0 2px #731400, 0 0 2px #731400, 0 0 2px #731400; display: -webkit-box; margin: -6px 0 0 70px; font-size:15px; width: 300px !important";
				}
			}
		});
	} catch (e) {
		if (e instanceof ReferenceError) {}
	}
}

function pResetBonus() {
	var resetMarkBtn = document.querySelector("div.prt-bonus-reset-button.btn-bonus-reset.weapon");
	!isNullOrUndefined(resetMarkBtn) ? simulateClick(resetMarkBtn) : null;
}

document.addEventListener('click', function (e) {
	if (isCombat() && !isNullOrUndefined(e.target.parentNode) && !isNullOrUndefined(e.target.parentNode.getAttribute("pos"))) {
		selectedCombatChara = {};
		sSkill = [];
		selectedCombatChara = e.target.parentNode;
		setCharaSkill(selectedCombatChara.getAttribute("pos"));
	}
});

var ready = function () {
	if (isCombat()) {
		var abilityIds = document.querySelectorAll('[ability-id]');
		if (abilityIds.length > 0 && document.querySelectorAll("div.prt-gauge-area")[0].childNodes.length > 0) {
			for (var i = 0; i < abilityIds.length; i++) {
				observer.observe(abilityIds[i], {
					attributes: true,
					childList: true,
					characterData: true
				});
			}
			var enemyHPs = document.querySelectorAll("[id^=enemy-hp]");
			for (var i = 0; i < enemyHPs.length; i++) {
				observer.observe(enemyHPs[i], {
					attributes: true,
					childList: true,
					characterData: true
				});
			}
			try {
				showSkillCD();
				showBossHP();
			} catch (e) {
				if (e instanceof ReferenceError) {};
			}
		}
	}
	window.requestAnimationFrame(ready);
};
window.requestAnimationFrame(ready);


function setCharaSkill(index) {
	sSkill = [];
	// document.querySelectorAll("div.prt-ability-list")[0].childNodes[1].className.includes("btn-ability-available")
	var prtAbilityList = document.querySelectorAll("div.prt-ability-list")[index].childNodes;
	
	sSkill = Object.values(prtAbilityList).filter(function (item) {
		if (!isNullOrUndefined(item.className) && item.className.includes("btn-ability")) {
			return item;
		}
	});
}

function shortcutSelectChara(index) {
	try {
		simulateClick(document.querySelectorAll("div.lis-character" + index + ".btn-command-character")[0]);
		setCharaSkill(index);
	} catch (e) {}
}

function shortcutSkill(index) {
	try {
		if (sSkill[index].className.includes("btn-ability-available")) {
			simulateClick(sSkill[index]);
		}
	} catch (e) {}
}