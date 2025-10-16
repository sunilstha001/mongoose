// Import mongoose
const mongoose = require('mongoose');

// 1. Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// 2. Define a Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  age: Number,
  createdAt: { type: Date, default: Date.now }
});

// 3. Create a Model
const User = mongoose.model('User', userSchema);

// 4. Insert Documents
async function createUser() {
  const user = new User({ name: "Sunil", email: "sunil@example.com", age: 25 });
  await user.save();
  console.log("User Created:", user);
}

// 5. Query Documents
async function findUsers() {
  const users = await User.find({ age: { $gte: 18 } }); // all users age >= 18
  console.log("Users Found:", users);
}

// 6. Update Documents
async function updateUser() {
  const user = await User.findOneAndUpdate(
    { name: "Sunil" },   // filter
    { age: 26 },         // update
    { new: true }        // return updated document
  );
  console.log("User Updated:", user);
}

// 7. Delete Documents
async function deleteUser() {
  const result = await User.deleteOne({ name: "Sunil" });
  console.log("User Deleted:", result);
}

// 8. Count Documents
async function countUsers() {
  const count = await User.countDocuments();
  console.log("Total Users:", count);
}

// Example usage
async function main() {
  await createUser();
  await findUsers();
  await updateUser();
  await countUsers();
  await deleteUser();
}

main();
