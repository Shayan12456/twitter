const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const multer = require("multer");
// const upload = multer({dest: "upload/"});
const {storage} = require("./cloudConfig.js");
const upload = multer({storage});

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// getting-started.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;;

const MONGO_URL = process.env.ATLAS;

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}
const twitterSchema = Schema({
    username: String,
    hashname: String,
    comments: Number,
    likes: Number,
    text: String,
    image: {
        // type: String,
        // default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
        // set: (v) => v === ""?"https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80":v,
        url: String,
        filename: String
    },
    profileImage: {
        url: String,
        filename: String
    }
    // photo: {
    //     url: String,
    //     fileName: String
    // },
    // image: {
    //     url: String,
    //     fileName: String
    // },
});
const Post = mongoose.model("Post", twitterSchema);

app.get("/twitter", async (req, res)=>{
    const posts = await Post.find({});
    res.render("index.ejs", {posts});
});


app.get("/twitter/new", (req, res)=>{
    res.render("new.ejs");
});
const cpUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'profileImage', maxCount: 1 }])
app.post("/twitter", cpUpload, async (req, res)=>{
    // let url = req.file;
    // let filename =  req.file;
    // console.log(url);
    // console.log(filename);
    let post = req.body;
    const data = new Post({
        username: post.username,
        hashname: post.hashname,
        comments: 0,
        text: post.text,
        likes: 0,
        image: {
            url: (req.files.image)?req.files['image'][0].path:"",
            filename: (req.files.image)?req.files["image"][0].filename:"",
        },
        profileImage: {
            url: (req.files["profileImage"])?req.files['profileImage'][0].path:"",
            filename: (req.files["profileImage"])? req.files["profileImage"][0].filename:"",
        }
    });
    
    await data.save();
    res.redirect("/twitter");
});


app.get("/twitter/search/username=", async (req, res)=>{
    // console.log(req.query.username);
    const foundUser = await Post.find({username: req.query.username});
    if(foundUser.length !== 0){
        let post = foundUser;
        res.render("post.ejs", {post})
    }else{
        res.render("notfound.ejs");
    }
    console.log(foundUser);
});

app.put("/twitter/:id/edit", async (req, res)=>{
    const referer = req.get('Referer');
    console.log("referer");
        const { id } = req.params;
        const post = await Post.findById(id);
    
        post.likes += 1;
        await post.save();

        res.redirect(referer);
});
app.listen(port, ()=>{
    console.log("app is listening");
});
