//most of this code i had to refer back to the docs on free full stack open
//but i do understand what is happing completely
//This is a once of file to test the database
const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}

//it's giving me undefined
const password = process.argv[2]
console.log(process.argv)

const url = `mongodb+srv://RamseyC4:${password}@atlascluster.6snouxo.mongodb.net/bookLibrary?appName=bookCollection`

mongoose.set("strictQuery", false)
mongoose.connect(url, { family: 4 })

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: String,
  genre: String,
  read: String,
  id: String,
})

const BooKApi = mongoose.model("BooKApi", bookSchema)

const book = new BooKApi({
  title: "The Silent Patient",
  author: "Alex Michaelides",
  year: "2019",
  genre: "Psychological Thriller",
  read: true,
  id: "1",
})

book.save().then(() => {
  console.log("new book record saved")
  mongoose.connection.close()
})
