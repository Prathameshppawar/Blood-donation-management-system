app.post('/register', (req, res) => {

    console.log(req.body);
    const { email, password, usertype } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log(hashedPassword)
 
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
                res.redirect('campuseroptions')
            }
            else if(results.length==0)
            { 
                console.log("user doesn't exist")
                if(usertype[0]=='c')
                {
                    db.query(
                        'INSERT INTO campuser (email, password ) VALUES (?, ?)',
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
 
                    res.redirect('/campuseroptions')
                } 
                else if(usertype[0]=='b')
                {
                    db.query(
                        'INSERT INTO bloodbankuser (email, password ) VALUES (?, ?)',
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
                else if(usertype[0]=='h')
                {
                    db.query(
                        'INSERT INTO hospitaluser (email, password ) VALUES (?, ?)',
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
        }
    })


    
    
    
})