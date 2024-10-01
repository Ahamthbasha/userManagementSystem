const adminModel=require("../model/adminModel")
const bcrypt=require("bcrypt")
const userModel=require("../model/userModel")

const loadLogin = async(req,res) =>{
    res.render("admin/login")
}

const login=async(req,res)=>{
    try {
        const {email,password}=req.body

        const admin=await adminModel.findOne({email})

        if(!admin) return res.render("admin/login",{message:"Invalid credentials"})

        const isMatch=await bcrypt.compare(password,admin.password)

        if(!isMatch) return res.render("admin/login",{message:"Invalid Credentials"})

        req.session.admin = true

        res.redirect("/admin/dashboard")
        
    } catch (error) {
        console.error(error)
        res.send(error)
    }
}

const loadDashboard=async(req,res)=>{
    try {
        const admin=req.session.admin
        if(!admin) return res.redirect("/admin/login")
        const users=await userModel.find({})
    res.render("admin/dashboard",({users}))
    } catch (error) {
        console.error(error)
    }
}

const editUser = async (req, res) => {
    try {
        const { email, password, id } = req.body;
        if (!id) {
            return res.status(400).send("User ID is required");
        }
        const updateData = { email };
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }
        await userModel.findOneAndUpdate({ _id: id }, { $set: updateData });
        res.redirect("/admin/dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

const deleteUser=async (req,res)=>{
    try {
        const {id}=req.params
        const user=await userModel.findOneAndDelete({_id:id})
        res.redirect("/admin/dashboard")
    } catch (error) {
        console.log(error)
    }
}

const addUser=async(req,res)=>{
    try {
        const {email,password}=req.body
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser=new userModel({
            email,
            password:hashedPassword
        })
        await newUser.save()
        res.redirect("/admin/dashboard")
    } catch (error) {
        console.log(error)
    }
}

const logOut=async(req,res)=>{
    req.session.destroy()
    res.redirect("/admin/login")
}

module.exports={loadLogin,login,loadDashboard,editUser,deleteUser,addUser,logOut}