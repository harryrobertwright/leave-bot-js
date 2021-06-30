const LeaveRequest = require('../models/leaveRequest')
const bobService = require('../services/bob')

exports.storeLeaveRequest = async ({ ack, body, view, client }) => {
  await ack()

  try {
    const employeeInfo = await client.users.info({
      user: body['user']['id']
    })

    bobService
    .getEmployee(employeeInfo['user']['profile']['email'])
    .then(response => {
      const leaveRequest = new LeaveRequest({
        employeeName: employeeInfo['user']['profile']['real_name'],
        employeeEmail: employeeInfo['user']['profile']['email'],
        policyType: view['state']['values']['policyType']['policyType']['selected_option']['value'],
        startDate: view['state']['values']['startDate']['startDate']['selected_date'],
        startDatePortion: view['state']['values']['startDatePortion']['startDatePortion']['selected_option']['value'],
        endDate: view['state']['values']['endDate']['endDate']['selected_date'],
        endDatePortion: view['state']['values']['endDatePortion']['endDatePortion']['selected_option']['value'],
        approverName: `${response['work']['reportsTo']['firstName']} ${response['work']['reportsTo']['surname']}`,
        approverEmail: response['work']['reportsTo']['email'],
        status: 'pending',
      })
      leaveRequest.save().then(async (savedLeaveRequest) => {
        try {
          const managerInfo = await client.users.lookupByEmail({
            email: response['work']['reportsTo']['email']
          });
          try {
          const result = await client.chat.postMessage({
            channel: managerInfo['user']['id'],
            text: 'New leave request received!',
            blocks: [
            	{
            		type: "section",
            		text: {
            			type: "mrkdwn",
            			text: `You have received a new leave request:\n*${leaveRequest.employeeName} - New ${leaveRequest.policyType} request*`
            		}
            	},
            	{
            		type: "section",
            		fields: [
            			{
            				type: "mrkdwn",
            				text: `*From:*\n${leaveRequest.startDate.split("-").reverse().join('/')}\n`
            			},
            			{
            				type: "mrkdwn",
            				text: `*Period:*\n${leaveRequest.startDatePortion}\n`
            			},
            			{
            				type: "mrkdwn",
            				text: `*To:*\n${leaveRequest.endDate.split("-").reverse().join('/')}\n`
            			},
            			{
            				type: "mrkdwn",
            				text: `*Period:*\n${leaveRequest.endDatePortion}\n`
            			}
            		]
            	},
            	{
            		type: "context",
            		elements: [
            			{
            				type: "plain_text",
            				text: `${leaveRequest.id}\n`,
            				emoji: true
            			}
            		]
            	},
            	{
            		type: "actions",
            		elements: [
            			{
            				type: "button",
                    action_id: "approve",
            				text: {
            					type: "plain_text",
            					emoji: true,
            					text: "Approve"
            				},
            				style: "primary",
            				value: `${body['user']['id']}-${leaveRequest.policyType}-${leaveRequest.startDate.split("-").reverse().join('/')}-${leaveRequest.endDate.split("-").reverse().join('/')}-${leaveRequest.approverName}-${leaveRequest.id}-${managerInfo['user']['id']}`
            			},
            			{
            				type: "button",
                    action_id: "deny",
            				text: {
            					type: "plain_text",
            					emoji: true,
            					text: "Deny"
            				},
            				style: "danger",
            				value: `${body['user']['id']}-${leaveRequest.policyType}-${leaveRequest.startDate.split("-").reverse().join('/')}-${leaveRequest.endDate.split("-").reverse().join('/')}-${leaveRequest.approverName}-${leaveRequest.id}-${managerInfo['user']['id']}`
            			}
            		]
            	}
            ]
          });
          }
          catch (error) {
            console.error(error);
          }
          try {
          const result = await client.chat.postMessage({
            channel: body['user']['id'],
            text: 'New leave request submitted!',
            blocks: [
            	{
            		type: "section",
            		text: {
            			type: "mrkdwn",
            			text: `You have submitted a new leave request:\n*${leaveRequest.employeeName} - New ${leaveRequest.policyType} request*`
            		}
            	},
            	{
            		type: "section",
            		fields: [
            			{
            				type: "mrkdwn",
            				text: `*From:*\n${leaveRequest.startDate.split("-").reverse().join('/')}\n`
            			},
            			{
            				type: "mrkdwn",
            				text: `*Period:*\n${leaveRequest.startDatePortion}\n`
            			},
            			{
            				type: "mrkdwn",
            				text: `*To:*\n${leaveRequest.endDate.split("-").reverse().join('/')}\n`
            			},
            			{
            				type: "mrkdwn",
            				text: `*Period:*\n${leaveRequest.endDatePortion}\n`
            			}
            		]
            	},
            	{
            		type: "context",
            		elements: [
            			{
            				type: "plain_text",
            				text: `${leaveRequest.id}\n`,
            				emoji: true
            			}
            		]
            	}
            ]
          });
          }
          catch (error) {
            console.error(error);
          }
        }
        catch (error) {
          console.error(error);
        }
      })
    })
  }
  catch (error) {
    console.error(error);
  }
}
