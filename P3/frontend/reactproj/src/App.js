import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Layout from './hocs/Layout';

import Home from './accounts/Home';
import Login from './accounts/Login';

import Register from './accounts/Register';
import UserProfile from './accounts/Profile';
import Password from './accounts/Password';

import NotificationPage from './notifications/notifications';
import CommentSection from './comments/comments';
import UserComment from './comments/user_comments'
import AddUserComment from './comments/add_user_comment';


const App = () => (
    <Router>
        <Layout>
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/signup' element={<Register />} />
                <Route exact path='/login' element={<Login />} />
                <Route exact path='/profile' element={<UserProfile />} />
                <Route exact path='/reset_password' element={<Password />} />
                <Route exact path='/notifications' element={<NotificationPage />} />
                <Route exact path='/comments' element={<CommentSection propertyId={1}/>}/>
                <Route exact path='/user_comments' element={<UserComment userId={1}/>}/>
                <Route exact path='/user_comments' element={<UserComment userId={1}/>}/>
                <Route exact path='/add_user_comments' element={<AddUserComment userId={1}/>}/>
            </Routes>
        </Layout>
    </Router>
);

export default App;
