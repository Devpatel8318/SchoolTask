import React from 'react'
import Results from './Pages/Results'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ResultForm from './Pages/ResultForm'

axios.defaults.baseURL = 'http://localhost:4000'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Results />} />
                <Route path="/resultform" element={<ResultForm />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
