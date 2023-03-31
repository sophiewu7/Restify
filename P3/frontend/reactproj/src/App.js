import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Layout from './hocs/Layout';

import Home from './accounts/Home';
import Login from './accounts/Login';

const App = () => (
    <Router>
        <Layout>
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/login' element={<Login />} />
            </Routes>
        </Layout>
    </Router>
);

export default App;
