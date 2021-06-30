const LeaveRequest = require('../models/leaveRequest')
const bobService = require('../services/bob')
const assembledService = require('../services/assembled')

exports.handleApprovedLeaveRequest = async ({ action, ack, client }) => {
  await ack()

  try {
    const info = action.value.split('-')

    const employeeMessage = await client.chat.postMessage({
      channel: info[0],
      text: 'Request approved!',
      blocks: [
    		{
    			type: "section",
    			text: {
    				type: "mrkdwn",
    				text: `Your ${info[1]} request from ${info[2]} to ${info[3]} has just been *approved* by ${info[4]}! :white_check_mark:`
    			}
    		}
    	]
    });

    const managerMessage = await client.chat.postMessage({
      channel: info[6],
      text: 'Request approved!',
      blocks: [
    		{
    			type: "section",
    			text: {
    				type: "mrkdwn",
    				text: `You have just *approved* a request from ${info[2]} to ${info[3]}! :white_check_mark:`
    			}
    		}
    	]
    });

    const leaveRequest = {
      status: 'approved',
    }

    const updatedLeaveRequest = await LeaveRequest.findByIdAndUpdate(info[5], leaveRequest, { new: true })

    const bobEmployeeData = await bobService.getEmployee(updatedLeaveRequest.employeeEmail)

    const bobBody = await JSON.stringify({
              policyType: updatedLeaveRequest.policyType.charAt(0).toUpperCase() + updatedLeaveRequest.policyType.slice(1),
              startDate: updatedLeaveRequest.startDate,
              startDatePortion: updatedLeaveRequest.startDatePortion.split(" ").join("_").toLowerCase(),
              endDate: updatedLeaveRequest.endDate,
              endDatePortion: updatedLeaveRequest.endDatePortion.split(" ").join("_").toLowerCase(),
              skipManagerApproval: true,
              approver: bobEmployeeData['work']['reportsTo']['id']
            })

    const bobRequest = await bobService.submitLeaveRequest(bobEmployeeData.id, bobBody)

    const employeeAssembledId = await getAssembledId(updatedLeaveRequest.employeeEmail)

    const assembledBody = await JSON.stringify({
      start_time: parseDate(updatedLeaveRequest.startDate, updatedLeaveRequest.startDatePortion, true),
      end_time: parseDate(updatedLeaveRequest.endDate, updatedLeaveRequest.endDatePortion, false),
      agent_id: employeeAssembledId,
      type_id: getAssembledActivityId(updatedLeaveRequest.policyType)
      })

    const assembledRequest = await assembledService.submitLeaveRequest(assembledBody)
  }
  catch (error) {
    console.error(error);
  }
}

exports.handleDeniedLeaveRequest = async ({ action, ack, client }) => {
  await ack()

  try {
    const info = action.value.split('-')

    const result = await client.chat.postMessage({
      channel: info[0],
      text: 'Request approved',
      blocks: [
    		{
    			type: "section",
    			text: {
    				type: "mrkdwn",
    				text: `Your ${info[1]} request from ${info[2]} to ${info[3]} has just been *denied* by ${info[4]}! :x:`
    			}
    		}
    	]
    });

    const managerMessage = await client.chat.postMessage({
      channel: info[6],
      text: 'Request approved',
      blocks: [
    		{
    			type: "section",
    			text: {
    				type: "mrkdwn",
    				text: `You have just *denied* a request from ${info[2]} to ${info[3]}! :x:`
    			}
    		}
    	]
    });

  const leaveRequest = {
    status: 'denied',
  }

  LeaveRequest.findByIdAndUpdate(info[5], leaveRequest, { new: true })
    .then(updatedLeaveRequest => {
    })
    .catch(error => next(error))

  }
  catch (error) {
    console.error(error);
  }
}

const getAssembledId = async (email) => {
  const response = await assembledService.getEmployees()
  const agents = Object.values(response.agents)
  const id = agents.find(agent => agent.email === email).id
  return id
}

const parseDate = (date, portion, isStartDate) => {
  let time = ''
  if (portion === 'all_day' && isStartDate === true) {
    time = '00:00:00'
  } else if (portion === 'all_day' && isStartDate === false) {
    time = '24:00:00'
  } else if (portion === 'morning' && isStartDate === true) {
    time = '00:00:00'
  } else if (portion === 'morning' && isStartDate === false) {
    time = '12:00:00'
  } else if (portion === 'afternoon' && isStartDate === true) {
    time = '12:00:00'
  } else if (portion === 'afternoon' && isStartDate === false) {
    time = '24:00:00'
  }

  const timeStampMilliseconds = Number(Date.parse(`${date} ${time}`))
  const timeStampSeconds = timeStampMilliseconds / 1000

  return timeStampSeconds
}

const getAssembledActivityId = (policyType) => {
  if (policyType === 'holiday') {
    return '8f32ae29-66ac-4a39-8541-fa2b6f2d9983'
  } else if (policyType === 'sickness') {
    return "b5590baf-fdd0-41f8-900f-f2bd06fc0370"
  }
}
