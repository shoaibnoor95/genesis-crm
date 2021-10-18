const express=require('express');
const router=new express.Router();
const passport=require('passport');
const path=require('path')
const User=require('../models/User')
const Sale =require('../models/sale')

router.get('/',(req,res,next)=>{
  res.sendFile(path.resolve(__dirname, '../views', 'index.html'));
});

function ensureAuth(req,res,next){
  if(req.isAuthenticated()){
    next();
  }
  else{
    res.status(401).send('Un authenticated')
  }
}
// router.get('/accessIps',function(req,res,next){
//   var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//   console.log(ip)
// })

router.patch("/KickBack/:id", async (req, res) => {
 
    const {CloserStatus,Status, AgentId,CloserId} = req.body
   
  try {
    const sale = await Sale.findByIdAndUpdate(req.params.id, { CloserStatus, CloserId,Status ,AgentId});
    
    console.log(sale)
    res.send(sale);
  } catch (e) {
    console.log(e)
    res.status(400).send(e);
  }
});

router.get('/all-user', async (req ,res) =>{
  try{
    const users = await User.find({ })
      res.send(users)
} catch (e){
    res.status(500).send(e)
}
})

router.get('/Users/:role', async (req ,res) =>{
  try{
    const users = await User.find({role: req.params.role}).select({_id:1, username:1})
      res.send(users)
} catch (e){
    res.status(500).send(e)
}
})

router.get("/all-sales", async (req, res) => {
  try {
    const sales = await Sale.find({});
    res.send(sales);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/salesBy/:status", async (req, res) => {
  console.log(req.params)
  try {
    const sales = await Sale.find({Status:req.params.status}).select({_id:1, Status:1,FullName:1,ContactNumber:1,updatedAt:1});
    const SalesWithTime = sales.map(s=>({...s._doc,Time:new Date(s.updatedAt).toLocaleTimeString() , Date:new Date(s.updatedAt).toLocaleDateString()}))
    res.send(SalesWithTime);
  } catch (e) {
    console.log(e)
    res.status(500).send({error:true});
  }
});

router.get('/AgentSales/:id', async (req ,res) =>{
  console.log("allow id", req.params)
  
    const sales = await Sale.find({Agent: req.params.id}).select({_id:1, Status:1,FullName:1,ContactNumber:1,updatedAt:1});
    const SalesWithTime = sales.map(s=>({...s._doc,Time:new Date(s.updatedAt).toLocaleTimeString() , Date:new Date(s.updatedAt).toLocaleDateString()}))
    res.send(SalesWithTime);
  
})


router.post('/sale', async (req,res,next)=>{
  console.log("back end", req.body)
  

    console.log("back end", req.body)
    const sale = new Sale(req.body);
  
    try {
      await sale.save();
      res.status(201).send(sale);
    } catch (e) {
    console.log("back end",e)

      res.status(400).send(e);
    }
})
router.post("/login",function(req,res,next){
  console.log(req.body)
  
  passport.authenticate('local-login',function (err, user, message){
    console.log('here');
    if (err) {
      console.log('here1');
    return res.send(err.message)
    }
    if (user) {
      req.logIn(user, loginErr => {
        if(loginErr) {
          console.log(loginErr)
          return res.json({ success: false, message: loginErr })
        }
        console.log(user)
        return res.json({ success: true, message: "authentication succeeded" })   
     
    })
  }
    if(message){
      console.log("message found")
      return res.send({message:message})
    }
  })(req, res, next);
})
router.post('/createUser',ensureAuth,(req,res,next)=>{
  console.log(req.body)
  var newUser=new User({
    username:req.body.username,
    password:req.body.password,
    role:req.body.customClaims,
    email:req.body.email
  })
  newUser.save(function(err){
    if(err){
      console.log(err)
      res.send({error:true})
      return;
    }
      res.send({save:true})
  })

}) 

router.get('/getUser',(req, res , next)=>{
  res.send(req.user)

})


router.post('/AuthUser',(req, res , next)=>{
  const user = new User(req.user)
  console.log("My user",req.body)
  // res.send(user)
  user.checkPassword(req.body.transferPassword, function(err, isMatch) {
    // if (err) {
    //   console.log( "why this error",err)
    //    res.send(err);
    //    return
    // }
    console.log(err, "is Match", isMatch);
    if (isMatch) {
      res.send(user);
    } else {
        res.status(400).send({
        message: "Username or password is incorrect"
      });
    }
  });


})
router.get('/adminInquire',(req,res,next)=>{ // ensureAuth
    Sale.count({},function(err,totalSale){
      // var month=new Date().getMonth()+1, day=new Date().getDay(),year=new Date().getFullYear();
      if(err){
        console.log(err);
        return
      }
      Sale.count({Time:new Date().toLocaleDateString()},function(err,todaySale){
      if(err){
        console.log(err);
        return;
      }
      Sale.count({$and:[{Status:'Transfer'},{Time:new Date().toLocaleDateString()}]},function(err,todayTransfer){
        if(err){
          console.log(err);
          return;
        }
      Sale.count({Status:'Transfer'},function(err,transfer){
        if(err){
          console.log(err);
          return;
        }
      Sale.count({Status:'Callback'},function(err,callback){
          if(err){
            console.log(err);
            return;
          }
        
      Sale.count({Status:'Pending'},function(err,pending){
            if(err){
              console.log(err);
              return;
              }
      Sale.count({$and:[{Status:'Pending',Time:new Date().toLocaleDateString()}]},function(err,todayPending){
        if(err){
          console.log(err);
          return;
          }
      Sale.count({$and:[{Status:'Callback',Time:new Date().toLocaleDateString()}]},function(err,todayCallback){
                if(err){
                  console.log(err);
                  return;
                  }   
      //  if(req.user.Role==='Admin'){

        User.find({}).select({"role":1,"fullName":1,"email":1}).exec(function(err,stats){
            if(err){
              res.send({error:true})
              return;
            }
            
            let countings={
              totalSale,
                  todaySale,
                  callback,
                  todayCallback,
                  pending,
                  todayPending,
                  transfer,
                  todayTransfer
                  
                }
              res.send({user:req.user,countings,stats})
                return;
            })
          // } 
          // else{
          //   let counting={
          //     totalSale,
          //         todaySale,
          //         callback,
          //         todayCallback,
          //         pending,
          //         todayPending,
          //         transfer,
          //         todayTransfer
                  
          //       }
          //     res.send({data:{user:req.user,countings:counting}})
      
          //         return;
          //       }  
               })  

              })
            })
          })    
        })
      })
    })  
  })
})

router.delete('/users/:id',  (req,res)=>{
 User.findByIdAndRemove(req.params.id).exec(function(err){
   if(err){
     res.send({error:true})
     return 
   }
   console.log('deleted')
   res.send({delete:true})
  })
  // try {
  //   console.log(req.params.id)
  //   const user = await User.findByIdAndRemove({_id:req.params.id})
  //     if(!user){
  //         return res.status(404).send()
  //     }
  //     res.send(user)
  // } catch (e) {
  //   console.log(e)
  //     res.status(400).send(e)        
  // }
})

router.patch("/users/:id", async (req, res) => {
  console.log(req.body)
  const updates = Object.keys(req.body);
  const allowedUpdates = ["username", "email", "password"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates" });
  }

  try {
    const user = await User.findById(req.params.id);

    updates.forEach(update => (user[update] = req.body[update]));
    await user.save();

    // const user = await User.findByIdAndUpdate(req.params.id,req.body,{ new:true , runValidators:true})

    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

  
  router.get('/viewSale',function(req,res,next){
    Sale.findOne({_id:req.query.id},function(err,sale){
      if(err){
        res.send({error:true})
        return;
      }
        res.send(sale)
    })
    })

    router.get("/ViewStatus", function(req, res, next) {
      Sale.findOne({ _id: req.query.id })
        .populate("_Agent", {  "_id": 1, "username": 1, "role": 1})
        .populate("_Closer",{  "_id": 1, "username": 1, "role": 1})
        .select({_Agent:1,_Closer:1,_id:1})
        .exec(function(err, sale) {
          if (err) {
            res.send({ error: true });
            return;
          }
          res.send(sale);
        });
    });  

    router.post("/signup", function (req, res, next) {

      var username = req.body.username;
      var email = req.body.email;

      User.findOne({ $or: [{ username: username }, { email: email }] }, function (err, user) {
    
        if (err) { return next(err); }
        if (user) {
          res.send({message:'Usr already exists with this username or email'})
          return;
        }
        var password = req.body.password;
        var role=req.body.role
        var newUser = new User({
          username: username,
          email: email,
          password: password,
          role:role
        });
        newUser.save(function(err){
          if(err){
            console.log(err)
            return 
          }
          res.send({save:true})
      
        });
  });
});
// router.get('/dashboard',ensureAuth,(req,res,next)=>{
//     res.send(req.user+"shoab")
// });
router.get('/shoaib',(req,res,next)=>{
  res.send({data:'shoaib'})
})
router.get('/logout',ensureAuth,function (req,res,next){
console.log('shoaib')
res.clearCookie('sessionId')
req.logout();
req.session = null;
req.cookies="";
return res.send('logout')
});  
router.post('/logout',ensureAuth,function (req,res,next){
  console.log('shoaib')
  res.clearCookie('sessionId')
  req.sessionID="";
  req.session.destroy(function(err){
    if(err){
      console.log(err)
    }
  })
  req.logout();
  req.session = null;
  req.cookies="";
  return res.send('logout')
  })  
  router.get('/*',(req,res,next)=>{
    res.sendFile(path.resolve(__dirname, '../views', 'index.html')); 
  })
module.exports=router; 