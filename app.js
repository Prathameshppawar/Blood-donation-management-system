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




var temp1, temp2

app.get('/home', (req,res)=>{
    
    db.query('Select * from donor', (err, res)=>{
        if(err)
        {
            console.log(err)
        }
        else
        {
            console.log(res.length)
            temp1=res.length
            db.query('Select * from blood', (error, results)=>{
                if(error)
                {
                    console.log(error)
                }
                else
                {
                    console.log(results.length)
                    temp2=results.length
                     
                }
            })
        }
    })


    res.render('homepage', {
        donor: temp1,
        samples: temp2
    })

     
})




app.get('/login', (req, res)=>{
    res.render('userlogin', {
        msg: null
    })
})

app.post('/login', (req, res) => {  

    // console.log(req.body);
    const { email, password, usertype } = req.body;
    // const hashedPassword = bcrypt.hashSync(password, 10);
    // console.log(hashedPassword)
    

    if(usertype[0]=='c'){
        db.query('Select * from campuser where email = ? and password= ?', [ email, password], (error,results)=>{
            if(error){ 
                console.log('user not found')
                console.log(error)
            }
            else{
                if(results.length>0){
                    console.log(results[0].email)
                    console.log({
                        message:'Already existing user'
                    })

                    db.query('Select * from camp where camp_id= ?', [results[0].campid], (err, resultss)=>{
                        if(err){
                            console.log(error)
                            console.log(results[0].campid)
                            console.log('error in finding the camp')
                        }
                        else
                        {
                            return res.render('campuser', {
                                campid: resultss[0].camp_id,
                                loc: resultss[0].address,
                                pin: resultss[0].pincode
                            })
                        }
                    })
                    
                }
                else if(results.length==0)
                { 
                    
                    return res.render('userlogin', {
                        msg:'Check your details, wrong details entered'
                    })
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
                   return res.redirect('checkrequests')
                }
                else if(results.length==0)
                { 
                    
                    return res.render('userlogin', {
                        msg:'Check your details, wrong details entered'
                    })
                   
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
                    console.log(results)
                    console.log('auth', {
                        message:'Already existing user'
                    })
                    
                    db.query(
                    'Select * from hospital where hospital_id=?', 
                    [results[0].hospitalid], 
                    (err, ress)=>{
                        if(err){
                            console.log(error)
                        }
                        else
                        {
                            console.log(ress)
                            return res.render('hospitaluser', {
                                results: ress
                            })
                        }
                    })
                }
                else if(results.length==0) 
                { 
                    
                    return res.render('userlogin', {
                        msg:'Check your details, wrong details entered'
                    })
                    
                } 
                
            }
        })
    }

    
    
    
})
 



app.get('/campuseroptions', (req, res)=>{
    res.render('campuser', {
        campid: null,
        loc: null,
        pin: null
    });
})





app.get('/donorregister', (req,res)=>{
    res.render('donorregister',{
        message: null
    })
})

app.post('/donorregister', ((req,res)=>{
    console.log(req.body)
    console.log(req.query.campid)
    // res.redirect('donorregister') 
     
    const {fname, lname, pincode, phonenum, occupation, address, gender, dob}= req.body
    console.log(lname)
    


    db.query('Select donor_id from donor where F_name= ? and L_name=? and phonenum=?', [fname, lname, phonenum], (error, results)=>{
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
                // return res.render('donorregister', {
                //     message: 'Already existing user' 
                // })
            }

            else if(results.length==0){   
    
                console.log('new user') 
                
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
    res.render('addbloodsample', {
        message: null
    })
})

app.post('/addbloodsample', (req, res)=>{
    const {fname, lname, phonenum, bloodtype, rhfactor, weight, hb, bloodpercent, volume}=req.body
    console.log(req.body)
    console.log('campid='+req.query.campid)
    const campid=req.query.campid
    console.log('fname='+fname+' lname= '+lname+'  phone= '+phonenum)
    // let temp=5
    db.query('Select donor_id from donor where F_name= ? and L_name=? and phonenum=?', [fname, lname, phonenum], (err, result)=>{
        if(err){
            throw err; 
        }
        else
        { 
            console.log(result[0].donor_id)
            if(result.length==0){
                return res.render('addbloodsample', {
                    message: 'Donor not found'
                })
            }
            else
            {
                db.query(
                    'INSERT INTO blood (blood_type, Rh_factor, Weight, Hb, Blood_percentage, Volume, donor_id, campid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [bloodtype, rhfactor, weight, hb, bloodpercent, volume, result[0].donor_id, campid],
                    (error, results)=>{
                        if(error){
                            console.log(error)
                        }
                        else{
                            console.log('successfully added sample')
                            return res.render('addbloodsample', {
                                message: 'Succcessfully added sample'
                            })
                        }
                    }
                )
            }
        }
    })
    
 
 
})

app.get("/hospitaluser", (req, res) => {
    res.render("hospitaluser");
})

app.get("/checkavailability", (req, res) => {
    res.render("checkavailability", {
      req_blood: null,
      mesg1: false,
      mesg2: false,
      mesg3: false,
      mesg4: false,
    });
  })


app.get("/requestblood", (req, res) => {
    res.render("requestblood", { mesg1: false });
});

app.post("/reqblood", (req, res) => {
    const { bloodtype, rhfactor, volume } = req.body;
    let qry = "insert into request values(?,?,?)";
    db.query(qry, [bloodtype, rhfactor, volume], (err, results) => {
      if (err) throw err;
      else {
        if (results.affectedRows > 0) {
          res.render("requestblood", {
            mesg1: true,
          });
        } else {
          console.log("Data couldn't be inserted.");
        }
      }
    });
});

app.get("/hospitaluser", (req, res) => {
    res.render("hospitaluser");
  })

app.get('/bloodbankuser', (req,res)=>{
    res.render('bloodbankuser')
})

app.get('/checkrequests', (req,res)=>{
    res.render('checkrequests')
})



app.get('/alreadyexistinguser', (req, res)=>{
    res.render('alreadyregistered')
})



app.listen(PORT, ()=>{
    console.log("server started at port "+PORT)
});