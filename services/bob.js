require('dotenv').config()
const axios = require('axios')
const fetch = require('node-fetch')

const baseUrl = 'https://api.hibob.com/v1'

exports.getEmployee = (identifier) => {
  const headers = { Accept: 'application/json', Authorization: process.env.BOB_EMPLOYEE_TOKEN }
  const request = axios.get(`${baseUrl}/people/harry.wright@prolific.co`, { headers: headers })
  return request.then(response => response.data)
}

exports.submitLeaveRequest = (id, body) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.BOB_TIMEOFF_TOKEN
    },
    body: body
  };
  const request = fetch(`${baseUrl}/timeoff/employees/${id}/requests`, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error('error:' + err));
}
