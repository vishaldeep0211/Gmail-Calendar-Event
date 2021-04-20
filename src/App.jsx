import React from 'react'
import env from 'react-dotenv'
import fetchEmails from './services/fetchEmails'

export default function App() {
  const [authobj, setAuthObj] = React.useState(null)
  const [pollIntervalId, setpollIntervalId] = React.useState(null)

  const logInButton = React.useRef(null)
  const logOutButton = React.useRef(null)

  const pollSentBox = () => {
    let epochTime = new Date('April 14, 2021 13:24:34').getTime() / 1000

    localStorage.setItem('lastReqTimeStamp', epochTime)

    var pollingIntervalId = setInterval(() => {
      fetchEmails()
    }, 60000)

    setpollIntervalId(pollingIntervalId)
  }

  const displayButtons = (loginButtonDisplay, logoutButtonDisplay) => {
    logInButton.current.style.display = loginButtonDisplay
    logOutButton.current.style.display = logoutButtonDisplay
  }

  const login = () => {
    authobj.signIn().then(() => {
      console.log(
        `currently logged in user ${JSON.stringify(
          authobj.currentUser.get().getBasicProfile().getName()
        )}`
      )
      displayButtons('none', 'block')
      pollSentBox()
    })
  }

  const logout = () => {
    console.log(
      `logging out user: ${JSON.stringify(
        authobj.currentUser.get().getBasicProfile().getName()
      )}`
    )
    authobj.signOut().then(() => {
      displayButtons('block', 'none')
      clearInterval(pollIntervalId)
    })
  }

  function setInitialLayout(isSignedIn) {
    if (isSignedIn) {
      console.log('LoggedIn')
      displayButtons('none', 'block')
      pollSentBox()
    } else {
      console.log('SignedOut')
      displayButtons('block', 'none')
    }
  }

  React.useEffect(() => {
    const params = {
      apiKey: env.API_KEY,
      clientId: env.CLIENT_ID,
      scope: env.SCOPE,
      discoveryDocs: [
        'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
        'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
      ],
    }

    window.gapi.load('client:auth2', () => {
      window.gapi.client.init(params).then(() => {
        setAuthObj(window.gapi.auth2.getAuthInstance())
        setInitialLayout(window.gapi.auth2.getAuthInstance().isSignedIn.get())
      })
    })
  }, [])

  return (
    <div>
      <button style={{ display: 'none' }} ref={logInButton} onClick={login}>
        LogIn With Google
      </button>
      <button style={{ display: 'none' }} ref={logOutButton} onClick={logout}>
        LogOut
      </button>
    </div>
  )
}
