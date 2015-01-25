$(document).ready(function() {
    $('table#game').hide();
    $('tbody tr td').each(function() {
        $(this).addClass('cell')
               .addClass('clean')
               .click(function() {
            prompt.show($(this));
        });
    });

    $('tbody tr td lr-answer, tbody tr td lr-question').each(function() {
        $(this).hide();
    });

	$('textarea.edit').autogrow();
	
	$('textarea.edit').focus(function(){
		$(this).addClass('active');
		var val = $(this).val();
		if(val == "Enter Category" || val == "Enter Title")
			this.select();
		
	})
	
	$('textarea.edit').blur(function(){
		$(this).removeClass('active');
	})	
	
		$('.clean').mouseover(function(){
			$(this).addClass('ie-hack')
		})
		
		$('.clean').mouseout(function(){
			$(this).removeClass('ie-hack')
		})	
});

var modal = {}
modal.show = function(questionID)
{
	modal.activeID = questionID;
	$('#question').val($('#' + questionID).val());
	$('#answer').val($('#a' + questionID).val());
	$('#modal').modal({"overlayClose" : true});
	$('#t' + questionID).addClass("dirty").removeClass("clean")
}

modal.save = function()
{
	$('#' + modal.activeID).val($('#question').val())
	$('#a' + modal.activeID).val($('#answer').val())
}

var game = {}
game.init = function()
{
	$('#game').fadeIn(1000);
	$('#options').hide()
	$('#stats').show()
	game.team_cnt = $('#teams').val()
	game.createScoreboard()
    game.current_points = 0;
}

game.createScoreboard = function()
{
	var content = "<table cellspacing=10><tbody><tr>";
	for(var i = 1; i <= game.team_cnt; i++)
	{
		content += "<th><h3>Team " + i + "</h3></th>";
	}
	content += "</tr><tr>";
	for(var i = 1; i <= game.team_cnt; i++)
	{
		//content += "<td><h3 id='team" + i +"'>0</h3><span class='add-points' onclick='addPoints(" + i +  ")'>+</span> <span class='remove-points' onclick='removePoints(" + i +  ")'>-</span></td>";
		content += "<td><h3 id='team" + i +"'>0</h3><input class='add-points' onclick='game.addPoints(" + i +  ")' value='+' type='button' /> <input class='subtract-points' onclick='game.subtractPoints(" + i +  ")' type='button' value='-' /></td>";
	}
	content += "</tr></tbody></table>";
	$('#stats').html(content);

}

game.addPoints = function(team) {	
	game.updatePoints(team, game.current_points);
}

game.subtractPoints = function(team) {
	var points = 0-game.current_points;
	game.updatePoints(team, points);
}

game.updatePoints = function (team, diff) {
    var points = parseInt($('#team' + team).html()) + diff;

    $('#team' + team).html(points);
	game.current_questionID.addClass("dirty")
	    .unbind('mouseover')
	    .unbind('mouseout');
}

var prompt = {}
prompt.show = function(field) {
	game.current_points = parseInt(field.find('lr-value').text());
	game.current_questionID = field;
	$('#question').hide();
	$('#game').hide();
	$('#prompt').fadeIn(1000);
	$('#answer').html(field.find('lr-question').html());
	$('#question').html(field.find('lr-answer').html());
	if($('#question').html().length == 0)
		$('#correct-response').hide();
	else
		$('#correct-response').show();
}

prompt.hide = function()
{
	$('#prompt').hide();
	$('#game').show();
}

prompt.showQuestion = function()
{
	$('#question').fadeIn(1000)
}
