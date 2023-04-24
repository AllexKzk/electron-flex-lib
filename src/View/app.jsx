import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Explorer from './Explorer/Explorer';
import Page from './Page/Page';
import Layout from './Layout/Layout';
import {Routes, Route, HashRouter} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <HashRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Explorer/>} />
                    <Route path="/file" element={<Page/>}/>
                </Route>
            </Routes>
        </HashRouter>
    </>
);

