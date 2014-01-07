var mysql = require("mysql");

var connection = mysql.createConnection(
    {
      host     : 'localhost',
      user     : 'root',
      password : 'heta',
      database : 'mytest',
    }
);

function connect(req,res)
{
	console.log("model inside connect");
	//connection.connect();
	/*var queryString = 'SELECT * FROM test';
	connection.query(queryString, function(err, rows, fields)
	 {
    	if (err) throw err;
 
    	for (var i in rows) {
        	console.log('ID: ', rows[i].id);
    	
			   }
	
	res.send("Inside from connect");
    	//res.end(JSON.stringify(rows));
    	
	});*/
	//res.send("Inside from connect");
	//connection.end();
	console.log("model lastline inside connect");
}

function createSignup(req,res,firstName,lastName,userEmail,userPassword,userRole,cb)
{
	var queryString='insert into signup(first_name,last_name,user_email,user_password,user_role) values ("' +
			 firstName + '","' +
                         lastName + '","' +
			 userEmail + '","' +
			 userPassword + '",' +
			 userRole + ')';
	console.log(queryString);
	connection.query(queryString,function(err,rows,fields)
	{
	if(err) throw err;
	cb(err,rows);
	
	});
}

function login(req,res,userEmail,userPassword,cb)
{
	/*var queryString = 'select user_id,user_email,user_password from signup where user_email = "'+ userEmail +'" and user_password="' + userPassword + '"';*/
	var queryString = 'select user_id,user_password,user_role from signup where user_email = "'+ userEmail +'"';
	connection.query(queryString, function(err,rows,fields)
	{
		console.log('ID',rows[0].user_id);
		cb(err,rows);
	});
}

function getAllQuestions(req,res,userid,id,cb)
{
	//var queryString = 'select question_id,superv_id,question,option1,option2,option3,option4,answer,points from questions';
	var queryString = 'select question_id,superv_id,question,option1,option2,option3,option4,answer,points from questions q where q.question_id NOT IN(select q_id from answers where user_id=' + userid +') and superv_id=' + id + '';
	connection.query(queryString, function(err, rows, fields)
	 {
    	//if (err) throw err;
 
    	for (var i in rows) {
        	console.log('ID: ', rows[i].question_id);
    		console.log('question: ', rows[i].question);
			   }
	
	cb(err,rows);
	//res.send("Inside from connect");
    	//res.end(JSON.stringify(rows));
    	
	});
}

function getAllQuestionBySupervisor(req,res,id,cb)
{
	var queryString = 'select question_id,superv_id,question,option1,option2,option3,option4,answer,points from questions where superv_id=' + id + '';
	 
	connection.query(queryString, function(err, rows, fields)
	 {
    	//if (err) throw err;
 
	cb(err,rows);
	//res.send("Inside from connect");
    	//res.end(JSON.stringify(rows));
    	
	});
}


function insertQuestion(req,res,superv_id,question,option1,option2,option3,option4,answer,points,cb)
{
	console.log("Inside insertQuestion");
	console.log(question);
	console.log(points);
 	var queryString = 'insert into questions(superv_id,question,option1,option2,option3,option4,answer,points) values(' +
			  superv_id + ',"' +
			  question + '","' +
			  option1 + '","' +
			  option2 + '","'+
			  option3 + '","' +
			  option4 + '",' +
			  answer + ',' +
                          points + ')';
	console.log(queryString);
	connection.query(queryString,function(err,rows,fields)
	{
	if(err) throw err;
	cb(err,rows);
	//res.send("Question Inserted");
	});
			  
}

function getAllAnswers(req,res)
{
	var queryString = 'select answer_id,q_id,user_id,superv_id,answer,points from answers';
	connection.query(queryString, function(err, rows, fields)
	 {
    	if (err) throw err;
 
    	for (var i in rows) {
        	console.log('ID: ', rows[i].answer_id);
    		console.log('question: ', rows[i].answer);
			   }
	
	//res.send("Inside from connect");
    	res.end(JSON.stringify(rows));
    	
	});	
}
function insertAnswer(req,res,q_id,user_id,superv_id,answer,points)
{
	var queryString ='insert into answers(q_id,user_id,superv_id,answer,points) values(' +
			  q_id + ',' +
			  user_id + ',' +
			  superv_id + ',' +
			  answer + ',' +
			  points + ')'; 
	console.log(queryString);
	connection.query(queryString,function(err,rows,fields)
	{
	if(err) throw err;

	//res.send("Answers Inserted");
	});
}

function getAllSupervisor(req,res,cb)
{
	var queryString = 'select user_id,first_name from signup where user_role=1';
	connection.query(queryString,function(err,rows,fields)
	{
	cb(err,rows);
	});
}

function getAllAnswerCount(req,res,q_id,answerno,superv_id,cbr)
{
	var queryString = 'select count(answer) as totalans from answers where q_id = ' + q_id +'  and  answer= ' + answerno +'  and superv_id = ' + superv_id + ' group by q_id';

	console.log(queryString);
	connection.query(queryString,function(err,rows,fields)
	{
	console.log(rows)
	cbr(err,rows);
	});

}

function getTotalAnswerCount(req,res,q_id,answerno,superv_id,cb)
{
	console.log('q_id' + q_id);
	var queryString = 'select q_id,count(*) as totalans from answers where q_id = ' + q_id +' and answer= ' + answerno +' and superv_id = ' + superv_id + '';
	//var queryString = 'select count(*) as totalans from answers where q_id = ' + q_id + ' and superv_id=' + superv_id + '';
	console.log(queryString);
	connection.query(queryString,function(err,rows,fields)
	{
	
	cb(err,rows);
	});
}

function getTotal(req,res,q_id,superv_id,cb)
{
	var queryString = 'select count(*) as total from answers where q_id = ' + q_id + ' and superv_id=' + superv_id + '';
	//console.log(queryString);
	connection.query(queryString,function(err,rows,fields)
	{
	//console.log(rows)
	cb(err,rows);
	});
}




exports.connect = connect;
exports.getAllQuestions=getAllQuestions;
exports.getTotal=getTotal;
exports.getTotalAnswerCount=getTotalAnswerCount;
exports.insertQuestion=insertQuestion;
exports.createSignup=createSignup;
exports.insertAnswer=insertAnswer;
exports.login=login;
exports.getAllSupervisor=getAllSupervisor;
exports.getAllQuestionBySupervisor = getAllQuestionBySupervisor;
