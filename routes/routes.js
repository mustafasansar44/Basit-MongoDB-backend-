const express = require("express");
const router = express.Router();
const Post = require("../Model/Post");
const path = require("path");

// GET APİ POSTS
router.get("/api/posts", (req, res) => {
  Post.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// GET RENDER PAGE
router.get("/", (req, res) => {
  if (req.session._id) {
    Post.find().lean().then(data => {
      const dataLength = data.length
      res.render("home", {dataLength});
    })
    
  } else {
    res.redirect("/user");
  }
});

router.get("/addpost", (req, res) => {
  if (req.session._id) {
    res.render("addpost");
  } else {
    res.redirect("/user");
  }
});

router.post("/addpost/add", (req, res) => {
  try {
    if(req.files){
        const image_name = req.files.image.name;
        req.files.image.mv(
          path.resolve() + "/static/images/" + image_name,
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
        const image_folder = path.resolve(
          __dirname,
          "../static/images/",
          image_name
        );
    
        Post.create({
          ...req.body,
          image: image_name,
        });
        res.redirect("/addpost");
    }else{
      res.redirect("/addpost?err=notfile")
    }
  } catch (err) {
    console.log(err);
  }
});
router.get("/allpost", (req, res) => {
  if (req.session._id) {
    Post.find()
      .lean()
      .then((data) => {
        res.render("allpost", { data });
      });
  } else {
    res.redirect("/user");
  }
});
router.get("/logout", (req, res) => {
  req.session._id = null;
  res.redirect("/user");
});

router.get("/setting/edit/:id", (req, res) => {
    Post.findById(req.params.id).lean().then(data => {
        res.render("editpost", {data})
    })   
})

// UPDATE POST
router.post("/setting/edit/add/:id", (req, res) => {
    Post.findOne({_id:  req.params.id}).then(post => {
        post.title = req.body.title
        post.description = req.body.description
        post.active = req.body.active
        if(req.files){
            const image_name = req.files.image.name;
            req.files.image.mv(
                path.resolve() + "/static/images/" + image_name,
                (err) => {
                  if (err) {
                    console.log(err);
                  }
                }
            );
            post.image = image_name
        }
        
        post.save().then(data => {
            res.redirect('/allpost')
        }).catch(err=>{console.log(err)})
    })
})


//DELETE POST
router.post("/setting/delete/:id", (req, res) => {  
    Post.findOne({ _id: req.params.id}, (err, post) => {
        if (err) {
            return;
        }
        post.remove((err) => {
            if(err){
                console.log(err)
            }else{
                res.redirect('/allpost')
            }

        });
    });
})








// router.get("*", (req, res) => {
//     res.redirect("/");
// });

module.exports = router;
