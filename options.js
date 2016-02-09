var save = $('#save');
var channels = $('[name^="channel"]');
var conditions = $('[name^="condition"]');
var keywords = $('[name^="keywords"]');
var addBtn = $('#add');
var numFilters;
var filters;

chrome.storage.sync.get('filters', function(result) {
    console.log(result);
    if (Object.keys(result).length > 0) {
        console.log("Filters loaded");
        filters = result['filters'];
    } else if (Object.keys(result).length === 0) {
        console.log("Filters not loaded");
        filters = {};
    }
    main();
});

function main() {
    console.log("Main start");
    
    if (Object.keys(filters).length > 0) {
        printInput(filters);
    }
    
    save.click(function() {
        console.log(channels);
        console.log(filters);
        filters = {};
        console.log(filters);
        channels = $('[name^="channel"]');
        conditions = $('[name^="condition"]');
        keywords = $('[name^="keywords"]');
        for (var i = 0; i < numFilters; i++) {
            var channelName = channels[i].value.trim();
            var condition = conditions[i].value.trim();
            var keyword = keywords[i].value.trim();
            if (channelName.length > 0 &&
               condition.length > 0 &&
               keyword.length > 0) {
                   if (!filters.hasOwnProperty(channelName)) {
                    filters[channelName] = {};
                    } 
                    if (!filters[channelName].hasOwnProperty(condition)) {
                        filters[channelName][condition] = [];
                    }
                    console.log(filters[channelName][condition].indexOf(keyword));
                    if (filters[channelName][condition].indexOf(keyword) == -1) {
                        filters[channelName][condition].push(keyword);
                    }
            } else {
                console.log("At least one field was empty.");
            }
        }
        chrome.storage.sync.remove('filters', function() {
            chrome.storage.sync.set({'filters' : filters}, function() {
                console.log("Saving complete");
                printInput(filters);
            });
        });
    });

    addBtn.click(function() {
        printNewInput();
    });
    
    function printNewInput() {
        var inputHtml = "<p> Remove videos from <input type='text' name='channel-" + numFilters + "' placeholder='channel name'> <select name='condition-" + numFilters + "'> <option>with</option><option>without</option></select> <input type='text' name='keywords-" + numFilters + "' placeholder='these words'> in the title.</p>";
       $("#filter-inputs").append(inputHtml);
        channels = $('[name^="channel"]');
        numFilters++;
    }

    function printInput(filters) {
        $("#filter-inputs").empty();
        numFilters = 0; 
        for (var channel in filters) {
            var channelInput = "<p> Remove videos from <input type='text' name='channel-" + numFilters + "' placeholder='channel name' value='" + channel + "'> ";
            for (var condition in filters[channel]) {
                var conditionInput = "<select name=condition-'" + numFilters + "'> ";
                switch (condition) {
                    case "with":
                        conditionInput += "<option selected='selected'>with</option><option>without</option></select> ";
                        break;
                    case "without":
                        conditionInput +=  "<option>with</option><option selected='selected'>without</option></select> ";
                        break;
                    default:
                        throw new Error("Condition does not match accepted value.");
                }
                var keywords = filters[channel][condition];
                for (var i = 0; i < keywords.length; i++) {
                    var keywordInput = "<input type='text' name='keywords-" + numFilters + "' placeholder='these words' value='" + keywords[i] + "'> in the title.</p>"
                    var newInput = channelInput + conditionInput + keywordInput;
                    $("#filter-inputs").append(newInput);
                    numFilters++;
                }
            }
        }
        printNewInput();
    }
}
