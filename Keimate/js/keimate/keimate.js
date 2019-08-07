//null handlers
function isNull(a){return a === null;}
function isUndefined(a){return a === undefined;}
function isNullOrUndefined(a){return isNull(a) || isUndefined(a);}
function numberWithCommas(x) {return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");}
function numberFormat (labelValue, i){	
    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9 ? 
	i===0? parseFloat((Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2)) : parseFloat((Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2)) + " b"
	// Six Zeroes for Millions 
	: Math.abs(Number(labelValue)) >= 1.0e+6 ? 
	i===0? parseFloat((Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2)) : parseFloat((Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2)) + " m"
	// Three Zeroes for Thousands
	: Math.abs(Number(labelValue)) >= 1.0e+3 ? 
	i===0? parseFloat((Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2)) : parseFloat((Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2)) + " k"	
	: Math.abs(Number(labelValue));	

}
/* function numberFormat (labelValue, i){
    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(1) + " b"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6

    ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(1) + " m"
    // Three Zeroes for Thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3

    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(1) + " k"

    : Math.abs(Number(labelValue));
} */

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
	delete rect, topEnter, leftEnter, topMid, leftMid, ddelay, ducInit, mover, mdown, mup, mclick;
}

/**Keyboard Events**/
function pCA(){
	var c = 'div.btn-lock.lock1'; //auto ca
	var c1 = 'div.btn-lock.lock0'; //no auto	
	!isNullOrUndefined(document.querySelector(c))? simulateClick(document.querySelector(c)) : null;
	!isNullOrUndefined(document.querySelector(c1))? simulateClick(document.querySelector(c1)) : null;
	
	delete c,c1;
}
function pResetBonus(){
	var resetMarkBtn = document.querySelector("div.prt-bonus-reset-button.btn-bonus-reset.weapon");
	!isNullOrUndefined(resetMarkBtn)? simulateClick(resetMarkBtn) : null;
	delete resetMarkBtn;
}

function pSpaceBar(e){
	var buttons = ['div.btn-usual-ok', //normal ok button
		'div.btn-settle', //upgrade button step 1
		'div.btn-synthesis', //upgrade button step 2		
		'div.btn-usual-text.exchange', //casino
		'div.btn-usual-text.buy', //all shops
		'div.btn-evolution.active',
		'div.btn-use-item',
		'div.btn-follow-again',//uncapping
		'div.btn-usual-exchange',//reset btn
		"div.btn-move-division", //arcarum move button
		"div.btn-usual-close" //close button
		];
	var elem;
	var queue = [];
	buttons.forEach(function(value, i){
		var a = document.querySelector(value);
		if(!isNullOrUndefined(a)){
			if(i===0){
				queue.unshift(value);
			}else{
				queue.push(value);
			}////okbutton takes no.1 priority							
		}
		delete a;
	});
	if(queue.length>0){
		//prioritize ok btn in queue			
		if(queue[0] === buttons[0] && !isNullOrUndefined(document.querySelector(queue[0]))){
			elem = document.querySelector(queue[0]).className === "btn-usual-ok btn-ability-use"? 
				document.querySelectorAll(queue[0])[1]:document.querySelector(queue[0]);	
		}else{
			queue.forEach(function(value, i){
				if(!isNullOrUndefined(document.querySelector(value))){
					elem  = document.querySelector(value);
				}else if(value==="div.btn-evolution.active"){
					elem = document.querySelector("#btn-evolution");
				}
			});
		}		
	}
	//var ignore = ['div.btn-usual-ok.btn-summon-use', 'div.btn-usual-ok.btn-ability-use', 'div.onm-anim-mask']	
	if(!isNullOrUndefined(elem.getBoundingClientRect)){		
		isNullOrUndefined(document.querySelector('div.onm-anim-mask'))? simulateClick(elem) :
		getComputedStyle(document.querySelector('div.onm-anim-mask')).getPropertyValue('display') === "none" ? simulateClick(elem) :
		simulateClick(document.querySelector('div.onm-anim-mask'));				
	}
	
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
		delete currentChara;
	}
	delete charaSkillDetails;
	var cdSkillMini = [];
	document.querySelectorAll('div.prt-ability-state').forEach(function(value, index){
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
				delete coolDown;
			}
		});
		delete skCount;
	});
	delete cdSkillMini, cdCharaSkills;
}
/**Show Enemy HP**/
function showBossHP(){
	try{
		var a = stage.pJsnData.boss; var enemyId = -1;
		document.querySelectorAll("div.prt-gauge-area")[0].childNodes.forEach(function(enemy,eIndex){			
			if(!isNullOrUndefined(enemy.className) && enemy.classList.contains("prt-enemy-percent")){			
				enemyId++; 
				var newStr =  numberWithCommas(numberFormat(a.param[enemyId].hp,1)+" / "+numberFormat(a.param[enemyId].hpmax),1);
				var accPercHP = ((a.param[enemyId].hp/a.param[enemyId].hpmax)*100).toFixed(1);
				var stillAlive = a.number;
				a.param.forEach(function(e, i){
					if(e.alive===0){
						stillAlive--;
					}
				});				
				if(stillAlive > 1){		
					enemy.childNodes[1].innerText = accPercHP +"%" + "\n (" + newStr+")";
					enemy.childNodes[1].style.cssText = "text-shadow: 0 0 1px #731400, 0 0 1px #731400, 0 0 1px #731400, 0 0 1px #731400, 0 0 2px #731400, 0 0 2px #731400, 0 0 2px #731400, 0 0 2px #731400; display: -webkit-box; margin: -34px 0 0 -20px; font-size:12px; width: 200px !important";
				}else{
					enemy.childNodes[1].innerText = accPercHP +"%" + "	(" + newStr+")";
					enemy.childNodes[1].style.cssText = "text-shadow: 0 0 1px #731400, 0 0 1px #731400, 0 0 1px #731400, 0 0 1px #731400, 0 0 2px #731400, 0 0 2px #731400, 0 0 2px #731400, 0 0 2px #731400; display: -webkit-box; margin: -6px 0 0 70px; font-size:15px; width: 300px !important";
				}							
				delete newStr,accPercHP, stillAlive;
			}		
		});
		delete a,enemyId;
	}catch(e){if (e instanceof ReferenceError){};}
}

function loadTracker(type){		
	if(type==="Supply"){
		var items = document.querySelectorAll("div.lis-item.se");
		items.forEach(function(item,i){						
				var tracker = document.createElement("div"); 
				tracker.className = "keimateTracker"		
				var result = yeet.filter(obj => {
					return obj.dataIndex === item.getAttribute("data-index");
				});	
				if(result.length >0){
					tracker.className = "keimateTracked"	
				}				
				item.appendChild(tracker);
				delete tracker, result;
									
		});
		delete items;
	}else if (type==="Update"){
		var checkTracker = localStorage.getItem("itemTrackingList") === null? [] : JSON.parse(localStorage.getItem("itemTrackingList"));		
		document.querySelectorAll("[class*='keimateTrack'").forEach(function(item,i){
			if(i%2!==0){
				var result = checkTracker.filter(obj => {
					return obj.dataIndex === item.parentElement.getAttribute("data-index");
				});	
				if(result.length >0){
					item.className = "keimateTracked"	
				}else if(result.length<1){		
					item.className = "keimateTracker";
				}				
				delete result;
			}
		});
		delete checkTracker;
	}
}

//Keypress handler
document.addEventListener('keydown', function (e) {
	if(e.which === 32){e.preventDefault();e.stopPropagation();	}
	if (e.keyCode === 32){pSpaceBar(e);}
	if (e.keyCode === 67){pCA();}
	if (e.keyCode === 82){pResetBonus();}
});

// The DOM node to observe
// create an observer instance
var observer = new MutationObserver(function(mutations) {
	try{
		showSkillCD();				
		showBossHP();
	}catch(e){if (e instanceof ReferenceError){};}	
});
// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true }; //subtree:true

//DOMContentLoaded - Work around for showSkillCD not executing under listener on DOMContentLoaded 
var ready = function () {	
	/* if(document.querySelectorAll("body.jssdk").length>0){
		var trackerBar = document.createElement("div"); 
		trackerBar.className = "keimateItemTracker";
		document.querySelector("body.jssdk").appendChild(trackerBar);
		return;
	} */
	if(window.location.href.indexOf("http://game.granbluefantasy.jp/#raid_multi/") > -1 || window.location.href.indexOf("http://game.granbluefantasy.jp/#raid/") >-1){
		if (document.querySelectorAll('[ability-id]').length >0  && document.querySelectorAll("div.prt-gauge-area")[0].childNodes.length > 0) {				
			
			document.querySelectorAll('[ability-id]').forEach(function(val,index){
				observer.observe(val, { attributes: true, childList: true, characterData: true });
			}); 
			document.querySelectorAll("[id^=enemy-hp]").forEach(function(val,index){
				observer.observe(val, { attributes: true, childList: true, characterData: true });
			});
 			
			document.querySelectorAll("a").forEach(function(val,index){
				if(val.className.includes("enemy")){
					val.style.cssText="display: inline-block;cursor:pointer;"
				}
			});
			
			
			
			try{
				showSkillCD();				
				showBossHP();
				return;
			}catch(e){if (e instanceof ReferenceError){};}				
		}	
	}else if(window.location.href === "http://game.granbluefantasy.jp/#item" && document.querySelectorAll("div.lis-item.se").length >0){
		//loadTracker("Supply");
		return;
	}
	/* else if (window.location.href.indexOf("http://game.granbluefantasy.jp/#casino/game/poker/") > -1){
		if(!isNullOrUndefined(document.querySelector("div.ico-high"))){
			var Deck = [];
			for(i=1;i<5;i++){
				for(j=1; j<14;j++){					
				var w = j < 8? 0 : 1;}
					if(j==1){
						w = 1;
					}
					Deck.push(new Card(i,w,j));
				}
			}
			document.querySelectorAll("div.prt-double-select").forEach(function(val,index){
				observer.observe(val, { attributes: true, childList: true, characterData: true });
			});
			
			return;
		}
	} */
	/* else if(document.querySelectorAll('img.img-job-icon').length >0){
		var jobs = [{ id:100001, name: "Fighter"}, { id:100101, name: "Warrior"}, { id:100201, name: "Weapon Master"}, { id:100301, name: "Berserker"}, { id:200201, name: "Alchemist"}, 			{ id:200301, name: "Doctor"}, 
					{ id:110001, name: "Knight"}, { id:110101, name: "Sentinel"}, { id:110201, name: "Holy Saber"}, { id:110301, name: "Spartan"}, { id:210201, name: "Ninja"}, { id:210301, name: "Runeslayer"}, 
					{ id:120001, name: "Priest"}, { id:120101, name: "Cleric"}, { id:120201, name: "Bishop"}, { id:120301, name: "Safe"}, { id:220201, name: "Samurai"}, { id:220301, name: "Kengo"}, 
					{ id:130001, name: "Wizard"}, { id:130101, name: "Sorcerer"}, { id:130201, name: "Hermit"}, { id:130301, name: "Warlock"}, { id:230201, name: "Sword Master"}, { id:230301, name: "Glorybringer"}, 
					{ id:140001, name: "Thief"}, { id:140101, name: "Raider"}, { id:140201, name: "Hawkeye"}, { id:140301, name: "Bandit Tycoon"}, { id:240201, name: "Gunslinger"}, { id:240301, name: "Soldier"},
					{ id:150001, name: "Enhancer"}, { id:150101, name: "Arcana Dueler"}, { id:150201, name: "Dark Fencer"}, { id:150301, name: "Chaos Ruler"}, { id:250201, name: "Mystic"}, { id:250301, name: "Nekomancer"}, 
					{ id:160001, name: "Grappler"}, { id:160101, name: "Kung Fu Artist"}, { id:160201, name: "Ogre"}, { id:160301, name: "Luchador"}, { id:260201, name: "Assassin"}, { id:260301, name: ""}, 
					{ id:170001, name: "Ranger"}, { id:170101, name: "Archer"}, { id:170201, name: "Sidewinder"}, { id:170301, name: "Nighthound"}, { id:270201, name: "Drum Master"}, { id:270301, name: ""}, 
					{ id:180001, name: "Harpist"}, { id:180101, name: "Bard"}, { id:180201, name: "Superstar"}, { id:180301, name: "Elysian"}, { id:280201, name: "Dancer"}, { id:280301, name: ""}, 
					{ id:190001, name: "Lancer"}, { id:190101, name: "Dragoon"}, { id:190201, name: "Valkyrie"}, { id:190301, name: "Apsaras"}, { id:290201, name: "Mechanic"}, { id:290301, name: ""},
					{ id:300201, name: "Gladiator"}, { id:300301, name:"Chrysaor"}];
		document.querySelectorAll("img.img-job-icon").forEach(function(jobIcon, i)){			
			jobs.filter(obj => {return jobIcon.src.includes(obj.id);}).length >0? "a":"b";		
		}
	} */	
	window.requestAnimationFrame(ready);
};
window.requestAnimationFrame(ready);

class Card{
	constructor(i, w, v){
		this.type = i;
		this.weight = w;
		this.val = v;
	}	
	type(){
		return this.type;
	}
	weight(){
		return this.weight;
	}
	val(){
		return this.val;
	}	
	toString(){
		return "Type: "+ this.type + " Weight: " + this.weight + " Value: " + this.val;
	}
}

function cardType (c){
	return c == 1? "Spades" : 
	c ==2? "Clubs":
	c ==3? "Hearts":
	c ==4? "Diamond" : "Lolno";
}
function isRoyal (i){
	return i == 1? "Ace":
	i == 11? "Jack":
	i == 12? "Queen":
	i == 13? "King" : "Lolno";
}
function rates(d, i){
	var high = 0;
	var low = 0;
	d.forEach(function(a,i) {
		if(a.weight==0){
			low++;
		}else{
			high++;
		}
	});
	return i==0? (low/(low+high))*100: (high/(low+high))*100;
}
    

window.onblur = function() {
	forciblyMuted = false;
	newList.play();
	globalList.takeAll(newList);
	globalList.play();
};

class AudioList {
	constructor(webAudioPlayFunc, webAudioPauseFunc,
				audioElPlayFunc, audioElPauseFunc) {
		this._webAudioContexts = [];
		this._audioElements = [];

		this._webAudioPlayFunc = webAudioPlayFunc;
		this._webAudioPauseFunc = webAudioPauseFunc;
		this._audioElPlayFunc = audioElPlayFunc;
		this._audioElPauseFunc = audioElPauseFunc;
	}
	addWebAudioContext(ctx) {
		this._webAudioContexts.push(ctx);
	}
	addAudioElement(el) {
		this._audioElements.push(el);
	}
	takeAll(other) {
		this._webAudioContexts = this._webAudioContexts.concat(other._webAudioContexts);
		this._audioElements = this._audioElements.concat(other._audioElements);
		other._webAudioContexts = [];
		other._audioElements = [];
	}

	length() {
		return this._webAudioContexts.length + this._audioElements.length;
	}

	_runOnAll(webAudioFunc, audioElFunc) {
		this._webAudioContexts.forEach(el => {
			webAudioFunc.call(el);
		});
		this._audioElements.forEach(el => {
			audioElFunc.call(el);
		});
	}

	play() {
		this._runOnAll(this._webAudioPlayFunc, this._audioElPlayFunc);
	}

	pause() {
		this._runOnAll(this._webAudioPauseFunc, this._audioElPauseFunc);
	}
}

// Interpose on Audio elements and WebAudio contexts.
const realPlay = window.Audio.prototype.play;
const realPause = window.Audio.prototype.pause;
const realSuspend = window.AudioContext.prototype.suspend;
const realResume = window.AudioContext.prototype.resume;

let globalList = new AudioList(realResume, realSuspend, realPlay, realPause);
let newList = new AudioList(realResume, realSuspend, realPlay, realPause);
let forciblyMuted = false;
window.Audio.prototype.play = function() {
	if (forciblyMuted) {
		return Promise.reject(new DOMException('Audio forcibly muted by unmute extension'));
	}

	return realPlay.call(this).catch(err => {
		// play() raised an exception. Raise the badge and then propagate it.
		throw err;
	});
};

window.Audio = new Proxy(window.Audio, {
	construct(target, args) {
		const result = new target(...args);
		newList.addAudioElement(result);
		return result;
	}
});

const origCreateElement = window.document.createElement;
window.document.createElement = function(type) {
	if (type != 'audio') {
		return origCreateElement.call(this, type);
	}
	// Intercept creation of Audio element so that the proxy
	// above gets created instead.
	return new Audio();
};

window.AudioContext.prototype.resume = function() {
	if (forciblyMuted) {
		console.log('AudioContexts forcibly muted by unmute extension');
		return Promise.resolve();
	}
	return realResume.call(this);
};

window.AudioContext = new Proxy(window.AudioContext, {
	construct(target, args) {
		const result = new target(...args);
		newList.addWebAudioContext(result);
		if (result.state !== 'running') {
		}
		return result;
	}
});
/* self.AudioContext = new Proxy(self.AudioContext, {
	construct(target, args) {
	  const result =  new target(...args);
	  list.push(result);
	  result.resume();
	  return result;
	}   
});	 */

/* document.addEventListener('click', function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
        text = target.textContent || target.innerText; 
	
	if(target.className.startsWith("keimate") &&	
	!isNullOrUndefined(target.parentElement.hasAttribute("data-index")) && target.parentElement.hasAttribute("data-index")){			trackItem(target);
		loadTracker("Update");
		
	}
}, false);
var yeet = localStorage.getItem("itemTrackingList") === null? [] : JSON.parse(localStorage.getItem("itemTrackingList"));
function trackItem(target){
	var item = {
		dataIndex: target.parentElement.getAttribute("data-index"),
		dataItemType: target.parentElement.getAttribute("data-item-type")
	}		
	var result = yeet.filter(obj => {
		return obj.dataIndex === item.dataIndex;
	});
	if(result.length<1){
		yeet.push(item);
	}else if (result.length>0){		
		yeet = yeet.filter(obj => !result.includes(obj));
	}		
	localStorage.setItem("itemTrackingList", JSON.stringify(yeet));			
	delete yeet,item,result;
}
 */

/* 
Game.view.allTreasureItemList (supplies)

articles => supplies
normal => ap/ep items
evolution => uncapping/level up items (not grails)
npcaugment => rings
recycling => grails
skillplus => 

http://game-a.granbluefantasy.jp/assets_en/img/sp/assets/item/article/s/14.jpg
http://game-a.granbluefantasy.jp/assets_en/img/sp/assets/item/normal/s/1.jpg
http://game-a.granbluefantasy.jp/assets_en/img/sp/assets/item/evolution/s/20002.jpg
http://game-a.granbluefantasy.jp/assets_en/img/sp/assets/item/npcaugment/s/1.jpg
http://game-a.granbluefantasy.jp/assets_en/img/sp/assets/item/recycling/s/2.jpg
http://game-a.granbluefantasy.jp/assets_en/img/sp/assets/item/skillplus/s/11003.jpg

Game.view.filterModeItemModel (consumables)
	J.c attributes:{
	0: {AP/EP Regen items}
	1: {Items for Upgrading/Uncapping}
	   0:{Weapon Uncaps (Steel Bricks -> Damas)}
	   1:{Summon Uncaps (Bright stones -> Sunstones)}
	   2:{Character Uncaps (R & SR Uncaps)}
	   3:{ROTB Weapon skill upgrade items}
	   4:{Upgrade weapon level items (Not grail), chocos,etc)}
	   5:{Upgrade summon level items (Not grail), chocos,etc)}
	   6:{Upgrade character level items (Not grail), chocos,etc)}
	2: {Atma/Ultima/Opus Skill upgrading}
	3: {Character EMP Rings}
	4: {EXP Grails}
}
 */





