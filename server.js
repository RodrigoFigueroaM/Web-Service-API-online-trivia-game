/* jshint browser: true, jquery: true, camelcase: true, indent: 2, undef: true, quotmark: single, maxlen: 80, trailing: true, curly: true, eqeqeq: true, forin: true, immed: true, latedef: true, newcap: true, nonew: true, unused: true, strict: true */

//requirements
var express = require('express'),
    http = require('http'),
    body = require('body-parser'),
    redis = require('redis').createClient(),
    mongo= require('mongodb').MongoClient,
    test = require('assert');
    app = express(),
    url='mongodb://localhost/questionnaire';

//global variable
var questionnaire;
var answerId=0; //used so taht each question get a different Id
var score={};   // current score for player

http.createServer(app).listen(3000);
app.use(body.urlencoded({extended:false}));
app.use(body.json());
app.use(express.static(__dirname+'/client'));

/******************************************************
     takes db and empties it outuppon complition displays
     Collection removed.
*******************************************************/
function cleanColection(questionnaire, callback)
{
  	'use strict';
    questionnaire.remove({},function (err, db)
 {
     if(err)
     {
         console.log('Couldn\'t remove collection');
     }
     else
      {
         console.log('Collection removed ');
     }

     callback(questionnaire);
    });

}

/*****************************************************
 takes current db and loads some pregenerated
    questions
******************************************************/
function defaultQuestions(questionnaire)
{
  	'use strict';
    questionnaire.insert({question:'Who was the first computer programmer?', answer:'Ada Lovelace', answerId:++answerId});
    questionnaire.insert({question:'Who launched GNU?', answer:'Richard Stallman', answerId:++answerId});
    questionnaire.insert({question:'Who founded apple?', answer:'Steve Jobs', answerId:++answerId});
    questionnaire.insert({question:'Who founded MicroSoft?', answer:'Bill Gates', answerId:++answerId});
}

/*****************************************************
  start database
******************************************************/
mongo.connect(url, function(err,db)
 {
   		'use strict';

       questionnaire = db.collection('questionnaire');
       cleanColection(questionnaire, defaultQuestions);
       redis.set('right', 0);
       redis.set('wrong',0);

 });

 /*****************************************************
    home route
 ******************************************************/
app.get('/',function(req,res)
    {
      	 'use strict';
          res.send(index.html);
    });

/*****************************************************
   answer post route
    checks if the answer provided by the client is right
    if so increments right counter
    else increment wrong counter
    sends counter for client to check answer
******************************************************/
app.post('/answer',function(req,res)
    {
      	'use strict';
        var checkAnswer={}; // check client Answer will contain answer and id
        console.log(req.body);
        questionnaire.findOne({answerId:req.body.answerId},function (err, ans)
            {
                if(err)
                {
                    res.send('DB error');
                }
                 else
                 {
                     if(req.body.answer===ans.answer)
                     {
                         checkAnswer.correct='true';
                         redis.incr('right');
                      }
                      else
                      {
                          checkAnswer.correct='false';
                          redis.incr('wrong');
                      }
                   }
                   res.json(checkAnswer);
              });
    });



/*****************************************************
           question get route
            sends a random qustion to client
******************************************************/
app.get('/question',function(req,res)
            {
                var sendThisQuestion={}; //question to send
                var random;     //randomizes the question for user side
              	'use strict';
                random = Math.floor((Math.random() * answerId) + 1);
                questionnaire.findOne({answerId:random},function (err, askQuestion)
                {
                    if(err)
                    {
                        res.send('error');
                    }
                    else
                     {
                         sendThisQuestion.question = askQuestion.question;
                         sendThisQuestion.answerId = askQuestion.answerId;

                         res.json(sendThisQuestion);
                     }
                });

            })
/*****************************************************
    question post route
    Gets a question and answer from client.
    it assigns an answerId from curent answerId counter
******************************************************/
app.post('/question',function(req,res)
            {
						'use strict';
                	var newQuestion= req.body;
                		newQuestion.answerId= ++answerId;
                		questionnaire.insert(newQuestion);
                        questionnaire.save(newQuestion);
                        res.status(201).end();
            });

/*****************************************************
    score post route
    stores the current values of right and wrong
    into score. Then passes score to client
******************************************************/
app.get('/score',function(req,res)
    {
        //change to mget
      	'use strict';
        redis.mget('right');
        redis.mget(['right','wrong'],function(err,value)
            {
                score.right=value[0];
                score.wrong=value[1];
                res.json(score);
            });

    });


console.log('server listening on  3000');
