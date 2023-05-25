import './App.scss';
import { useState,useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {PageContext} from './context/PageContext'
import Header from './header/Header';
import HomePage from './content/HomePage/HomePage';
import Search from './content/Search/Search';
import User from './content/User/User';
import Client from './content/Client/Client';
import Group from './content/Group/Group';
import Login from './content/Login/Login';
import Register from './content/Register/Register';
import Container from './content/Container/Container';
import Friend from './content/Friend/Friend';
import Groups from './content/Groups/Groups'

function App() {
  const [isLogin,setIsLogin] = useState(JSON.parse(localStorage.getItem('isLogin')) ? true : false)
  const [user,setUser] = useState(JSON.parse(localStorage.getItem('user')) ?? {})
  const [searchValue,setSearchValue] = useState('')
  const [friends,setFriends] = useState([])
  const [groups,setGroups] = useState([])
  const [friendRequest,setFriendRequest] = useState([])
  const [friendResponse,setFriendResponse] = useState([])
  const [messageClient,setMessageClient] = useState(null)
  const [onlineId,setOnlineId] = useState([])
  const socket = useRef()

  useEffect(() => {
    if(isLogin)
      socket.current.on('userResponse',data => {
        setOnlineId(data)
      })
  },[isLogin])

  return (
    <PageContext.Provider
      value={{
        isLogin,
        setIsLogin,
        searchValue,
        setSearchValue,
        user,
        setUser,
        friends,
        setFriends,
        groups,
        setGroups,
        friendRequest,
        setFriendRequest,
        friendResponse,
        setFriendResponse,
        socket,
        onlineId,
        setOnlineId,
        messageClient,
        setMessageClient
      }}
    >
      
      <Router>
        {isLogin && <Header />}
        <Routes>
          <Route path='/' element={<Container Component={HomePage} />}/>
          <Route path='search' element={<Container Component={Search}/>}/>
          <Route path='myAccount' element={<Container Component={User}/> }/>
          <Route path='client'>
            <Route path=':clientId' element={<Container Component={Client}/> }/>
          </Route>
          <Route path='groups' element={<Container Component={Groups} />} />
          <Route path='group'>
            <Route path=':groupId' element={<Container Component={Group}/> }/>
          </Route>
          <Route path='friend' element={<Container Component={Friend} />}/>
          <Route path='login' element={<Login />}/>
          <Route path='register' element={<Register />}/>
        </Routes>

      </Router>
    </PageContext.Provider>
  );
}

export default App;
