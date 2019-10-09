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
var simulateClick = function(elem) {
  try {
    var rect = elem.getBoundingClientRect(),
      topEnter = rect.top,
      leftEnter = rect.left, // coordinates of elements topLeft corner
      topMid = random(rect.bottom, rect.top), 
      leftMid = random(rect.right, rect.left),  // coordinates of elements center
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
    window.setTimeout(function() {
      elem.dispatchEvent(mdown)
    }, ddelay);
    // trigger mouseup and click with a bit longer delay
    // to simulate time between pressing/releasing the button
    window.setTimeout(function() {
      elem.dispatchEvent(mup);
      elem.dispatchEvent(mclick);
    }, ddelay * random(.99, 1.2)); //default 1.2x
  } catch (e) {
    return;
  }
}

/**Keyboard Events**/

function keyboardCombat(chara, skill) {

}

function pCA() {
  var c = document.querySelector('div.btn-lock.lock1');
  var c1 = document.querySelector('div.btn-lock.lock0'); //no auto
  !isNullOrUndefined(c) ? simulateClick(c) : null;
  !isNullOrUndefined(c1) ? simulateClick(c1) : null;
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
  var queue = [];
  buttons.forEach(function(value, i) {
    var a = document.querySelector(value);
    if (!isNullOrUndefined(a)) {
      if (i === 0) {
        queue.unshift(value); ////okbutton takes no.1 priority
      } else {
        queue.push(value);
      }
    }
  });
  if (queue.length > 0) {
    //prioritize ok btn in queue
    if (queue[0] === buttons[0] && !isNullOrUndefined(document.querySelector(queue[0]))) {
      elem = document.querySelector(queue[0]).className.includes("btn-usual-ok") ?
        document.querySelector(queue[0]) : document.querySelectorAll(queue[0])[1];
      console.log(elem);
      console.log(document.querySelector(queue[0]));
    } else {
      queue.forEach(function(value, i) {
        if (!isNullOrUndefined(document.querySelector(value))) {
          elem = document.querySelector(value);
        } else if (value === "div.btn-evolution.active") {
          elem = document.querySelector("#btn-evolution");
        }
      });
    }
  }
  //var ignore = ['div.btn-usual-ok.btn-summon-use', 'div.btn-usual-ok.btn-ability-use', 'div.onm-anim-mask']
  if (!isNullOrUndefined(elem)) {
    isNullOrUndefined(document.querySelector('div.onm-anim-mask')) ? simulateClick(elem) :
      getComputedStyle(document.querySelector('div.onm-anim-mask')).getPropertyValue('display') === "none" ? simulateClick(elem) :
      simulateClick(document.querySelector('div.onm-anim-mask'));
  }

}
/**Show Skill Cooldowns**/
function showSkillCD() {
  //all charater skill nodes
  var charaSkillDetails = document.querySelectorAll('[ability-id]');
  var cdCharaSkills = []; //sorted into chara[index], skills
  for (i = 0; i <= 3; i++) { //sorting
    var currentChara = {
      skills: []
    }
    charaSkillDetails.forEach(function(value, index) {
      if (value.outerHTML === document.querySelector("div.btn-usual-ok.btn-ability-use").outerHTML) {} else if ((value.outerHTML.includes("ability-character-num-" + (i + 1)) === true)) {
        if (!isNullOrUndefined(value.getAttribute("ability-recast"))) {
          currentChara.skills.push(value.getAttribute("ability-recast"));
        }
      }
    });
    cdCharaSkills.push(currentChara);
  }
  var cdSkillMini = [];
  document.querySelectorAll('div.prt-ability-state').forEach(function(value, index) {
    if (index <= 3) {
      cdSkillMini.push(value);
    }
  });
  //looping each character, and its skills, to set its skill timer
  cdSkillMini.forEach(function(value, index) {
    //for each skill box index = character #
    var skCount = 0;
    document.querySelectorAll('div.prt-ability-state')[index].childNodes.forEach(function(childVal, childIndex) {
      //childIndex = skill#
      if ((childIndex % 2) === 1) {
        var coolDown = cdCharaSkills[index].skills[skCount];
        if (!isNullOrUndefined(coolDown)) {
          if (coolDown === '0') {
            coolDown = "";
          }
          childVal.innerHTML = '<p style="position: relative;color:black;font-weight:bold;font-size: 6px;text-align: center;top: -4px;text-shadow: 0 0 10px #ffffff, 0 0 10px #ffffff;">' + coolDown + '</p>';
        }
        skCount++;
      }
    });
  });
}
/**Show Enemy HP**/
function showBossHP() {
  try {
    var a = stage.pJsnData.boss;
    var enemyId = -1;
    document.querySelectorAll("div.prt-gauge-area")[0].childNodes.forEach(function(enemy, eIndex) {
      if (!isNullOrUndefined(enemy.className) && enemy.classList.contains("prt-enemy-percent")) {
        enemyId++;
        var newStr = numberWithCommas(numberFormat(a.param[enemyId].hp, 1) + " / " + numberFormat(a.param[enemyId].hpmax), 1);
        var accPercHP = ((a.param[enemyId].hp / a.param[enemyId].hpmax) * 100).toFixed(1);
        var stillAlive = a.number;
        a.param.forEach(function(e, i) {
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
var sSkill = [];
//Keypress handler
document.addEventListener('keydown', function(e) {
  if (e.which === 32) {
    var typing = false;
    document.querySelectorAll("textarea").forEach(function(val, i) {
      if (isNullOrUndefined(val.getAttribute("disabled"))) {
        typing == true;
      }
    })
    if (typing) {
      return true;
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
  }
  if (e.keyCode === 32) {
    pSpaceBar(e);
  }
  if (e.keyCode === 67) {
    pCA();
  }
  //qwer -> 113,119,101,114
  //QWER -> 81, 87, 69, 82
  var combat = [81, 87, 69, 82];
  var combat2 = [49, 50, 51, 52];
  if (combat2.includes(e.keyCode)) {
    var index = combat2.indexOf(e.keyCode);
    if (window.location.href.indexOf("http://game.granbluefantasy.jp/#raid_multi/") > -1 || window.location.href.indexOf("http://game.granbluefantasy.jp/#raid/") > -1) {
      simulateClick(document.querySelectorAll("div.lis-character" + index + ".btn-command-character")[0]);
      sSkill = [];
      // document.querySelectorAll("div.prt-ability-list")[0].childNodes[1].className.includes("btn-ability-available")
      document.querySelectorAll("div.prt-ability-list")[index].childNodes.forEach(function(val, i) {
        if (!isNullOrUndefined(val.className) && val.className.includes("btn-ability-available")) {
          if (parseInt(val.parentNode.parentNode.getAttribute("pos")) === (index + 1)) {
            sSkill.push(val);
          }
        }
      });
    }
  }
  if (combat.includes(e.keyCode)) {
    if (window.location.href.indexOf("http://game.granbluefantasy.jp/#raid_multi/") > -1 || window.location.href.indexOf("http://game.granbluefantasy.jp/#raid/") > -1) {
      var index = combat.indexOf(e.keyCode);
      simulateClick(sSkill[index]);
    }
  }
  //R
  if (e.keyCode === 82) {
    pResetBonus();
  }
  //ESC
  if (e.key === "Escape" || e.key === "Esc") {
    var backButton = document.querySelectorAll("div.btn-command-back");
    if (backButton.length > 0 && !isNullOrUndefined(backButton[0])) {
      simulateClick(backButton[0]);
    }
  }
});

// The DOM node to observe
// create an observer instance
var observer = new MutationObserver(function(mutations) {
  try {
    showSkillCD();
    showBossHP();
  } catch (e) {
    if (e instanceof ReferenceError) {};
  }
});
// configuration of the observer:
var config = {
  attributes: true,
  childList: true,
  characterData: true
}; //subtree:true

//DOMContentLoaded - Work around for showSkillCD not executing under listener on DOMContentLoaded
var ready = function() {
  /* if(document.querySelectorAll("body.jssdk").length>0){
  	var trackerBar = document.createElement("div");
  	trackerBar.className = "keimateItemTracker";
  	document.querySelector("body.jssdk").appendChild(trackerBar);
  	return;
  } */
  if (window.location.href.indexOf("http://game.granbluefantasy.jp/#raid_multi/") > -1 || window.location.href.indexOf("http://game.granbluefantasy.jp/#raid/") > -1) {
    if (document.querySelectorAll('[ability-id]').length > 0 && document.querySelectorAll("div.prt-gauge-area")[0].childNodes.length > 0) {

      document.querySelectorAll('[ability-id]').forEach(function(val, index) {
        observer.observe(val, {
          attributes: true,
          childList: true,
          characterData: true
        });
      });
      document.querySelectorAll("[id^=enemy-hp]").forEach(function(val, index) {
        observer.observe(val, {
          attributes: true,
          childList: true,
          characterData: true
        });
      });

      document.querySelectorAll("a").forEach(function(val, index) {
        if (val.className.includes("enemy")) {
          val.style.cssText = "display: inline-block;cursor:pointer;";
        }
      });



      try {
        showSkillCD();
        showBossHP();
        return;
      } catch (e) {
        if (e instanceof ReferenceError) {};
      }
    }
  } else if (window.location.href === "http://game.granbluefantasy.jp/#item" && document.querySelectorAll("div.lis-item.se").length > 0) {
    //loadTracker("Supply");
    return;
  }
  window.requestAnimationFrame(ready);
};
window.requestAnimationFrame(ready);
