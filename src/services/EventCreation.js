const createEvent = (subject, recipientList) => {
  const timeZone = 'Asia/Kolkata'
  let leaveType = subject.includes('planned')
    ? 'Planned Leave'
    : 'Unplanned Leave'

  let usersList = ['primary']
  usersList = usersList.concat(recipientList)

  console.log(usersList)

  var event = {
    summary: leaveType,
    start: {
      //This dateTime should ideally be come from the Email's Subject
      dateTime: '2021-04-15T10:00:00',
      timeZone: timeZone,
    },
    end: {
      dateTime: '2021-04-15T17:00:00',
      timeZone: timeZone,
    },
  }

  usersList.forEach((userEmail) => {
    //TO remove the leading and trailing spaces
    userEmail = userEmail.trim()

    //If To field has name of the recipient as well along with email e.g Vishal Gupta <vgupta@radicleinc.com>
    if (userEmail.includes('<'))
      userEmail = userEmail.split('<')[1].split('>')[0]

    window.gapi.client.calendar.events
      .insert({
        calendarId: userEmail,
        resource: event,
      })
      .execute((createdEvent) => {
        console.log(createdEvent)
      })
  })
}

export default createEvent
