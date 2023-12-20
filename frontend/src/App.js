import React from 'react'
import Results from './Pages/Results'
import Students from './Pages/Students'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

axios.defaults.baseURL = 'http://localhost:4000'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Results />} />
                <Route path="/students" element={<Students />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
