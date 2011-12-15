TODO:
- icons
- settings page
	- showNotifications
	- show: JavaScript/Plugins/Images/Popups/Notifications
	- autoRefreshPage (no, yes, shift, ctrl/cmd, alt)
- more states where possible (no, yes, ask)

NOTE
================================================================
Extension works only if the Chrome is started with --enable-experiment-extension-apis option

0.2
- js moved to external file
- buttons are created dynamicly
- page is refreshed after setting change

0.2.1
- removed code for Chrome 15 (chrome.tabs.reload is now working)
- minor code changes
- refresh page only when shift/ctrl/alt was pressed