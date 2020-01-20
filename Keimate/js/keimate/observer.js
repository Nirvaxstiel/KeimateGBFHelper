var observer = new MutationObserver(function (mutations) {
	try {
		showSkillCD();
		showBossHP();
	}
	catch (e) {
		if (e instanceof ReferenceError) { }
		;
	}
});
var config = {
	attributes: true,
	childList: true,
	characterData: true
};
