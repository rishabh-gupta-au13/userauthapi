const express = require("express")
const router = express.Router()
const Register = require('../MODELS/register')
const Admin=require('../MODELS/admin')
const mongoose = require("mongoose")
const jwt=require("jsonwebtoken")
const bcrypt = require("bcryptjs")

router.post('/signup', async (req, res) => {
    try {

        const password = req.body.password;
        const cpassword = req.body.confirm;
        const email = req.body.email;
        const useremail = await Register.findOne({ email: email })
        if (useremail) {
            res.send("email id already exists")
        }
        else if (password === cpassword) {
            const registerUser = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                confirm: req.body.confirm,
                type:req.body.type,
                phone:req.body.phone
            })

            // implementing hashing of password
            const registered = await registerUser.save()
            res.status(201).send("Registration sucesssfull");

        } else {
            res.send("password are not matching")
        }

    } catch (error) {
        console.log(error)
        res.status(400).send();
    }
});
router.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // this is query of mongo db 
        const useremail = await Register.findOne({ email: email });
        console.log(useremail)

        // adding logic for comparing the bcrypt password

        const isMatch = await bcrypt.compare(password, useremail.password)
        console.log(isMatch)
        // isMatch will return true or false 

        if (isMatch) {
            var token = jwt.sign({id:useremail._id},"helllo",{expiresIn:3600})
            res.send({auth:true,token:token})
            // res.status(201).send("sucess")
        } else {
            res.send("invalid login details");
        }

    } catch (error) {
        console.log(error)
        res.status(400).send("invalid login details")
    }

})
router.get('/Userinfo',(req,res)=>{
    const token = req.headers['xtoken'];
    // if tocken not provided
    if(!token) res.send({auth:false,token:'no token provided'})
    // if token provid ask jwt to check
    jwt.verify(token,"helllo",(err,data)=>{
        if(err) res.send('error while fetching')
        // get id from jwt tocken
        //find user on the basis of id
        Register.findById(data.id,(err,data)=>{
            res.send({data})
        })
    })


})
// Routes for admin

router.post("/admin",async (req,res)=>{
    try{
        const email=req.body.email
        const password=req.body.password
        const type=req.body.type
        // console.log(password)
        const adminEmail=await Admin.find({email:email})
        if(adminEmail[0].password === password){
            if(adminEmail[0].type=== type){
                const userDetails =await Register.find()
                const admintoken = jwt.sign({id:adminEmail[0]._id},"helloworls",{expiresIn:3600})
                res.send({userinfo:userDetails,auth:true,token:admintoken})
                // res.status(201).send(userDetails)
            }else{
                res.send("Invalid credentilas ")
            }
        }else{
            res.send("Invalid credentials")
        }


        // console.log(adminEmail)
        // res.send(adminEmail)

    }catch(e){
        res.status(500).send(e)
        console.log(e)
    }
    
})

router.delete("/admindelete",(req,res)=>{

})
module.exports=router