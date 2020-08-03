const express = require('express')
const app = express()
const port = 5000
const bodyparser = require('body-parser')

const config = require('./config/key')
const { User } = require('./models/User')

//application/x-ww-form-urlencoded
app.use(bodyparser.urlencoded({extended: true}))

//application/json
app.use(bodyparser.json())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello node.js World!'))

app.post('/register', (req, res) => {
  // client로부터 가입정보를 받아 데이터베이스에 저장
  const user = new User(req.body)

  user.save((err, doc) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  })

})

//app.listen(port, () => console.log('Example app listening on port ${port}!'))
app.listen(port, () => console.log('Example app listening on port ' + port))