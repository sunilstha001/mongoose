
const mongoose = require("mongoose");

// Connect to DB
mongoose.connect("mongodb://localhost:27017/myDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schema
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// Create Model
const User = mongoose.model("User", userSchema);

// Adding data in table
await User.create({ name: "Sunil", age: 22, email: "sunil@test.com" });
const user = new User({ name: "Shrestha", age: 23 });
await user.save();

// Finding the elements in database
await User.find();                       // all users
await User.findOne({ name: "Sunil" });   // first match
await User.findById("objectId");         // by ID
await User.find({ age: { $gt: 18 } });   // condition

//Delete
await User.deleteOne({ name: "Sunil" });
await User.deleteMany({ age: { $lt: 18 } });
await User.findByIdAndDelete(id);



// Single document
const emp = new Employee({ name: "Sunil", empId: 101, department: ["IT"], salary: 20000 });
await emp.save();

// OR shortcut
const emp2 = await Employee.create({ name: "Ram", empId: 102, department: ["HR"], salary: 15000 });

// Multiple documents
await Employee.insertMany([
  { name: "Amit", empId: 103, department: ["Finance"], salary: 25000 },
  { name: "Sara", empId: 104, department: ["IT"], salary: 22000 }
]);


// All documents
const allEmployees = await Employee.find();

// Filter documents
const itEmployees = await Employee.find({ department: "IT" }); // exact match

// Comparison filters
const highSalary = await Employee.find({ salary: { $gt: 20000 } }); // salary > 20000
const rangeSalary = await Employee.find({ salary: { $gte: 15000, $lte: 25000 } });

// Logical operators
const filter = await Employee.find({ $or: [{ department: "IT" }, { salary: { $gt: 22000 } }] });

// Get single document
const emp101 = await Employee.findOne({ empId: 101 });

// Get by ID
const empById = await Employee.findById("64f3e0a1234abcd123456789");


// Update one
await Employee.updateOne({ empId: 101 }, { salary: 21000 });

// Update and get new document
const updatedEmp = await Employee.findOneAndUpdate(
  { empId: 102 },
  { salary: 18000 },
  { new: true, runValidators: true }
);

// Update multiple
await Employee.updateMany({ department: "IT" }, { $set: { salary: 23000 } });


// Delete one
await Employee.deleteOne({ empId: 101 });

// Delete multiple
await Employee.deleteMany({ department: "HR" });

// Delete by ID
await Employee.findByIdAndDelete("64f3e0a1234abcd123456789");






// Employees with salary > 20000 and department IT
const filtered = await Employee.find({
  salary: { $gt: 20000 },
  department: "IT"
});

// Employees whose name starts with S (case-insensitive)
const nameS = await Employee.find({ name: { $regex: /^S/, $options: "i" } });

const sorted = await Employee.find().sort({ salary: -1 }); // descending
const limited = await Employee.find().limit(5); // first 5
const skipAndLimit = await Employee.find().skip(5).limit(5); // pagination
 
const count = await Employee.countDocuments({ department: "IT" });

const result = await Employee.updateMany(
  { department: "HR" },       // Filter: only HR department
  { $inc: { salary: 11 } }    // Increment salary by 11
);

console.log(result);



const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    validate: {
      validator: function (v) {
        return v.length >= 2 && v.length <= 50;
      },
      message: props => `${props.value} is not valid! Name should be 2-50 characters.`
    }
  },
  empId: {
    type: Number,
    required: true,
    unique: true
  },
  department: {
    type: [String],
    required: true
  },
  salary: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return v > 10000 && v % 1000 === 0;
      },
      message: props => `${props.value} is invalid! Salary must be > 10,000 & multiple of 1,000.`
    }
  },
  joiningDate: {
    type: Date,
    default: Date.now
  }
});



employeeSchema.pre('save', function (next) {
  if (this.name) {
    this.name = this.name.toUpperCase();
  }
  console.log("Pre-save: Capitalized name");
  next();
});



employeeSchema.post('save', function (doc, next) {
  console.log(`Post-save: Employee ${doc.name} added successfully!`);
  next();
});
