//start connection in content script
/* let contentPort = chrome.runtime.connect({
   name: 'background-content'
}); */

//Append your pageScript.js to "real" webpage. So will it can full access to webpate.
var s = document.createElement('script');
s.src = chrome.extension.getURL('js/keimate/keimate-minified.js');
(document.head || document.documentElement).appendChild(s);
//Our pageScript.js only add listener to window object, 
//so we don't need it after it finish its job. But depend your case, 
//you may want to keep it.
//s.parentNode.removeChild(s);