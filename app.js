const express = require ("express");

const db = require("./routes/db-config");

const cookieParser = require("cookie-parser");

const bcrypt= require('bcryptjs')
const PORT=process.env.PORT;
const cookie = require ("cookie-parser");

const dotenv = require("dotenv").config();

var path= require("path")

const bodyParser= require('body-parser');
const { ifError } = require("assert");
const { error } = require("console");

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
    res.redirect('home')
})

app.get('/about', (req, res)=>{
    res.render('home')
})

app.get('/donate', (req,res)=>{
    res.render('home')
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
            console.log('donors='+res.length)
            temp1=Number(res.length)
            db.query('Select * from blood', (error, results)=>{
                if(error)
                {
                    console.log(error)
                }
                else
                {
                    console.log('curr blood '+results.length)
                    temp2=Number(results.length)
                    console.log('temp2 in curr blood='+temp2)
                    db.query('select * from bloodhistory', (errors, resultss)=>{
                        if(errors){
                            console.log(errors)
                        }
                        else{
                            console.log('hist blood '+resultss.length)
                            console.log(typeof(resultss.lenth))
                            temp2=Number(temp2)+Number(resultss.length)
                            console.log('temp2 in req blood= '+temp2)
                        }
                    })
                     
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
                        res.render('donorregister', {
                            message:'New donor registered'
                        })
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
            console.log(result)
            console.log(result[0].donor_id)
            if(result.length==0){
                return res.render('addbloodsample', {
                    message: 'Donor not found'
                })
            }
            else
            {
                db.query(
                    'INSERT INTO blood (blood_type, Rh_factor, Weight, Hb, Blood_percentage, donor_id, campid) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [bloodtype, rhfactor, weight, hb, bloodpercent, result[0].donor_id, campid],
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
    console.log(req.query.hospitalid)

    res.render("checkavailability", {
      req_blood: null,
      mesg1: false,
      mesg2: false,
      mesg3: false,
      mesg4: false,
      hospid: req.query.hospitalid
    });
  })


app.get("/reqblood", (req, res) => {
    res.render("requestblood", { mesg1: false, req_blood: null });
});

app.post("/reqblood", (req, res) => {
    const { bloodtype, rhfactor, volume } = req.body;
    const hospid= req.query.hospitalid
    console.log(hospid)
    console.log(req.body)
    console.log(req.query)

    let qry = "insert into requests(hospitalid, bloodtype, rhfactor, units) values(?,?,?,?)";
    db.query(qry, [hospid, bloodtype, rhfactor, volume], (err, results) => {
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


app.post("/checkandreqblood", (req, res) => {
    
    const { bloodtype, rhfactor, volume } = req.body;
    const checkbloodavail = req.body.CHECK;
    const reqbloodavail = req.body.GOFORAREQUEST;
    let req_blood = req.body.volume;
    if (checkbloodavail) {
      let qry =
        "select count(Rh_factor) as avail from blood where blood_type=? and Rh_factor=?";
      db.query(qry, [bloodtype, rhfactor], (err, results) => {
        if (err) throw err;
        else {
            console.log('first element= '+results[0].avail)
            console.log('total rsult length='+results.length)
            // console.log(req_blood)
            // console.log(req)
            if(results[0].avail==0){
                console.log('no blood is available')
                res.render("checkavailability", {
                    req_blood: req_blood,
                    mesg1: true,
                    mesg2: false,
                    mesg3: false,
                    mesg4: false,
                    hospid: req.query.hospitalid
                })
            }
            else{
                if(results[0].avail<req_blood){
                    console.log('in avail=null')
                    res.render("checkavailability", {
                        req_blood: req_blood,
                        results,
                        mesg1: false,
                        mesg2: false,
                        mesg3: true,
                        mesg4: false,
                        hospid: req.query.hospitalid
                    })
                    
                }
                else if(results[0].avail>=req_blood)
                {
                    console.log('in avail blood is excess')
                    res.render("checkavailability", {
                        req_blood: req_blood,
                        results,
                        mesg1: false,
                        mesg2: true,
                        mesg3: false,
                        mesg4: false,
                        hospid: req.query.hospitalid
                    })
                }
                else {
                    console.log('in avail blood is less')
                    res.render("checkavailability", {
                        req_blood: req_blood,
                        mesg1: true,
                        mesg2: false,
                        mesg3: false,
                        mesg4: false,
                        hospid: req.query.hospitalid
                    })
                }
            }
        }
      })
    } 
});

app.get("/hospitaluser", (req, res) => {
    res.render("hospitaluser");
  })

app.get('/bloodbankuser', (req,res)=>{
    res.render('bloodbankuser')
})

var result
let hospname

app.get('/checkrequests', (req,res)=>{
    
    let resarray=[]
    const qry='Select hospital.hospitalname from requests inner join hospital on requests.hospitalid=hospital.hospital_id'
    db.query('Select * from requests', (err,res)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log(res)
            console.log('length ='+res.length)
            result=res
            console.log(res[0].hospitalid)
            console.log('result= '+result)
            
            db.query('SELECT hospital.hospitalname as hospname from hospital inner join requests where requests.hospitalid=hospital.hospital_id',
            (error, results)=>{
                if(error){
                    console.log(error)
                }
                else{
                    console.log('results obtained : '+results[0].hospname)
                    hospname=results
                }
            })
            
        }
    })

    // db.query('')
    console.log( 'results is ' + result+ 'ends here')
    res.render('checkrequests', {
        results: result,
        hospitalname:hospname,
        msg: null
    })

})


app.post('/checkrequests', (req,res)=>{

    console.log('query is '+req.query.reqid)
    const requestid=req.query.reqid
    const qry='Select * from requests where requestid = ?'
    const insertqry = "insert into reqhistory(reqid, hospitalid, bloodtype, rhfactor, units) values(?,?,?,?, ?)"
    const insertqryblood = "insert into bloodhistory(bloodid, bloodtype, rhfactor, weight, hb, Blood_percentage, donor_id, campid, hospital_id) values( ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    const msg='That amount of blood not available'
    db.query(qry, [requestid], (err,result)=>{
        if(err){
            throw err;
            console.log(err)
        }
        else{
            console.log('in first query='+result[0].units)
            db.query('Select * from blood where blood_type=? and rh_factor=?', [result[0].bloodtype, result[0].rhfactor], 
                (errors, results)=>{
                    if(errors){
                        console.log(errors)
                    }
                    else{
                        console.log('blood samples = '+results.length)
                        console.log('blood samples corresponding='+results[0])
                        console.log('min iterations ='+result[0].units)
                        // console.log('query for same bloodtype runs and gives donor to be'+results[0].donor_id)
                        if(results.length==0)
                        {
                            console.log('in results.length ==0\n\n')
                            return res.render('checkrequests',{
                                results: null,
                                hospitalname:null,
                                msg: 'Blood for the Selected blood type and rhfactor not availabe'
                            })
                        }
                        else{
                            
                            for(let i =0; (i< result[0].units) && (i<results.length) ; i++)
                            {
                                console.log('querying i for i= '+i)
                                db.query(insertqryblood, [results[i].blood_id, results[i].blood_type, results[i].Rh_factor, results[i].Weight, results[i].Hb, results[i].Blood_percentage, results[i].donor_id, results[i].campid, result[0].hospitalid],
                                    (er, resu)=>{
                                        if(er){
                                            console.log('logging error+'+er)
                                        }
                                        else{
                                            console.log('blood successsfully added for blood id='+results[i].blood_id)
                                            // return res.redirect('checkrequests')
                                            
                                        }
                                    })

                            }

                            if(results.length<=result[0].units){
                                result[0].units=result[0].units - results.length
                                db.query('update requests set units=? where requestid=?', [result[0].units, result[0].requestid], 
                                (errur, ress)=>{
                                    if(errur){
                                        console.log(error)
                                    }
                                    else{
                                        console.log('updated request units')
                                    }
                                })
                            }

                            db.query(insertqry, [result[0].requestid, result[0].hospitalid, result[0].bloodtype, result[0].rhfactor, result[0].units],
                                (error, resuu)=>{
                                    if(error){
                                        console.log(error) 
                                    }
                                    else{
                                        console.log('also inserted in request history')
                                        return res.redirect('checkrequests')
                                    }
                            })
                        }
                    }
            })
            

        }
    })
})

app.get('/alreadyexistinguser', (req, res)=>{
    res.render('alreadyregistered')
})



app.listen(PORT, ()=>{
    console.log("server started at port "+PORT)
})