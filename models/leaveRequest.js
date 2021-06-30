require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const leaveRequestSchema = new mongoose.Schema({
  employeeName: String,
  employeeEmail: String,
  policyType: String,
  startDate: String,
  startDatePortion: String,
  endDate: String,
  endDatePortion: String,
  approverName: String,
  approverEmail: String,
  status: String,
})

leaveRequestSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema)
