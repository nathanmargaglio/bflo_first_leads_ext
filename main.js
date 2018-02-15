window.ypPosition = null;

var initLeads = function () {
    var url_base = "https://people.yellowpages.com/whitepages?";
    var pos = {};

    var header_cells = $('.singleLineTableHeader').children();

    for (var i = 0; i < header_cells.length; i++) {
        var cell = $(header_cells[i])[0];
        pos[cell.innerText] = i;
    }

    var rows = $('table.displayGrid > tbody > tr');

    for (var i = 0; i < rows.length; ++i) {
        var row = $(rows[i]);
        var street = $(row.children()[pos['Owner Street Num Street Name']])[0].innerText;
        var city = $(row.children()[pos['Owner City State']])[0].innerText;
        var zip = $(row.children()[pos['Owner Zip Code']])[0].innerText;
        var first = $(row.children()[pos['Owner 1 First Name']])[0].innerText;
        var last = $(row.children()[pos['Owner 1 Last Name']])[0].innerText;

        var data = {
            "first": first,
            "last": last,
            "zip": zip,
            "state": 'ny'
        };
        (function () {

            var yp_url = url_base + $.param(data);

            if (first && last) {
                var button = $(row.children()[pos['#']]);
                button.hover(function () {
                    $(this).css({
                        fontWeight: 'bold',
                        fontSize: '20px'
                    });
                }, function () {
                    $(this).css({
                        fontWeight: 'normal',
                        fontSize: '11px'
                    });
                });

                row.css({backgroundColor: 'rgba(0, 132, 0, 0.5)'});

                button.on('click', function (e) {
                    $(this).parent().css({backgroundColor: 'rgba(61, 107, 180, 0.5)'});
                    $('#yp_container').remove();
                    $('body').append(
                        '<div id="yp_container">' +
                        '<div id="yp_exit"></div>' +
                        '<iframe class="yp_iframe" src="' + yp_url + '" height="300" width="400"></iframe>' +
                        '</div>');
                    $('#yp_exit').css({
                        backgroundImage: "url(\"" + chrome.extension.getURL("exit.png") + "\")"
                    });

                    var left = $( window ).width() - 420;
                    var top = 10;
                    if (window.ypPosition) {
                        left = window.ypPosition.left;
                        top = window.ypPosition.top;
                    }
                    $('#yp_container').css({
                        backgroundImage: "url(\"" + chrome.extension.getURL("loading.svg") + "\")",
                        left: left + "px",
                        top: top + "px"
                    });
                    $('#yp_container').draggable({
                        addClasses: false,
                        iframeFix: true,
                        stop: function( event, ui ) {
                            window.ypPosition = ui.position;
                        }
                    });
                    $('#yp_exit').on('click', function(e){
                        $('#yp_container').remove();
                    });
                    e.preventDefault();
                    e.stopPropagation();
                });
            } else {
                row.css({backgroundColor: 'rgba(132, 0, 0, 0.25)'});
            }
        })();
    }
};

var initButton = function(){
    $('body').append('<div id="bfds-button"></div>');
    var button = $('#bfds-button');
    button.css({
        backgroundImage: "url(\"" + chrome.extension.getURL("icon.png") + "\")"
    });

    button.on('click', function(){
        initLeads();
        var that = $(this);
        $(this).addClass('clicked');
        setTimeout(function(){
            that.removeClass('clicked');
        }, 150);
    });
};

window.onload = function() {
    initButton();
};