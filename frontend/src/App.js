import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Login from "./pages/login";
import SignupForm from "./pages/signup";
import VerifyEmail from "./pages/verifyEmail";
import ForgotPassword from "./pages/forgotPass";
import ResetPass from "./pages/resetPass";
import Nothing from "./pages/nothing";
import Home from "./pages/home";

import './App.css';
import Loader from "./components/loader";
import BookRoom from "./pages/bookRoom";
import ManageRooms from "./pages/manageRooms";
import ManageBookingPage from "./pages/manageBookings";
import CustomersPage from "./pages/customers";
import AllBookings from "./pages/allBookings";
import Analytics from "./pages/analytics";
import Expenses from "./pages/expenses";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<SignupForm />}></Route>     
        <Route path='/verify-email' element={<VerifyEmail />}></Route>
        <Route path='/forgotPass' element={<ForgotPassword />}></Route>
        <Route path='/resetPass/:token' element={<ResetPass />}></Route>
        <Route path='/loading' element={<Loader />}></Route>
        <Route path='/book-room' element={<BookRoom />}></Route>
        <Route path='/manage-rooms' element={<ManageRooms />}></Route>
        <Route path='/manage-bookings' element={<ManageBookingPage />}></Route>
        <Route path='/analytics' element={<Analytics />}></Route>
        <Route path='/customers' element={<CustomersPage />}></Route>
        <Route path='/all/bookings' element={<AllBookings />}></Route>
        <Route path='/expenses' element={<Expenses />}></Route>
        <Route path='/*' element={<Nothing />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
