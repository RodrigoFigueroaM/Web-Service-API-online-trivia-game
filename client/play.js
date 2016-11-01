var main = function()
{
    //local variable
    var currentQuestion={}; //stores the question to be showed
    var currentAnswer={};
    //start first question
    getNextQuestion();
    getScore();

    /*****************************************************
        Upon click on next. it conects to server.
        Retrieves and displays question
    ******************************************************/
    $('#next').on('click', function()
    {
        getNextQuestion();
    });

    /*****************************************************
        Upon click on submit-answer. it sends data from
        input fields Answe to server.
        it Retrieves and displays score from /score
    ******************************************************/
    $('#submit-answer').on('click', function ()
     {

         currentAnswer.answer=$('#answer').val();
         currentAnswer.answerId=currentQuestion.answerId;
         console.log(currentQuestion);
         console.log( currentAnswer);

         $.ajax({
                    type: 'POST',
                    contentType:'application/json',
                    url: '/answer',
                    data: JSON.stringify(currentAnswer),
                    dataType:'json',
                    success: function(data)
                    {
                        console.log(data);

                        $('#answer').val('');
                        getScore();
                        getNextQuestion();
                    },
                    error:function (data)
                    {
                        console.log(data)
                        console.log('ERROR');
                    }
               });
    });

    /*****************************************************
        conects to server.
         Retrieves and displays a question
     ******************************************************/
      function getNextQuestion()
      {
          $.ajax({
                    type: 'GET',
                    contentType:'application/json',
                    url: '/question',
                    dataType:'JSON',
                    success: function(responseQuestion)
                    {
                        currentQuestion=responseQuestion;
                        $('#question .questionAsked').remove();
                        $('#question').append('<span class= "w3-animate-right questionAsked">'+currentQuestion.question+'</span>');
                    }
                });
      }

    /*****************************************************
      conects to server.
           Retrieves and displays a score
       ******************************************************/
      function getScore()
      {
          $.ajax({
                    type: 'GET',
                    contentType:'application/json',
                    url: '/score',
                    dataType:'JSON',
                    success: function(check)
                    {
                          $('#correct .correct-score').remove();
                          $('#incorrect .incorrect-score').remove();

                          $('#correct').append('<span class="correct-score">'+check.right+'</span>');
                          $('#incorrect').append('<span class="incorrect-score">'+check.wrong+'</span>');

                    }

                });
      }
}




$(document).ready(main);
