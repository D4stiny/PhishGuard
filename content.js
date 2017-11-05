$("head").append('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/qtip2/3.0.3/basic/jquery.qtip.css">');

var dom = {};
dom.query = jQuery.noConflict( true ); // hotmail had jquery already so I couldn't use the qtip plugin with the existing jquery, decided to use a different prefix

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function gmailContentReady() {
    var emailBody = dom.query(".h7");
    var linksInEmailBody = dom.query("a[href]", emailBody);
    var urlRegex = /[a-zA-Z0-9$\-_.+!*'(),]+\.[a-zA-Z1-9$\-_+!*'(),]+/;
    var blacklistRegex = /[<>'" ]/;

    dom.query.each(linksInEmailBody, function(index, value) {
        var contents = dom.query(value).html();
        var href = dom.query(value).attr("href");

        var color = dom.query(value).css('color');

        if(typeof color != "undefined" && color == "rgb(255, 0, 0)") {
            return;
        }

        contents = replaceAll(contents, "<wbr>", "");
        href = replaceAll(href, "<wbr>", "");

        var contentsRegex = urlRegex.exec(contents);
        var hrefRegex = urlRegex.exec(href);

        var contentsBlacklistRegex = blacklistRegex.exec(contents);

        if(contentsRegex === null || hrefRegex === null || (contentsBlacklistRegex !== null && contentsBlacklistRegex.length > 0) || contentsRegex.length < 1 || hrefRegex.length < 1)
            return;

        contentsRegex = contentsRegex[0];
        contentsRegex = replaceAll(contentsRegex, "www.", "");
        hrefRegex = hrefRegex[0];
        hrefRegex = replaceAll(hrefRegex, "www.", "");

        if(contentsRegex !== "" && hrefRegex !== "") {
            if(contentsRegex.toUpperCase() !== hrefRegex.toUpperCase()) {
                dom.query(value).css("font-weight","bold");
                dom.query(value).css('color', 'red');
                dom.query(value).qtip({
                    content: ('This link goes to ' + hrefRegex),
                    position: {
                        target: 'mouse', // Track the mouse as the positioning target
                        adjust: { x: 5, y: 5 } // Offset it slightly from under the mouse
                    }
                });
            }
        }
    });
}

function hotmailContentReady() {
    var emailBody = dom.query("._rp_k");
    var linksInEmailBody = dom.query("a[href]", emailBody);

    var urlRegex = /[a-zA-Z0-9$\-_.+!*'(),]+\.[a-zA-Z1-9$\-_+!*'(),]+/;
    var blacklistRegex = /[<>'" ]/;

    dom.query.each(linksInEmailBody, function(index, value) {
        var contents = dom.query(value).html();
        var href = dom.query(value).attr("href");

        var color = dom.query(value).css('color');

        if(typeof color != "undefined" && color == "rgb(255, 0, 0)") {
            return;
        }

        contents = replaceAll(contents, "<wbr>", "");
        href = replaceAll(href, "<wbr>", "");

        var contentsRegex = urlRegex.exec(contents);
        var hrefRegex = urlRegex.exec(href);

        var contentsBlacklistRegex = blacklistRegex.exec(contents);

        if(contentsRegex === null || hrefRegex === null || (contentsBlacklistRegex !== null && contentsBlacklistRegex.length > 0) || contentsRegex.length < 1 || hrefRegex.length < 1)
            return;

        contentsRegex = contentsRegex[0];
        contentsRegex = replaceAll(contentsRegex, "www.", "");
        hrefRegex = hrefRegex[0];
        hrefRegex = replaceAll(hrefRegex, "www.", "");

        if(contentsRegex !== "" && hrefRegex !== "") {
          if(contentsRegex.toUpperCase() !== hrefRegex.toUpperCase()) {
                dom.query(value).css("font-weight","bold");
                dom.query(value).css('color', 'red');
                dom.query(value).qtip({
                    content: ('This link goes to ' + hrefRegex),
                    position: {
                        target: 'mouse', // Track the mouse as the positioning target
                        adjust: { x: 5, y: 5 } // Offset it slightly from under the mouse
                    }
                });
            }
        }
    });
}


var lastGmailTitle = "", lastHotmailLength = 0; // gmail somewhat preloads the body message, hotmail doesn't so title is fine for gmail but gotta use html length for hotmail
var lastGmailLengthADP = 0, lastGmailLengthH7 = 0;

function gmailInterval() {
    var titleElement = dom.query(".hP");
    var adp = dom.query(".adP");
    var h7 = dom.query(".h7");

    if((typeof titleElement != "undefined") && ((titleElement.html() !== lastGmailTitle) || (lastGmailLengthADP != adp.length) || (lastGmailLengthH7 != h7.length))) {
        lastGmailTitle = titleElement.html();
        lastGmailLengthADP = adp.length;
        lastGmailLengthH7 = h7.length;

        gmailContentReady();
    }
}

function hotmailInterval() {
    var emailBody = dom.query("._rp_k");

    if((typeof emailBody != "undefined" && typeof emailBody.html() != "undefined") && (emailBody.html().length !== lastHotmailLength)) {
        lastHotmailLength = emailBody.html().length;
        hotmailContentReady();
    }
}

dom.query(document).ready(function() {
    var emailInterval = setInterval(function() {
        if(document.location.href.indexOf("mail.google.com") != -1) {
            gmailInterval();
        } else if(document.location.href.indexOf("live.com") != -1) {
            hotmailInterval();
        }
    }, 1000)});
