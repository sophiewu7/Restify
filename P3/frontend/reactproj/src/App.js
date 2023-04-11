import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Layout from './hocs/Layout';

import Home from './accounts/Home';
import Login from './accounts/Login';
import NotificationPage from './notifications/notifications'
import Register from './accounts/Register';

const App = () => (
    <Router>
        <Layout>
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/signup' element={<Register />} />
                <Route exact path='/login' element={<Login />} />
                <Route exact path='/notifications' element={<NotificationPage />} />

            </Routes>
        </Layout>
    </Router>
);

export default App;
