// Background.js

// will be used as "if condition is true, perform action"
var pageConditions = {
    conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
            schemes: ["https", "http"]  // defines what URLs we want to use this app for
                                        // in this case we defined really generally
                                        // can also do urlContains: ["wikipedia"] or something
        }
    })],
    actions: [new chrome.declarativeContent.ShowPageAction()]
};

// these are callback functions for asynchronous programming
//      "when this is done, do this"
// onInstalled checks everytime chrome is updated or installed
chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([pageConditions]);
    });
});

// there's also chrome.storage.sync --> look into it

// web API like .net
// look up web API boilerplate to creat RESTful APIs
// create rest API on web app
// post API from the chrome extension to send the info to the web app
// 