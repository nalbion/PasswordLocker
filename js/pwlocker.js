pwlocker = {};

function $(id) {
	return document.getElementById(id);
}

pwlocker.supports_html5_storage = function() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
};

pwlocker.loadFromStorage = function() {
	var tableBody = $('site_hints').tBodies[0],
		siteNames = localStorage['sites'];
	
	if( siteNames != null ) {
		siteNames = siteNames.split(',');
		
		for( var i = 0; i < siteNames.length; i++ ) {
			var site = siteNames[i],
				img = localStorage['sites.' + site + '.img'],
				hint = localStorage['sites.' + site + '.hint'],
				row = document.createElement('tr');
			
			tableBody.appendChild( row );
			pwlocker.writeSiteAndHintToRow( row, site, img, hint );
		}
	}
};

pwlocker.writeSiteAndHintToRow = function( rowEl, site, img, hint ) {
	var str = '<td><img src="' + img + '"/><td>' + site + '</td><td>' + hint + '</td>';
	rowEl.innerHTML = str;
};

pwlocker.showAddSite = function() {
	var row = $('add_site');
	if( row == null ) {
		var tableBody = $('site_hints').tBodies[0];
		row = document.createElement('tr');
		row.id = 'add_site';
		tableBody.appendChild( row );
	}
	pwlocker.showSiteList( row );
};

pwlocker.showSiteList = function( rowEl ) {
	if( pwlocker.siteList == null ) {
		pwlocker.siteList = document.createElement('div');

		var sites = [ ['Apple', 'http://www.apple.com/favicon.ico'],
		              ['Google', 'http://www.google.com/favicon.ico'],
		              ['Hotmail', 'http://hotmail.com/favicon.ico'],
		              ['Yahoo!', 'http://au.yahoo.com/favicon.ico'],
		              ['Facebook', 'http://facebook.com/favicon.ico'],
		              ['Home PC', 'images/house.png'],
		              ['Laptop', 'images/laptop.png'],
		              ['Work PC', 'images/computer.png'],
		              ['Work Network', 'images/network.png'] ],
		    str = '<ul id="choose_site">';
		
		for( var i = 0; i < sites.length; i++ ) {
			var site = sites[i][0],
				img = sites[i][1];
			str += '<li><label><input type="radio" name="site" value="' + site + '"/><img src="' + img + '"/>' + site + '</label></li>';
		}
		str += '</ul><ul>' + 
				'<li><button id="show_site_list" style="display:none;">Show sites</button></li>' + 
				'<li><label><input class="other" type="radio" name="site" value="other"/><img src="images/user_add.png"/>other</label></li>' + 
				'</ul>';
		str += '<input type="text" name="other_name" id="other_name" style="display:none;" placeholder="Site/computer name"/>';
		str += '<div id="choose_img" style="display:none;"><h2>Icon</h2><ul></ul></div>';
		
		pwlocker.siteList.innerHTML = str;
		var inputs = pwlocker.siteList.getElementsByTagName('input');
		for( var i = 0; i < inputs.length; i++ ) {
			inputs[i].onchange = function() {
				if( this.name != 'site' ) return;
				if( this.value == 'other' ) {
					// Hide the main list of sites - we'll show an <input> for site name, and a list of icons to choose from
					$('choose_site').style.display = 'none';
					$('other_name').style.display = 'block';
					pwlocker.showIconList(true);
					
					var show_site_list = $('show_site_list');
					show_site_list.style.display = 'block';
					if( show_site_list.onclick == null ) {
						show_site_list.onclick = function(e) {
							// Show the main site list and hide the "Show sites" button that was just clicked
							e.preventDefault();
							$('choose_site').style.display = 'block';
							this.style.display = 'none';
							$('other_name').style.display = 'none';
							pwlocker.showIconList(false);
						};
					}
				}
			}
		};
	}
	
	if( rowEl.cells.length == 0 ) {
		rowEl.appendChild( document.createElement('td') );
		var siteCell = document.createElement('td');
		siteCell.appendChild( pwlocker.siteList );
		rowEl.appendChild( siteCell );
		var hintCell = document.createElement('td');
		hintCell.innerHTML = '<input type="text" name="hint" placeholder="A hint to remind yourself of the password"/>';
		rowEl.appendChild( hintCell );
		var btnCell = document.createElement('td'),
			saveBtn = document.createElement('button');
		saveBtn.className = 'save btn';
		saveBtn.textContent = 'Save';
		//btnCell.innerHTML = '<button class="save btn">Save</button>';
		btnCell.appendChild(saveBtn);
		saveBtn.onclick = function(e) {
			e.preventDefault();
			var form = $('site_form'),
				site = form['site'],
				icon = null;
			
			// site is currently an array of checkboxes - find the selected one.
			for( var i = 0; i < site.length; i++ ) {
				if( site[i].checked ) {
					site = site[i];
					break;
				}
			}
			if( site.value == undefined ) return;
			if( site.value == 'other' ) {
				site = $('other_name').value;
				icon = form['icon'];
				for( var i = 0; i < icon.length; i++ ) {
					if( icon[i].checked ) {
						icon = icon[i];
						break;
					}
				}
				if( icon.value == 'other' ) {
					icon = form['other_icon'].value;
				} else {
					icon = icon.value;
				}
			} else {
				icon = site.parentNode.getElementsByTagName('img')[0].getAttribute('src');
				site = site.value;
			}
			
			// Ensure that the site name is in the sites list
			var hint = form['hint'].value,
				sites = localStorage['sites'];
			if( sites == null ) {
				sites = site;
			} else if( sites.match('\\b' + site + '\\b') == null ) {
				sites += ',' + site;
			}
			localStorage['sites'] = sites;
			localStorage['sites.' + site + '.img'] = icon;
			localStorage['sites.' + site + '.hint'] = hint;
			pwlocker.writeSiteAndHintToRow(rowEl, site, icon, hint);
		};
		rowEl.appendChild( btnCell );
	}
	
	
//	rowEl.appendChild( pwlocker.siteList );
};

pwlocker.showIconList = function( show ) {
	var chooseImg = $('choose_img');
	if( show ) {
		var iconList = chooseImg.getElementsByTagName('ul')[0];
		if( iconList.innerHTML == '' ) {
			var icons = ['computer', 'house', 'building', 'key', 'lock', 'network', 'server'],
		    str = '';
		
			for( var i = 0; i < icons.length; i++ ) {
				var icon = icons[i];
				str += '<li><label><input type="radio" name="icon" value="images/' + icon + '.png"/><img src="images/' + icon + '.png"/>' + icon + '</label></li>';
			}
			str += '<li><label><input type="radio" name="icon" value="other"/>other</label><br/>' + 
					'<input type="text" id="other_icon" name="other_icon" placeholder="eg: http://url.of/favicon.ico"></li>';
			iconList.innerHTML = str;
		}
		chooseImg.style.display = 'block';
	} else {
		chooseImg.style.display = 'none';
	}
};



function onload() {
	if( pwlocker.supports_html5_storage() ) {
		pwlocker.loadFromStorage();
		pwlocker.showAddSite();
		
//		pwlocker.showIconList();
	}
}
	


