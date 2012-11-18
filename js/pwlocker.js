pwlocker = {};

pwlocker.supports_html5_storage = function() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
};

//pwlocker.initForTest = function() {
//	localStorage['sites'] = 'Yahoo!,Google';
//	localStorage['sites.Yahoo!.img'] = 'http://au.yahoo.com/favicon.ico';
//	localStorage['sites.Yahoo!.hint'] = 'hint 1';
//	localStorage['sites.Google.img'] = 'http://www.google.com/favicon.ico';
//	localStorage['sites.Google.hint'] = 'hint 2';
//};

pwlocker.loadFromStorage = function() {
	var tableBody = document.getElementsByTagName('table')[0].tBodies[0],
		siteNames = localStorage['sites'].split(',');
		str = '';
	
	for( var i = 0; i < siteNames.length; i++ ) {
		var site = siteNames[i],
			img = localStorage['sites.' + site + '.img'],
			hint = localStorage['sites.' + site + '.hint'];
		str += '<tr><td><img src="' + img + '"/><td>' + site + '</td><td>' + hint + '</td></tr>';
	}
	
	tableBody.innerHTML = str;
};


function onload() {
	if( pwlocker.supports_html5_storage() ) {
//		pwlocker.initForTest();
		pwlocker.loadFromStorage();
	}
}
	


