// 개발 이후 배포한 상태에서 이용 (ex.Heroku)
// Heroku에 명시된 이름과 동일한 환경변수
module.exports = {
    mongoURI: process.env.MONGO_URI
}