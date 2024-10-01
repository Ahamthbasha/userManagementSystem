const userSchema=require("../model/userModel")
const bcrypt=require("bcrypt")
const saltround=10;


const registerUser=async(req,res)=>{
    try {
        const {email,password}=req.body

        const existinguser=await userSchema.findOne({email})
        if(existinguser) {
            return res.render("user/register",{message:"user already exist"});
        }

        const hashedPassword=await bcrypt.hash(password,saltround)

        const newUser=new userSchema({
            email,
            password:hashedPassword,
        });

        await newUser.save();

        res.render("user/login",{message:"user created successfully"})
        

    } catch (error) {
        res.render("user/register",{message:"something went wrong"})
    }
}

const login=async (req,res)=>{
    try {
        const {email,password}=req.body

        const user=await userSchema.findOne({email})
       

        if(!user) return res.render("user/login",{message:"user does not exist"})

        const isMatch=await bcrypt.compare(password,user.password)    

        if(!isMatch) return res.render("user/login",{message:"Incorrect password"})

        req.session.user=true

        res.render("user/userHome",{message:"Login successful"})
    } catch (error) {
        res.render("user/login",{message:"something went wrong"})
    }
}

const logOut=(req,res)=>{
    req.session.destroy()
    res.redirect("/user/login")
}

const loadRegister=(req,res)=>{
    res.render("user/register")
}

const loadLogin=(req,res)=>{
    res.render("user/login")
}

const loadHome=(req,res)=>{
    res.render("user/userHome")
}


module.exports={registerUser,loadRegister,loadLogin,login,loadHome,logOut}