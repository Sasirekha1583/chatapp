import React, { useRef, useState, useEffect } from "react"

import axios from 'axios'
import { useHistory } from "react-router-dom"
import { ChatEngine } from 'react-chat-engine'

import { useAuth } from "../contexts/AuthContext"

import { auth } from "../firebase"
import logo from "./logo.PNG"
export default function Chats() {
  const didMountRef = useRef(false)
  const [ loading, setLoading ] = useState(true)
  const { user } = useAuth()
  const history = useHistory()

  async function handleLogout() {
    await auth.signOut()
    history.push("/")
  }

  async function getFile(url) {
  try {
    let response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    let data = await response.blob();
    return new File([data], "test.jpg", { type: 'image/jpeg' });
  } catch (error) {
    console.error('getFile error:', error);
    throw error; // Re-throw the error for the calling code to handle
  }
}

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true

      if (!user || user === null) {
        history.push("/")
        return
      }
      
      // Get-or-Create should be in a Firebase Function
      axios.get(
        'https://api.chatengine.io/users/me/',
        { headers: { 
          "project-id": '9dc3c073-e697-4c40-bd5a-2ebb13265ba2',
          "user-name": user.email,
          "user-secret": user.uid
        }}
      )

      .then(() => setLoading(false))

      .catch(e => {
        let formdata = new FormData()
        formdata.append('email', user.email)
        formdata.append('username', user.email)
        formdata.append('secret', user.uid)

        getFile(user.photoURL)
        .then(avatar => {
          formdata.append('avatar', avatar, avatar.name)

          axios.post(
            'https://api.chatengine.io/users/',
            formdata,
            { headers: { "private-key": process.env.REACT_APP_CHAT_ENGINE_KEY }}
          )
          .then(() => setLoading(false))
          .catch(e => console.log('e', e.response))
        })
      })
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    }
  }, [user, history])
  

  if (!user || loading) return <div />

  return (
    <div className='chats-page' >
   
      <div className='nav-bar'>
        <div className='logo-tab'>
        <img src={logo} alt='WhiChat Logo' style={ {width: '50px', height: '50px', marginRight: '10px' }}/>
          WhiChat
        </div>

        <div onClick={handleLogout} className='logout-tab'>
          Logout
        </div>
      </div>

      <ChatEngine 
      
        height='calc(100vh - 66px)'
        projectID='9dc3c073-e697-4c40-bd5a-2ebb13265ba2'
        userName={user.email}
        userSecret={user.uid}
      />
    </div>
  )
}