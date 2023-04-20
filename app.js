const express = require ("express");

const db = require("./routes/db-config");

const cookieParser = require("cookie-parser");

const bcrypt= require('bcryptjs')
const PORT=process.env.PORT;
const cookie = require ("cookie-parser");

const dotenv = require("dotenv").config();

var path= require("path")

const bodyParser= require('body-parser')

// import React, {useState} from 'react' 

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

// function temp(){
//     let email='flkgjh'
//     let password='qwerty'
//     db.query('Select email from donor where email = ?', [email], (error,results)=>{
//         if(error){
//             console.log('user not found')}
//         else{
//             if(results.length>0){
//                 console.log('auth', {
//                     message:'Already existing user'
//                 })
//             }
//             else if(results.length==0)
//             {
//                 console.log("user doesn't exist")
//                 db.query( 
//                     'INSERT INTO donor (email, password ) VALUES (?, ?)',
//                     [ email, password ],
//                     (err, results) => {
//                       if (err) {
//                         console.log(err);
//                         res.status(500).json({ message: 'Server error' });
//                       } else {
//                         res.status(200).json({ message: 'User registered' });
//                       }
//                     }
//                  );
//             }
//         }
//     })
// }

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
    res.render('homepage')
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
    

    if(usertype[0]=='c'){
        db.query('Select * from campuser where email = ? and password= ?', [ email, password], (error,results)=>{
            if(error){ 
                console.log('user not found')
                console.log(error)
            }
            else{
                if(results.length>0){
                    console.log('auth', {
                        message:'Already existing user'
                    })
                    return res.redirect('campuseroptions')
                }
                else if(results.length==0)
                { 
                    console.log("user doesn't exist")
                
                    db.query( 
                        'INSERT INTO campuser (email, password ) VALUES (?, ?)',
                        [ email, password ],
                        (err, results) => {
                        if (err) {
                            console.log(err);
                          
                        } else {
                            return res.redirect('/campuseroptions')
                        }
                        }
                    ); 
    
                   
                } 
                
            }
        })
    }

    else if(usertype[0]=='b'){
        db.query('Select * from bloodbankuser where email = ? and password= ?', [ email, password], (error,results)=>{
            if(error){ 
                console.log('user not found')
                console.log(error)
            }
            else{
                if(results.length>0){
                    console.log('auth', {
                        message:'Already existing user'
                    })
                   return res.redirect('bloodbankuseroptions')
                }
                else if(results.length==0)
                { 
                    console.log("user doesn't exist")
                
                    db.query(
                        'INSERT INTO campuser (email, password ) VALUES (?, ?)',
                        [ email, password ],
                        (err, results) => {
                        if (err) {
                            console.log(err);
                           
                        } else {
                            return res.redirect('bloodbankuseroptions')
                        }
                        }
                    ); 
    
                   
                } 
                
            }
        })
    }

    else if(usertype[0]=='h'){
        db.query('Select * from hospitaluser where email = ? and password= ?', [ email, password], (error,results)=>{
            if(error){ 
                console.log('user not found')
                console.log(error)
            }
            else{
                if(results.length>0){
                    console.log('auth', {
                        message:'Already existing user'
                    })
                    return res.redirect('hospitaluseroptions')
                }
                else if(results.length==0) 
                { 
                    console.log("user doesn't exist")
                
                    db.query(
                        'INSERT INTO campuser (email, password ) VALUES (?, ?)',
                        [ email, password ],
                        (err, results) => {
                        if (err) {
                            console.log(err);
                            
                        } else {
                            return res.redirect('hospitaluseroptions')
                        }
                        }
                    ); 
    
                   
                } 
                
            }
        })
    }

    
    
    
})
 



app.get('/campuseroptions', (req, res)=>{
    res.render('campuser');
})

// app.post('/campuseroptions', (req, res)=>{
//     console.log(req.body)
//     if(req.body.userregister){
//         res.redirect('donorregister')
//     }
//     else{
//         res.redirect('addbloodsample')
//     }

// })



app.get('/donorregister', (req,res)=>{
    res.render('donorregister')
})

app.post('/donorregister', ((req,res)=>{
    console.log(req.body)
    res.redirect('donorregister') 
     
    const {fname, lname, pincode, phonenum, occupation, address, gender, dob}= req.body
    console.log(lname)
    
    // const [type, setType]= useState('Already existing user')
    // let temp=0

    // if(fname)
    // {
    //     db.query('Select * from donor where F_name= ? and L_name=? and phonenum=?', [fname, lname, phonenum], (error, results)=>{
    //         if(error)
    //         {
    //             console.log(error)
    //             console.log('Errror in finding existing user')

    //         }
    //         else
    //         {
    //             if(results.length>0)
    //             {
    //                 console.log('auth', {
    //                     message: 'Already existing user'
    //                 })
 
    //                 temp=2
    //                 return res.render('donorregister', temp)
    //             }
                
    //         }
    //     })
    // }


    let msg={
        message: 'User already regsitered' 
    }
    db.query('Select * from donor where F_name= ? and L_name=? and phonenum=?', [fname, lname, phonenum], (error, results)=>{
        if(error)
        {
            console.log(error)
            console.log('Error in finding for existing user')
        }
        else
        { 
            if(results.length>0)
            {
                console.log( {
                    message:'Already existing user'
                })
                return res.redirect('alreadyexistinguser')
                // setType('Already existing user')
            }

            else if(results.length==0){   
                // setType('Already existing user')
                console.log('new user') 
                temp.push(1)
                console.log(temp.length+' for new user')   
                    // res.render('campuser') 
                db.query( 
                    'INSERT INTO donor (F_name, L_name, Pincode, Address, Occupation, DOB, Gender, phonenum ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [ fname, lname, pincode, address, occupation, dob, gender, phonenum ],
                    (err, results) => { 
                    if (err) { 
                        console.log(err);
                         
                    } else { 
                        console.log('user registered')
                    }
                    }
                ) 
                 
                
            }
        }
    })

    // console.log(type)
})) 
 
 
app.get('/addbloodsample', (req, res)=>{
    console.log("in adding bloood sample")
    res.render('addbloodsample')
})

app.post('/addbloodsample', (req, res)=>{
    const {fname, lname, phonenum, bloodtype, rhfactor, weight, hb, bloodpercent, volume}=req.body
    console.log(req.body)
    
    let temp=5
    db.query('Select donor_id from donor where F_name= ? and L_name= ? and phonenum=?', [fname, lname, phonenum], (err, result)=>{
        if(err){
            throw err;
        }
        else
        {
            console.log(result.l)
            temp=result
        }
    })
    db.query( 
        'INSERT INTO blood (blood_type, Rh_factor, Weight, Hb, Blood_percentage, Volume, donor_id) VALUES (?, ?, ?, ?, ?, ?)',
        [ bloodtype, rhfactor, weight, hb, bloodpercent, volume, temp ],
        (err, results) => {
        if (err) {
            console.log(err);
            console.log(result.donor_id)
            res.status(500).json({ message: 'Server error in insertion' });
        } else {
            res.status(200).json({ message: 'User registered' });
            
        }
        }
    );

     
})

app.get('/index', (req,res)=>{
    // const obj=null
    res.render('index')
})

app.get('/alreadyexistinguser', (req, res)=>{
    res.render('alreadyregistered')
})

app.post('/alreadyexistinguser', (req, res)=>{
    res.render('home')
})

app.listen(PORT, ()=>{
    console.log("server started at port "+PORT)
});