import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Root from "./Root/Root";
import Layout from "./Layout/Layout";
import {Routes, Route, HashRouter} from "react-router-dom";
import Page from "./Page/Page";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <HashRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Root/>} />
                    <Route path="/file" element={<Page/>}/>
                </Route>
            </Routes>
        </HashRouter>
    </>
);

