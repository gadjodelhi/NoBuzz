/*jslint browser: false, sloppy: false, white: false, maxerr: 50, indent: 4 */

(function (window) {
	"use strict";

	var i,
	    inputs,
	    document = window.document,
		localStorage = window.localStorage,
		get_option;

	get_option = window.get_option = function (option) {
		var value;
		try {
			value = JSON.parse(localStorage.NoBuzz)[option];
		} catch (e) {
		}

		if (option === 'showNotifications') {
			return value === 'yes' ? 'yes' : 'no';
		}
		if (option === 'autoRefresh') {
			return ({'always': true, 'shift': true, 'alt': true, 'ctrl': true}[value]) ? value : 'never';
		}
		if (option === 'icons') {
			if (!value || value.constructor !== Array) {
				return ["javascript", "plugins", "images", "cookies", "popups", "notifications"];
			}
			return value;
		}
	};

	// Saves options to localStorage.
	function save_options() {
		var options = {
			showNotifications: null,
			autoRefresh: null,
			icons: []
		}, i, icons = document.querySelectorAll('input[id^=icons-]');

		options.showNotifications = document.getElementById('showNotifications').checked ? 'yes' : 'no';

		options.autoRefresh = document.getElementById('autoRefresh').options[document.getElementById('autoRefresh').selectedIndex].value;

		for (i = 0; i < icons.length; i  = i + 1) {
			if (icons[i].checked) {
				options.icons.push(icons[i].getAttribute('id').replace(/icons-/, ''));
			}
		}

		localStorage.NoBuzz = JSON.stringify(options);
	}

	// Restores select box state to saved value from localStorage.
	function restore_options() {
		var i,
			refreshSelect = document.getElementById('autoRefresh'),
			iconsOptions = get_option('icons'),
			icons = document.querySelectorAll('input[id^=icons-]');

		document.getElementById('showNotifications').checked = get_option('showNotifications') === 'yes';

		for (i = 0; i < refreshSelect.options.length; i = i + 1) {
			if (get_option('autoRefresh') === refreshSelect.options[i].value) {
				refreshSelect.selectedIndex = i;
				break;
			}
		}

		for (i = 0; i < icons.length; i = i + 1) {
			icons[i].checked = false;
		}
		for (i = 0; i < iconsOptions.length; i = i + 1) {
			document.querySelector('[name=icons-' + iconsOptions[i] + ']').checked = true;
		}
	}

	if (document.querySelectorAll('form#options').length) {
		restore_options();
		inputs = document.querySelectorAll('input, select');
		for (i = 0; i < inputs.length; i = i + 1) {
			inputs[i].addEventListener('click', save_options, false);
			inputs[i].addEventListener('change', save_options, false);
		}
	}
}(this));
