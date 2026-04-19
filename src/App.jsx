import { useState } from 'react'
import { Route,Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<h1>Home</h1>} />
        <Route path='/products' element={<h1>Products</h1>} />
        <Route path='/profile' element={<h1>Profile</h1>} />
      </Routes>
    </>
  )
}

export default App
