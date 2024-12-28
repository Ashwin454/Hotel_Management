import React, { useEffect, useState } from "react";
import Modal from "../components/modal";
import { useDispatch, useSelector } from "react-redux";
import { checkAvRooms, clearBooking, createBooking } from "../store/slices";
import Swal from "sweetalert2";
import Loader from "../components/loader";

const BookRoom = () => {
  
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  
  const {user} = useSelector((state) => state.auth);
  const {isBooked, loading, data, error} = useSelector((state) => state.book);
  
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [price, setPrice] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [adhaar, setAdhaar] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [age, setAge] = useState();
  const [numberOfPersons, setNumberOfPersons] = useState();

  const dispatch = useDispatch();
  
  const handleSearch = () => {
    // Simulate fetching rooms
    const formData = {
        hotelName : user.data.user1.hotelName,
        checkIn: `${checkInDate}T${checkInTime}`,
        checkOut: `${checkOutDate}T${checkOutTime}`,
    }
    dispatch(checkAvRooms(formData));
  };
  
  const handleBookRoom = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleConfirmBooking = () => {
    const formData = {
        hotelName: user.data.user1.hotelName,
        customerName,
        adhaar,
        checkIn: `${checkInDate}T${checkInTime}`,
        checkOut: `${checkOutDate}T${checkOutTime}`,
        address,
        phone,
        purpose,
        roomNo: selectedRoom.number,
        price: selectedRoom.standardPrice,
        age,
        numberOfPersons,
    }
    dispatch(createBooking(formData));
    dispatch(clearBooking())
    setShowModal(false);
  };
  
  useEffect(()=>{
    if(data){
        setRooms(data?.data?.availableRooms);
    }
    if(error){
        Swal.fire({
            icon: 'error',
            title: 'Error fetching rooms',
            text: error.response?.data?.message || 'An unexpected error occurred',
        })
    }
  }, [data, error, rooms, setRooms, loading])

  useEffect(()=>{
    if(isBooked){
        Swal.fire({
            icon: 'success',
            title: `Room booked successfully`,
        })
        dispatch(clearBooking());
    }
    if(error){
        Swal.fire({
            icon: 'error',
            title: 'Error booking room',
            text: error.response?.data?.message || 'An unexpected error occurred',
        })
    }
  }, [isBooked, error, dispatch])
  return (
    <div className="bg-[#F6F4F0] min-h-screen p-6">
      {/* Inputs */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <input
          type="date"
          className="p-3 border rounded-lg"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
        />
        <input
          type="time"
          className="p-3 border rounded-lg"
          value={checkInTime}
          onChange={(e) => setCheckInTime(e.target.value)}
        />
        <input
          type="date"
          className="p-3 border rounded-lg"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
        />
        <input
          type="time"
          className="p-3 border rounded-lg"
          value={checkOutTime}
          onChange={(e) => setCheckOutTime(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-[#2E5077] text-white p-3 rounded-lg hover:bg-[#4DA1A9] transition"
        >
          Search Rooms
        </button>
      </div>

      {/* Room List */}
      {loading ? <Loader /> :
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {rooms && rooms.map((room) => (
          <div
            key={room.number}
            className="p-4 border rounded-lg shadow-lg bg-white flex flex-col justify-between"
          >
            <h3 className="text-xl font-bold text-[#2E5077]">Room {room.number}</h3>
            <p>Type: {room.ac? "AC": "Non-AC" }</p>
            <p>Price: {room.standardPrice}</p>
            <button
              onClick={() => handleBookRoom(room)}
              className="bg-[#2E5077] text-white mt-4 py-2 px-4 rounded-lg hover:bg-[#4DA1A9] transition"
            >
              Book Room
            </button>
          </div>
        ))}
      </div>}

      {/* Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
            <div className="max-h-[80vh] overflow-y-auto p-4">
            <h2 className="text-xl font-bold mb-4">Confirm Booking</h2>
            <p>Room: {selectedRoom.number}</p>
            <p>Type: {selectedRoom.ac ? "AC" : "Non-AC"}</p>
            <label className="block mt-4">
                Customer Name:
                <input
                type="text"
                className="p-2 border rounded-lg mt-2 w-full"
                name="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                />
            </label>
            <label className="block mt-4">
                Aadhaar Number:
                <input
                type="text"
                className="p-2 border rounded-lg mt-2 w-full"
                name="adhaar"
                value={adhaar}
                onChange={(e) => setAdhaar(e.target.value)}
                />
            </label>
            <label className="block mt-4">
                Address:
                <input
                type="text"
                className="p-2 border rounded-lg mt-2 w-full"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                />
            </label>
            <label className="block mt-4">
                Phone:
                <input
                type="text"
                className="p-2 border rounded-lg mt-2 w-full"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                />
            </label>
            <label className="block mt-4">
                Purpose:
                <input
                type="text"
                className="p-2 border rounded-lg mt-2 w-full"
                name="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                />
            </label>
            <label className="block mt-4">
                Age:
                <input
                type="number"
                className="p-2 border rounded-lg mt-2 w-full"
                name="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                />
            </label>
            <label className="block mt-4">
                Price:
                <input
                type="number"
                className="p-2 border rounded-lg mt-2 w-full"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                />
            </label>
            <label className="block mt-4">
                Number of Persons:
                <input
                type="number"
                className="p-2 border rounded-lg mt-2 w-full"
                name="numberOfPersons"
                value={numberOfPersons}
                onChange={(e) => setNumberOfPersons(e.target.value)}
                />
            </label>
            <div className="flex justify-end mt-4 gap-4">
                <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 p-2 rounded-lg hover:bg-gray-400"
                >
                Cancel
                </button>
                <button
                onClick={handleConfirmBooking}
                className="bg-[#2E5077] text-white p-2 rounded-lg hover:bg-[#4DA1A9]"
                >
                Confirm
                </button>
            </div>
            </div>
        </Modal>
        )}
    </div>
  );
};

export default BookRoom;
