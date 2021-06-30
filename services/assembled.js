require('dotenv').config()
const axios = require('axios')
const fetch = require('node-fetch')
const btoa = require('btoa')

const baseUrl = 'https://api.assembledhq.com/v0'

exports.getEmployees = async () => {
  const options = {
    headers: {
        Authorization: `Basic ${btoa(process.env.ASSEMBLED_TOKEN)}`
    }
  };
  return await (await fetch('https://api.assembledhq.com/v0/agents', options)).json()
}

exports.submitLeaveRequest = async (body) => {
  const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + btoa(`${process.env.ASSEMBLED_TOKEN}:`)
    },
    body: body
  };
  const response = await fetch('https://api.assembledhq.com/v0/activities', options)
  const text = await response.text()
  const status = await response.status
  console.log(status, text)
  return await response
}
