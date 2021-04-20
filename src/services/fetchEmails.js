import createEvent from './EventCreation'

export default function fetchEmails() {
  window.gapi.client.gmail.users.messages
    .list({
      //me is a special keyword which is used for the currently authenticated user
      userId: 'me',
      labelIds: 'SENT',
      //this query will fetch all the emails sent after the lastReqTimeStamp
      q: 'after:' + localStorage.getItem('lastReqTimeStamp'),
    })
    .then(function (response) {
      //console.log(response)
      if (response.result.resultSizeEstimate > 0) {
        response.result.messages.map((msg) =>
          window.gapi.client.gmail.users.messages
            .get({
              userId: 'me',
              id: msg.id,
            })
            .then((res) => {
              //console.log(res)
              var emailHeaders = res.result.payload.headers

              //Extracting the Subject of the mail and Recipient List from the Headers
              var recipentWithSubject = emailHeaders.filter((val) => {
                return val.name === 'Subject' || val.name === 'To'
              })

              // Structure of recipentWithSubject will be [{name:'Subject', value:''}, {name:'To', value:''}]
              let subject = recipentWithSubject[0].value
              let recipient = recipentWithSubject[1].value

              //Case of multiple recipient e.g. vishaldeep.gupta606@gmail.com, vishaldeep3007@gmail.com
              if (recipient.includes(',')) recipient = recipient.split(',')

              if (subject.toLowerCase().includes('leave')) {
                //console.log('Leave message')
                createEvent(subject, recipient)
              }
              let time = parseInt(localStorage.getItem('lastReqTimeStamp')) + 60
              localStorage.setItem('lastReqTimeStamp', time)
            })
        )
      } else console.log('No New Messages..')
    })
}
