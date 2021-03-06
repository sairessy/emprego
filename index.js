const express = require("express")
const Datastore = require("nedb")
const cors = require("cors")

const app = express()
const collections = {
  jobs: new Datastore("./src/collections/jobs.db")
}

collections.jobs.loadDatabase()

app.use(express.static("public"))
app.use(express.json({limit: "2mb"}))
app.use(cors({
  origin: "*"
}))

const PORT = 3000 || process.env.PORT

app.listen(PORT, () => {
  console.log("Server On!!!")
})

// Pages
app.get("/page/link/:id", (req, res) => {
  res.sendFile(__dirname + "/public/link.html")
})


// Api
app.post("/addjob", (req, res) => {
  const data = req.body
  const job = {
    ...data,
    date: Date.now().toString()
  }

  collections.jobs.insert(job, (err, doc) => {
    res.json({})
  })
})

app.get("/jobs/page/:limit", (req, res) => {
  const limit = req.params.limit
  collections.jobs.find({}).limit(limit).exec((err, data) => {
    collections.jobs.count({}, (errr, count) => {
      res.json({data, reached: count <= data.length})
    })
  })
})

app.get("/jobs/category/:cat/page/:limit", (req, res) => {
  const cat = req.params.cat
  const limit = req.params.limit
  collections.jobs.find({category: cat}).limit(limit).exec((err, data) => {
    collections.jobs.count({category: cat}, (errr, count) => {
      res.json({data, reached: count <= data.length})
    })
  })
})

app.get("/jobs/search/:text/page/:limit", (req, res) => {
  const text = req.params.text

  collections.jobs.find({}, (err, data) => {
    const results = data.filter(d => d.title.toLowerCase().includes(text.toLowerCase()))
    res.json({data: results, reached: false})
  })
})

app.get("/update", (req, res) => {
  collections.jobs.update({}, {$set: {removed: false} }, {multi: true}, (err, numReplaced) => {})
  res.json({})
})

app.get("/job/:id", (req, res) => {
  collections.jobs.findOne({_id: req.params.id}, (err, job) => {
    const link = job.link;
    res.json({link})
  })
})