import { useState } from 'react'
import { useEffect } from "react";
import { Route,Routes } from 'react-router-dom'
import { useDispatch } from "react-redux";
import './App.css'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/login'
import Register from './pages/Register'
import Product from './pages/Product'
import { login } from "./slices/userSlice"; // ✅ import login action
import Profile from './pages/Profile';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      dispatch(
        login({
          user: JSON.parse(storedUser),
          token
        })
      );
    }
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<h1>Home</h1>} />
        <Route element={<PrivateRoute />}>
          <Route path='/products' element={<Product/>} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/cart' element={<h1>Cart</h1>} />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  )
}

export default App
