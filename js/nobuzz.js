var i, buttons = document.querySelectorAll('button');
var contentSettings = chrome.contentSettings || chrome.experimental.contentSettings;
var states = {
	"javascript": ["allow", "block"],
	"plugins": ["allow", "block"],
	"images": ["allow", "block"],
	"cookies": ["allow", "block", "session_only"],
	"popups": ["allow", "block"],
	"notifications": ["allow", "block", "ask"]
};
var options = {
	showNotifications: get_option('showNotifications'),
	autoRefresh: get_option('autoRefresh'),
	icons: get_option('icons')
};
console.log(options);

function createUI() {
	var name, list = document.createElement('ul'), listItem, button;
	list.classList.add('nobuzz');
	
	for (name in options.icons) {
		button = document.createElement('img');
		button.id = options.icons[name];
		button.src = '../images/' + options.icons[name] + '.png';
		getState(button);
		(function (button) {
			button.addEventListener('click', function (event) {
				setState(button, getNextState(button), event);
			}, false);
		}(button));

		listItem = document.createElement('li');
		listItem.appendChild(button);
		
		list.appendChild(listItem);
	}

	document.getElementById('nobuzz').appendChild(list);
}

function getNextState(button) {
	var optionStates = states[button.id];
	return optionStates[(optionStates.indexOf(button.className) + 1) % optionStates.length];
}

function updateUI(button, value, notification) {
	if ((options.showNotifications === 'yes') && notification) {
		webkitNotifications.createNotification('images/icon.png', 'Setting changed', button.id + ": " + value).show();
	}
	
	button.title = button.id + ": " + value + ", click to change";
	button.className = value;
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
		if (options.autoRefresh === 'always' || (event && event[options.autoRefresh + "Key"])) {
			chrome.tabs.reload();
		}
	});
};


createUI();