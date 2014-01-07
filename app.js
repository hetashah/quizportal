var express = require("express");

var model = require("./models/model");
var app = express();




app.configure(function() {
app.use(express.bodyParser());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.cookieParser());
app.use(express.session({ secret: 'this is a secret'}));
app.use(app.router);
});

//Routes
app.post('/signupclick',function(req,res){
	
	var firstName=req.body.firstname;
	var lastName=req.body.lastname;
	var userEmail = req.body.email;
	var userPassword = req.body.password;
 	var userRole = req.body.role;
	console.log(firstName);
	console.log(userRole);
	model.createSignup(req,res,firstName,lastName,userEmail,userPassword,userRole,function(err,rows){
	if(err)
		throw err
	else
	{	
		var title = "Account Created";
		res.render('index',{
		locals: {'title':title}
		})
	}
	});
	//res.send('Inside Hello.txt end');
 
       
});

app.post('/login',function(req,res){
	
console.log("Inside Login");
	var userName = req.body.username;
	var userPassword = req.body.userpassword;
 	console.log(userName);
	console.log(userPassword);
	model.login(req,res,userName,userPassword,function(err,results)
		{
		if(err)
		   throw err;
		else
		   console.log(results);
		   console.log(results.length);
		   if(results.length >=1)
			{
				if(userPassword==results[0].user_password && results[0].user_role == 1)
					{
					var alert="Welcome Supervisor " + userName + "Login Successful";
					req.session.supervisorid = results[0].user_id;
					res.render('homeSupervisor',{
					locals:{'alert':alert}
					})
					}
				else if(userPassword==results[0].user_password)
					{
					var alert="Welcome Student " + userName + "Login Successful";
					req.session.userid = results[0].user_id;
					model.getAllSupervisor(req,res,function(err,rows)
						{
						if(err)
						{
		   					throw err;
						}
						console.log(rows);
						res.render('home',{
							locals:{'alert':alert,'supervisor':rows}
								})
						});
					
					}
				else
					{
					var alert="Incorrect Password, Try Again";
					res.render('index',{
					locals:{'title':alert}
					})
					}
					
					
			}
		   else
			{
			var title="User Not Found";
			res.render('index',{
			locals: {'title':title}
			})
			}
		   //res.send(results[0].question);
		}	
	);
	//res.send('Inside Hello.txt end');
});


app.get('/',function(req,res){
	//res.send('index');
	console.log("Inside index");
	var title='welcome'
	
	res.render('index',{
	locals: {
	'title':title}
	})
	//model.connect(req,res);

});


app.get('/Signup',function(req,res){
	//res.send('index');
	console.log("Inside signup");
	var title='welcome'
	
	
	res.render('signup',{
	locals: {
	'title':title}
	})
	//model.connect(req,res);

});

app.get('/answers',function(req,res){
	console.log(req.body);
	model.getAllAnswers(req,res);
});

app.post('/answers',function(req,res){
	//console.log(req.body);
	try	
	{
	for(var i=0; i< req.body.queslength; i++)
		{
	//var q = question + "i";
	var q_id = req.param('hidden' + i);
	var user_id= req.session.userid;
	var superv_id = req.body.supervisorid;
	var answer =req.param('question' + i);
	var correctanswer = req.param('answer' + i);
	if(answer === correctanswer)
		{
		var points =req.param('points' + i);
		}
	else
		{
		var points=0;
		}
	model.insertAnswer(req,res,q_id,user_id,superv_id,answer,points);
	/*console.log(q_id);   
	console.log(user_id);
	console.log(superv_id);
	console.log(answer);
	console.log(points);   */
		}
	res.send("Record Inserted succesfully");
	
	
	/*res.render('home',{
			locals: {
			'alert':alert}
				})*/
	}
	catch(e)
	{
	res.send(e);
	}
	
	
	/*model.insertAnswer(req,res,q_id,user_id,superv_id,answer,points);*/
	//res.send("Hello");
});

app.post('/questionsPage',function(req,res){
	
	console.log("Inside question");
	var supervisorid = req.body.selectSupervisor;
	console.log(supervisorid);
	//var title='welcome'
	model.getAllQuestions(req,res,req.session.userid,supervisorid,function(err,results)
		{
		if(err)
		   throw err;
		else
			{
		   console.log(results);
		   res.render('question',{
			locals: {
			'questions':results}
				})
			  
			}
		}	
	);
	
});

app.get('/insertQuestionPage',function(req,res){
	console.log("Inside question");
	var alert = '';	
	res.render('insertQuestion',{
			locals: {
			'alert':alert}
				});
			   	
	
});


/*app.get('/questions',function(req,res){
	console.log(req.body);
	model.getAllQuestions(req,res,function(err,results)
		{
		if(err)
		   throw err;
		else
		   console.log(results);
		   res.send(results[0].question);
		}	
	);
});*/

app.post('/insertQuestionPage',function(req,res){
	//console.log(req.body);
	var question = req.body.question;
	var option1 = req.body.option1;
 	var option2 = req.body.option2;
	var option3 = req.body.option3;
	var option4 = req.body.option4;
	var answer = req.body.answer;
	var points = req.body.points;
	console.log(question);
	console.log(option4);
	console.log(req.session.supervisorid);
	model.insertQuestion(req,res,req.session.supervisorid,question,option1,option2,option3,option4,answer,points,function(err,rows){
	if(err) 
		{
		throw err;	
		}
	else
		{
		var alert = 'Question Inserted, Add Next';
		res.render('insertQuestion',{
			locals: {
			'alert':alert}
				})
			  
			
		}

	});
	//res.send("Hello");
});

	
app.get('/calculateAnalytics',function(req,res){
	console.log("anlayticd");
	console.log("Inside question");
	
	//var title='welcome'
	var total;
	var answerCount;
	var percentage;

	
	model.getAllQuestionBySupervisor(req,res,req.session.supervisorid,function(err,results)
		{
		//var map = new Array(results.length)
		if(err)
		   throw err;
		else
			{
		   for(var i=1;i<=results.length;i++)
				{
					//var correct_answer = results[i-1].answer;
					model.getTotal(req,res,i,req.session.supervisorid,function(err,results)
					{
						 total = results[0].total;
							//console.log(results[0].total);
						req.session.total = results[0].total;
						//console.log('seesion' + req.session.total); 
					}
					);
					
					
					for(var j=1;j<=4;j++)
					{
						
							model.getTotalAnswerCount(req,res,i,j,req.session.supervisorid,function(err,results)
							{
						   	answerCount = results[0].totalans;
							console.log('total'+req.session.total);
							console.log('answerCount'+answerCount);
							percentage = (answerCount/req.session.total) * 100;
							console.log(percentage);
							 //map[i] = percentage;
							
							});
			
					}	
				
				}
		   
			  
			}
		}	
	);
	res.render('quizAnalytics',{
			locals: {'map':map}
				});

});

/*app.get('/quizAnalytics',function(req,res){
	console.log("Inside anal");
	var alert = '';	
	res.render('quizAnalytics',{
			locals: {
			        }
				}
			   	
	
});*/

console.log("Server Started");
app.listen(3000);
