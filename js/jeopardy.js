/*jslint browser: true*/
/*global $, jQuery, alert, FileReader */

var game = {};
var daily = {};
var prompt = {};

game.init = function () {
    'use strict';
    if (game.gamedata === null) {
        return;
    }

    $('#game').fadeIn(1000);
    $('#options').hide();
    $('#stats').show();

    game.teams = [];
    $(".team").each(function () {
        game.teams.push({
            "name": $(this).val(),
            "points": 0
        });
    });
    game.createScoreboard();
    game.current_points = 0;
};

game.createScoreboard = function () {
    'use strict';

    var i, content;

    content = "<table cellspacing=10><tbody><tr>";
    for (i = 0; i < game.teams.length; i = i + 1) {
        content += "<th><h3>" + game.teams[i].name + "</h3></th>";
    }

    content += "</tr><tr>";
    for (i = 0; i < game.teams.length; i = i + 1) {
        content += "<td><h3 id='team" + i + "'>0</h3><input class='add-points' onclick='game.addPoints(" + i + ")' value='+' type='button' /><input class='subtract-points' onclick='game.subtractPoints(" + i + ")' type='button' value='-' /></td>";
    }

    content += "</tr></tbody></table>";
    $('#stats').html(content);
};

game.addPoints = function (team) {
    'use strict';
    game.updatePoints(team, game.current_points);
};

game.subtractPoints = function (team) {
    'use strict';
    var points = -game.current_points;
    game.updatePoints(team, points);
};

game.updatePoints = function (team, diff) {
    'use strict';
    game.teams[team].points += diff;

    $('#team' + team).html(game.teams[team].points);
    $('#' + game.current_questionID)
        .addClass("dirty")
        .unbind('mouseover')
        .unbind('mouseout')
        .unbind('click');

    game.current_points = 0;
};

game.loadFile = function (onload) {
    'use strict';
    if (typeof window.FileReader !== 'function') {
        return;
    }

    var fr, input = document.getElementById('fileinput');
    if (input && input.files && input.files[0]) {
        fr = new FileReader();
        fr.onload = onload;
        fr.readAsText(input.files[0]);
    }
};

game.extractFromId = function (identifier, index) {
    'use strict';
    var retval, regexp = /c([0-9])r([0-9])/g;
    retval = regexp.exec(identifier);
    return retval[index];
};

prompt.show = function (field) {
    'use strict';
    game.current_points = parseInt(field.find('h3').text(), 10);
    game.current_questionID = field.attr("id");
    var column, row, dataset, question, answer;
    column = game.extractFromId(field.attr("id"), 1) - 1;
    row = game.extractFromId(field.attr("id"), 2) - 1;
    dataset = game.gamedata.data[column].data[row];

    $('#game').hide();

    if (dataset.hasOwnProperty("daily")) {
        if (game.points_bet) {
            game.current_points = parseInt(game.points_bet, 10);
            game.points_bet = null;
        } else {
            daily.show(field);
            return;
        }
    }

    question = prompt.loadImage(dataset.question);
    answer = prompt.loadImage(dataset.answer);

    $('#question').hide();
    $('#prompt').fadeIn(1000);
    $('#answer').html(question);
    $('#question').html(answer);
    if ($('#question').html().length === 0) {
        $('#correct-response').hide();
    } else {
        $('#correct-response').show();
    }
};

prompt.loadImage = function (image) {
    'use strict';
    var prefix = game.gamedata.directory;
    if (image.substring(0, 6) === "image:") {
        return "<img src=\"data/" + prefix + "/" + image.substring(6) + "\">";
    }
    return image;
};

prompt.hide = function () {
    'use strict';
    $('#prompt').hide();
    $('#game').show();
};

prompt.showQuestion = function () {
    'use strict';
    $('#question').fadeIn(1000);
};

prompt.continueGame = function () {
    'use strict';
};

daily.show = function (field) {
    'use strict';
    $('#prompt').hide();
    $('#daily').show();

    $('#bet_submit').click(function () {
        game.points_bet = $("#bet").val();
        game.current_points = game.points_bet;
        prompt.show(field);
        $('#daily').hide();
    });
};

$(document).ready(function () {
    'use strict';
    $('tbody tr td').each(function () {
        $(this).addClass('cell')
            .click(function () {
                var field = $(this);
                if (!field.hasClass('dirty')) {
                    prompt.show(field);
                }
            });
    });

    $('textarea.edit').focus(function () {
        $(this).addClass('active');
        var val = $(this).val();
        if (val === "Enter Category" || val === "Enter Title") {
            this.select();
        }
    }).blur(function () {
        $(this).removeClass('active');
    }).autogrow();

    $('.clean').mouseover(function () {
        $(this).addClass('ie-hack');
    }).mouseout(function () {
        $(this).removeClass('ie-hack');
    });

    $('#fileinput').change(function () {
        game.loadFile(function (e) {
            var data, j;
            data = $.parseJSON(e.target.result);
            $('#title').html(data.name);
            $('#gametitle').html(data.name);
            j = 0;
            $('thead').find('th:not(#gametitle)').each(function () {
                var id, label;
                id = $(this).attr("id");
                label = data.data[j].name;
                $(this).html(label);
                j = j + 1;
            });
            game.gamedata = data;
        });
    });

    $("#add").click(function () {
        $("<input type=\"text\" name=\"team[]\" class=\"team\" />").appendTo("#teams");
    });
});
