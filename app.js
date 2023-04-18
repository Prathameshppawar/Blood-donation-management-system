const express = require ("express");

const db = require("./routes/db-config");

const cookieParser = require("cookie-parser");

const bcrypt= require('bcryptjs')
const PORT=process.env.PORT;
const cookie = require ("cookie-parser");

const dotenv = require("dotenv").config();

var path= require("path")

const bodyParser= require('body-parser')

const app = express();

// app.use("/js", express.static(__dirname+"./public/js"));
// app.use("/css", express.static(__dirname+"./public/css"));
app.use(express.static(path.join(__dirname+"/public")));
// console.log("port " + PORT);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(cookie());
app.use(express.json());

function temp(){
    let email='flkgjh'
    let password='qwerty'
    db.query('Select email from donor where email = ?', [email], (error,results)=>{
        if(error){
            console.log('user not found')}
        else{
            if(results.length>0){
                console.log('auth', {
                    message:'Already existing user'
                })
            }
            else if(results.length==0)
            {
                console.log("user doesn't exist")
                db.query(
                    'INSERT INTO donor (email, password ) VALUES (?, ?)',
                    [ email, password ],
                    (err, results) => {
                      if (err) {
                        console.log(err);
                        res.status(500).json({ message: 'Server error' });
                      } else {
                        res.status(200).json({ message: 'User registered' });
                      }
                    }
                 );
            }
        }
    })
}

// temp();

db.connect((err)=> {
    if(err){ 
        console.log('error connecting database')
    }
    // throw err;
    else{
        console.log("database connected");
    }
})
 
app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/login', (req, res) =>{
    res.render('userlogin')
})

app.post('/login', (req,res)=>{
    const {email, password, usertype}=req.body 
    const obj={mailid:email, pass:password, opt: usertype}
    console.log(obj)
    res.render('index2', {email:email, password:password, option:usertype})
})

app.get('/register', (req, res)=>{
    res.render('userlogin')
})

app.post('/register', (req, res) => {

    console.log(req.body);
    const { email, password, usertype } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log(hashedPassword)

    db.query('Select email from donor where email = ?', [email], (error,results)=>{
        if(error){
            console.log('user not found')}
        else{
            if(results.length>0){
                console.log('auth', {
                    message:'Already existing user'
                })
            }
            else if(results.length==0)
            {
                console.log("user doesn't exist")
                db.query(
                    'INSERT INTO donor (email, password ) VALUES (?, ?)',
                    [ email, password ],
                    (err, results) => {
                      if (err) {
                        console.log(err);
                        res.status(500).json({ message: 'Server error' });
                      } else {
                        res.status(200).json({ message: 'User registered' });
                      }
                    }
                 );
            }
        }
    })


    res.render('home')
    
    
})

app.get('/index', (req,res)=>{
    // const obj=null
    res.render('index')
})


app.listen(PORT, ()=>{
    console.log("server started at port "+PORT)
}); 