const express=require('express');
const app=express();
const path=require('path');
const bp=require('body-parser');
app.use(bp.urlencoded({extended:true})); 



const PORT=process.env.PORT||3000;


// static files
app.use(express.static('public'));
app.use('/css',express.static(__dirname+'public/css'));
app.use('/js',express.static(__dirname+'public/js'));
app.use('/img',express.static(__dirname+'public/img'));
 
// ejs files

app.set('views','./views');
app.set('view engine','ejs');




var base62 = require("base62"); 
var charset = "~9876543210ABCDEFGHIJKLMNOPQRSTU$^@!*abcdefghijklmnopqrstuvw-=";
base62.setCharacterSet(charset);

const mongoose=require('mongoose');

const db='mongodb+srv://admin:EF1Boa00LrURyCID@cluster0.omemw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(db)
.then(()=>{console.log("connected")})
.catch(err=>{console.log(err)});

const smallS = new mongoose.Schema({
	url:String,
	shortid:String,
	shortUrl:String
});

let counter=1;
const urlTemplate=new mongoose.model('url',smallS);
urlTemplate.find({},(err,res)=>{
	if(err) console.log(err)
	else if(res[0]){
		
	counter=Number(res[0].shortid);
	}

}).sort({_id:-1}).limit(1);

app.get('/',(req,res)=>{
	res.render('home.ejs');
});


app.get('/about',(req,res)=>{
	res.render('about.ejs');
});



function randomNumber(min, max) { 
    return Math.random() * (max - min) + min;
}
app.post('/',(req,res)=>{
	const inp=req.body.url;
	counter++;

	const cur_counter=String(counter);
	

	const n1=randomNumber(1,5);
	const n2=randomNumber(1,5);
	

	const f=Math.trunc(Math.floor(Math.random()*9000)+Math.pow(10,n1));
	const b=Math.trunc(Math.floor(Math.random()*10000)+Math.pow(10,n2));
	console.log(f);
	console.log(b);
	to_hash=f+cur_counter+b;
	console.log(to_hash);
	const cur_url=base62.encode(Number(to_hash));
	

	const to_post= new urlTemplate({
		url:inp,
		shortid:cur_counter,
		shortUrl:cur_url
	});

	console.log(cur_url);
	
	
	
	to_post.save();
	
res.render('output',{text:`${cur_url}`})
});

 
app.get('/:code',(req,res)=>{

	const toSearch=req.params.code;
	
	urlTemplate.find({shortUrl:toSearch},(err,result)=>{
		if(err) {
			console.log(err);
			res.render('error');}
		else{
			if(result[0]){
				res.redirect(result[0].url);	
			}else{

				res.render('notfound',{text:`${toSearch}`});
			}
		}
	})
})

app.listen(PORT,()=>{
	console.log(`Running on port ${PORT}`);
});

