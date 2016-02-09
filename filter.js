var filters;
chrome.storage.sync.get('filters', function(result) {
    if (Object.keys(result).length > 0) { 
        filters = result.filters;
        main();
    } else {
        console.log("No filters set.");
    }
});
var target = document.querySelector('[id="content"]');
 
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.target.className === "section-list") {
        main();
    }
  });    
});
var config = { childList: true, subtree: true}; 
observer.observe(target, config);


function runFilter(filters, channel, title, li) {
    for (var condition in filters[channel]) {
        if (condition === "with") {
            var length = filters[channel][condition].length;
            for (var ii = 0; ii < length; ii++) {
                if (title.toLowerCase().indexOf(filters[channel][condition][ii].toLowerCase()) >= 0) {
                    li.className += " ysf-hidden ";
                }
            } 
        } else if (condition === "without") {
            var length = filters[channel][condition].length;
            for (var iii = 0; iii < length; iii++) {
                if (title.toLowerCase().indexOf(filters[channel][condition][iii].toLowerCase()) === -1) {
                    li.className += " ysf-hidden ";
                }
            }
        }
    }
}

function main() {
    //Checks whether or not the subscription feed is in grid or list layout.
    //Assigns the element holding the subscriptions.
    var gridCheck = document.querySelectorAll('[class*="yt-shelf-grid-item"]');
    if (gridCheck !== null && gridCheck.length > 0) {
        var subFeed = gridCheck;
    } else {
        var subContainer = document.querySelector('[id^="section-list"]')
        var subFeed = subContainer.children;
    }
    
    for (var i = 0; i < subFeed.length; i++) {
        var li = subFeed[i];
        var channelName = li.querySelector('[class*="yt-lockup-byline"] a').textContent;
        var channelUrl = li.querySelector('[class*="yt-lockup-byline"] a').href.split('/')[4];
        var title = li.querySelector('[class^="yt-lockup-title"] a').textContent;
        
        if (filters.hasOwnProperty(channelName)) {
            var channel = channelName;
        }
        else if (filters.hasOwnProperty(channelUrl)) {
            var channel = channelUrl;
        }
        runFilter(filters, channel, title, li);
    }
}
