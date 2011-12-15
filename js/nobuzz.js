var i, buttons = document.querySelectorAll('button');
var contentSettings = chrome.contentSettings || chrome.experimental.contentSettings;
var options = {
	showNotifications: "no", // yes, no
	autoRefresh: "shift", // yes, no, ctrl, alt, shift
	icons: [ // javascript, plugins, images, popups, notifications
		"javascript",
		"plugins",
		"images"
	]
};

function createUI() {
	var name, list = document.createElement('ul'), listItem, button, icon;
	list.classList.add('nobuzz');
	
	for (name in options.icons) {
		icon = document.createElement('img');
		icon.src = 'images/' + 'icon' /* options.icons[name] */ + '.png';
		
		button = document.createElement('button');
		button.type = 'button';
		button.id = options.icons[name];
		getState(button);
		(function (button) {
			button.addEventListener('click', function (event) {
				setState(button, button.classList.contains('off') ? "allow" : "block", event);
			}, false);
		}(button));
		button.appendChild(icon);

		listItem = document.createElement('li');
		listItem.appendChild(button);
		
		list.appendChild(listItem);
	}

	document.getElementById('nobuzz').appendChild(list);
}

function updateUI(button, value, notification) {
	if ((options.showNotifications === 'yes') && notification) {
		webkitNotifications.createNotification('images/icon.png', 'Setting changed', button.id + ": " + value).show();
	}
	
	button.title = button.id + ": " + value + ", click to change";
	if (value === 'block') {
		button.classList.add('off');
	}
	else {
		button.classList.remove('off');
	}
}

function getState(button, notification) {
	contentSettings[button.id].get({
		primaryUrl: "http://*"
	}, function (details) {
		updateUI(button, details.setting, notification);
	});
};

function setState(button, value, event) {
	updateUI(button, value, false);
	contentSettings[button.id].set({
		primaryPattern: "<all_urls>",
		setting: value
	}, function () {
		getState(button, true);
		console.log(event);
		if (options.autoRefresh === 'yes' || (event && event[options.autoRefresh + "Key"])) {
			chrome.tabs.reload();
		}
	});
};


createUI();