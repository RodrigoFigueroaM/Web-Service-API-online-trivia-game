//global variable
var currentQuestion={}; //stores the question to be showed


var main = function()
{
    //start first question
    currentQuestion=getScore(getNextQuestion);

    /*****************************************************
        Upon click on next. it conects to server.
        Retrieves and displays question
    ******************************************************/
    $('#next').on('click', function()
    {
        currentQuestion= getNextQuestion();
    });

    /*****************************************************
        Upon click on submit-answer. it sends data from
        input fields Answe to server.
        it Retrieves and displays score from /score
    ******************************************************/
    $('#submit-answer').on('click', function ()
     {
        var currentAnswer={};
         currentAnswer.answer=$('#answer').val();
         currentAnswer.answerId=currentQuestion.answerId;
         ajaxPost( '/answer', currentAnswer, submit);
    });
};

/*****************************************************
    conects to server.
     Retrieves and displays a question
 ******************************************************/
var getNextQuestion =function ()
{
      ajaxGet('/question', updateQuestion );
};

/*****************************************************
    Updates current question HTML field
    as well as global variable for current question.
    takes as a parameter a JSON object
******************************************************/
var updateQuestion = function(responseQuestion)
{
    currentQuestion=responseQuestion;
    $('#question .questionAsked').remove();
    $('#question').append('<span class= "w3-animate-right questionAsked">'+currentQuestion.question+'</span>');
    return currentQuestion;
};
/*****************************************************
    Updates score HTML field
    takes as a parameter a JSON object
******************************************************/
var updateScore = function (check)
{
    $('#correct .correct-score').remove();
    $('#incorrect .incorrect-score').remove();
    $('#correct').append('<span class="correct-score">'+check.right+'</span>');
    $('#incorrect').append('<span class="incorrect-score">'+check.wrong+'</span>');
};

/*****************************************************
  conects to server.
  to retreive json for score
  once done, updates question
 ******************************************************/
var getScore = function(callback)
{
    ajaxGet('/score', updateScore );
    callback();
};

/*****************************************************
  conects to server.
  to send json wit ansnwer and answerIdi
  once done, updates score and question
 ******************************************************/
var submit = function()
{
        $('#answer').val('');
        getScore(getNextQuestion);
}




$(document).ready(main);
