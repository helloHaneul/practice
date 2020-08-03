const express = require('express')
const app = express()
const port = 5000
const bodyparser = require('body-parser')
const cookieparser = require('cookie-parser')

const config = require('./config/key')
const { User } = require('./models/User')

//application/x-ww-form-urlencoded
app.use(bodyparser.urlencoded({extended: true}))

//application/json
app.use(bodyparser.json())
app.use(cookieparser())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello node.js World!'))

/* Register Route */
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

/* Login Route */
app.post('/login', (req, res) => {
  //요청된 이메일을 데이터베이스에서 찾음
  User.findOne({ email: req.body.email}, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 사용자가 없습니다."
      })
    }

    //요청된 이메일이 데이터베이스에 있다면 비밀번호 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) {
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
      }

      //비밀번호까지 맞다면 토큰을 생성하기
      user.generateToken((err, user) => {
        if(err) return status(400).send(err);

        //토큰을 저장(ex. cookie, local-storage)
        //cookie에 저장하는 예제
        res.cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id })
      })
    })  
  })
  
  
  

  
})

app.listen(port, () => console.log('Example app listening on port ' + port))