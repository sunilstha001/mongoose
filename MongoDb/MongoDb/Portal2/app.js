const express = require("express");
const app = express();
const connectDb = require("./model/db");
const Student = require("./model/collectionStudent");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set("view engine", "ejs");

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
connectDb();

app.get("/", async(req,res)=>{  


  const limit = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 1;

  const skip = (page - 1) * limit;
  const data = await Student.find().skip(skip).limit(limit);
  const totalStudents = await Student.countDocuments();

  res.render("index", {
    data,
    currentPage: page,
    totalPages: Math.ceil(totalStudents / limit),
    limit,
  });
})

app.post("/addStudent", async (req,res)=>{
    const {name,section,marks}=req.body;

    await Student.create({
        name,
        section,
        marks
    });
    res.redirect('/');
    
});
app.post("/deleteStudent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).send("Something went wrong while deleting!");
  }
});

app.get("/editStudent/:id",async (req,res)=>{

  const {id}=req.params;
  const student = await Student.findById(id);
  res.render("edit",{student});
})

app.post("/updateStudent/:id",async(req,res)=>{
  const {id} = req.params;
  const {name,section,marks}=req.body;

  await Student.findByIdAndUpdate(id,{
    name,
    section,
    marks
  })
  res.redirect("/");
})


app.get("/filter", async (req, res) => {
  try {
    const { condition, marks } = req.query;
    const filterMarks = parseInt(marks);

    let query = {};
    if (filterMarks) {
      if (condition === "greater") {
        query = { marks: { $gte: filterMarks } };
      } else if (condition === "less") {
        query = { marks: { $lte: filterMarks } };
      }
    }
    // console.log(query);

    const data = await Student.find(query);

    res.render("index", {
      noRecord:data.length===0, // in case if no data found
      data,
      currentPage: 1, // Filtering results in a single page
      totalPages: 1, // So there is only one page
      limit: data.length // Limit is the total number of filtered students
    });
  } catch (err) {
    console.error("Error filtering students:", err);
    res.status(500).send("Something went wrong while filtering!");
  }
});