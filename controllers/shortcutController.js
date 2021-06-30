exports.openModal = async ({ shortcut, ack, client }) => {

  try {
    await ack()

    const result = await client.views.open({
      trigger_id: shortcut.trigger_id,
      view: {
        title: {
            type: "plain_text",
            text: "Leave Lion",
            emoji: true
        },
        submit: {
            type: "plain_text",
            text: "Submit",
            emoji: true
        },
        type: "modal",
        // View identifier
        callback_id: 'view_1',
        close: {
            "type": "plain_text",
            "text": "Cancel",
            "emoji": true
        },
        blocks: [
            {
                type: "input",
                block_id: "policyType",
                element: {
                    type: "static_select",
                    placeholder: {
                        type: "plain_text",
                        text: "Select an item",
                        emoji: true
                    },
                    options: [
                        {
                            text: {
                                type: "plain_text",
                                text: "Holiday",
                                emoji: true
                            },
                            value: "holiday"
                        },
                        {
                            text: {
                                type: "plain_text",
                                text: "Sickness",
                                emoji: true
                            },
                            value: "sickness"
                        }
                    ],
                    action_id: "policyType"
                },
                label: {
                    type: "plain_text",
                    text: "Policy",
                    emoji: true
                }
            },
            {
                type: "input",
                block_id: "startDate",
                element: {
                    type: "datepicker",
                    initial_date: new Date().toJSON().slice(0,10).replace(/-/g,'-'),
                    placeholder: {
                        type: "plain_text",
                        text: "Select a date",
                        emoji: true
                    },
                    action_id: "startDate"
                },
                label: {
                    type: "plain_text",
                    text: "From",
                    emoji: true
                }
            },
            {
                type: "input",
                block_id: "startDatePortion",
                element: {
                    type: "static_select",
                    placeholder: {
                        type: "plain_text",
                        text: "Select an item",
                        emoji: true
                    },
                    options: [
                        {
                            text: {
                                type: "plain_text",
                                text: "All day",
                                emoji: true
                            },
                            value: "All day"
                        },
                        {
                            text: {
                                type: "plain_text",
                                text: "Morning",
                                emoji: true
                            },
                            value: "morning"
                        },
                        {
                            text: {
                                type: "plain_text",
                                text: "Afternoon",
                                emoji: true
                            },
                            value: "afternoon"
                        }
                    ],
                    action_id: "startDatePortion"
                },
                label: {
                    type: "plain_text",
                    text: "Period",
                    emoji: true
                }
            },
            {
                type: "input",
                block_id: "endDate",
                element: {
                    type: "datepicker",
                    initial_date: new Date().toJSON().slice(0,10).replace(/-/g,'-'),
                    placeholder: {
                        type: "plain_text",
                        text: "Select a date",
                        emoji: true
                    },
                    action_id: "endDate"
                },
                label: {
                    type: "plain_text",
                    text: "To",
                    emoji: true
                }
            },
            {
                type: "input",
                block_id: "endDatePortion",
                element: {
                    type: "static_select",
                    placeholder: {
                        type: "plain_text",
                        text: "Select an item",
                        emoji: true
                    },
                    options: [
                        {
                            text: {
                                type: "plain_text",
                                text: "All day",
                                emoji: true
                            },
                            value: "All day"
                        },
                        {
                            text: {
                                type: "plain_text",
                                text: "Morning",
                                emoji: true
                            },
                            value: "morning"
                        },
                        {
                            text: {
                                type: "plain_text",
                                text: "Afternoon",
                                emoji: true
                            },
                            value: "afternoon"
                        }
                    ],
                    action_id: "endDatePortion"
                },
                label: {
                    type: "plain_text",
                    text: "Period",
                    emoji: true
                }
            }
        ]
    }
    })

  }
  catch (error) {
    console.error(error)
  }
}
