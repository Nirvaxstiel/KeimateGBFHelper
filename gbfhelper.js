//null handlers
function isNull(a){return a === null;}
function isUndefined(a){return a === undefined;}
function isNullOrUndefined(a){return isNull(a) || isUndefined(a);}

var simulateClick = function (elem) {
	var rect = elem.getBoundingClientRect(),
	    topEnter = rect.top,
        leftEnter = rect.left, // coordinates of elements topLeft corner
        topMid = Math.floor(Math.random() * (rect.bottom-rect.top+1)) + rect.top,
        leftMid = Math.floor(Math.random() * (rect.right-rect.left+1)) + rect.left, 
        //topMid = topEnter + rect.height / 2,
        //leftMid = topEnter + rect.width / 2, // coordinates of elements center
        ddelay = (rect.height + rect.width) * 0.1, // delay depends on elements size, default 2x
        ducInit = {bubbles: true, clientX: leftMid, clientY: topMid}, // create init object
        // set up the four events, the first with enter-coordinates,
        mover = new MouseEvent('mouseover', {bubbles: true, clientX: leftEnter, clientY: topEnter}),
        // the other with center-coordinates
        mdown = new MouseEvent('mousedown', ducInit),
        mup = new MouseEvent('mouseup', ducInit),
        mclick = new MouseEvent('click', ducInit);
	// trigger mouseover = enter element at toLeft corner
    elem.dispatchEvent(mover);
    // trigger mousedown  with delay to simulate move-time to center
    window.setTimeout(function() {elem.dispatchEvent(mdown)}, ddelay);
    // trigger mouseup and click with a bit longer delay
    // to simulate time between pressing/releasing the button
    window.setTimeout(function() {
        elem.dispatchEvent(mup); elem.dispatchEvent(mclick);
    }, ddelay * 1.2); //default 1.2x
};
/**Keyboard Events**/
function pAttack(){
	var a = 'div.btn-attack-start.display-on'; //atk button
	var b = 'div.btn-attack-cancel.btn-cancel.display-on'; //cancel atk
	if(!isNullOrUndefined(a)){simulateClick(document.querySelector(a));}
	if(!isNullOrUndefined(b)){simulateClick(document.querySelector(b));}
}
function pCA(){
	var c = 'div.btn-lock.lock1'; //auto ca
	var c1 = 'div.btn-lock.lock0'; //no auto
	
	if(!isNullOrUndefined(document.querySelector(c))){
		simulateClick(document.querySelector(c));}
	if(!isNullOrUndefined(document.querySelector(c1))){
		simulateClick(document.querySelector(c1));}
}
function pResetBonus(){
	var resetMarkBtn = document.querySelector("div.prt-bonus-reset-button.btn-bonus-reset.weapon");
	if(!isNullOrUndefined(resetMarkBtn)){simulateClick(resetMarkBtn);}
}
function pSpaceBar(e){
	var buttons = ['div.btn-usual-ok', //normal ok button
		'div.btn-settle', //upgrade button step 1
		'div.btn-synthesis', //upgrade button step 2
		'div.btn-usual-ok.se-quest-start on', //start quest after pt select
		'div.btn-usual-text.exchange', //casino
		'div.btn-usual-text.buy', //all shops
		'div.btn-evolution.active',
		'div.btn-follow-again',//uncapping
		'div.btn-usual-exchange'//reset btn
		];
	var elem;
	var queue = [];
	buttons.forEach(function(value, i){
		var a = document.querySelector(value);
		if(!isNullOrUndefined(a)){
			if (i===0){queue.unshift(value);}else{queue.push(value);}////okbutton takes no.1 priority
		}
	});
	if(queue.length>0){
		if(queue[0] === buttons[0]){elem = document.querySelector(queue[0]);}//prioritize ok btn in queue
		else{queue.forEach(function(value, i){elem = document.querySelector(value);});}
	}
	var checkOverlay = document.querySelector('div.onm-anim-mask');
	var summonBtn = document.querySelector('div.btn-usual-ok.btn-summon-use');
	var abilityBtn = document.querySelector('div.btn-usual-ok.btn-ability-use');
	if(!isNullOrUndefined(summonBtn)){if(elem.outerHTML===summonBtn.outerHTML){}}
	else if(!isNullOrUndefined(abilityBtn)){if(elem.outerHTML===abilityBtn.outerHTML){}}		
	else if(isNullOrUndefined(checkOverlay)){simulateClick(elem);}//overlay doesnt exist, click btn as intended
	else if(getComputedStyle(checkOverlay).getPropertyValue('display') === "none"){simulateClick(elem);} //overlay present but hidden, click btn as intended
	else{simulateClick(checkOverlay);}//overlay present, click on overlay first before clicking on the intended btn
}
/**Show Skill Cooldowns**/
function showSkillCD(){
	//all charater skill nodes
	var charaSkillDetails = document.querySelectorAll('[ability-id]');
	 
	var cdCharaSkills = []; //sorted into chara[index], skills
	
	for (i = 0; i<=3;i++){ //sorting
		var currentChara = {skills:[]}	
		charaSkillDetails.forEach(function(value,index){
			if(value.outerHTML === document.querySelector("div.btn-usual-ok.btn-ability-use").outerHTML){
			}else if((value.outerHTML.includes("ability-character-num-"+(i+1)) ===true)){
				if(!isNullOrUndefined(value.getAttribute("ability-recast"))){
					currentChara.skills.push(value.getAttribute("ability-recast"))
				}
			}
		});
		cdCharaSkills.push(currentChara);
	}
	var loadSkillMini = document.querySelectorAll('div.prt-ability-state'); //mini icon skills are placed in another dom
	var cdSkillMini = [];
	loadSkillMini.forEach(function(value, index){
		if(index<=3){
			cdSkillMini.push(value);
		}
	});
	//looping each character, and its skills, to set its skill timer
	cdSkillMini.forEach(function(value,index){
		//for each skill box index = character #
		var skCount = 0;
		document.querySelectorAll('div.prt-ability-state')[index].childNodes.forEach(function(childVal, childIndex){
			//childIndex = skill#
			if((childIndex % 2)===1){
				var coolDown = cdCharaSkills[index].skills[skCount];
				if(!isNullOrUndefined(coolDown)){
					if(coolDown==='0'){	coolDown = "";}
					childVal.innerHTML='<p style="position: relative;color:black;font-weight:bold;font-size: 6px;text-align: center;top: -4px;text-shadow: 0 0 10px #ffffff, 0 0 10px #ffffff;">'+coolDown+'</p>';	
				}
				skCount++;
			}
		});
	});
}
//Keypress handler
document.addEventListener('keydown', function (e) {
	if(e.which == 32){e.preventDefault();e.stopPropagation();	}
	if (e.keyCode === 32){pSpaceBar(e);}
	if (e.keyCode === 65){pAttack();}
	if (e.keyCode === 67){pCA();}
	if (e.keyCode === 82){pResetBonus();}
});

//DOMContentLoaded - Work around for showSkillCD not executing under listener on DOMContentLoaded 
var ready = function () {
	if (document.querySelectorAll('[ability-id]').length > 1) {
		showSkillCD();
		return;
	}
	window.requestAnimationFrame(ready);
};
window.requestAnimationFrame(ready);
