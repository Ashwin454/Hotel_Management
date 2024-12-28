import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearBooking, editRoom, getAllRooms } from "../store/slices";
import Loader from "../components/loader";
import Swal from "sweetalert2";

const ManageRooms = () => {
  const { loading, rooms, error, isRoomEdit } = useSelector((state) => state.book);
  const dispatch = useDispatch();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editedRoom, setEditedRoom] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // Filter rooms by room number
  const filteredRooms = rooms?.data?.rooms.filter((room) =>
    room.number.toString().includes(searchTerm) // Search by room number
  );

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setEditedRoom({ ...room }); // Initialize with current room details
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    setIsModalOpen(false);
    dispatch(editRoom({ roomId: selectedRoom._id, roomData: editedRoom }));
    dispatch(clearBooking());
  };

  useEffect(() => {
    const fetchRooms = async () => {
      if (user?.data?.user1?.hotelName) {
        const formData = { hotelName: user.data.user1.hotelName };
        await dispatch(getAllRooms(formData)).unwrap();
      }
    };

    fetchRooms();
  }, [dispatch, user?.data?.user1?.hotelName, isRoomEdit]);

  useEffect(() => {
    if (isRoomEdit) {
      Swal.fire({
        icon: "success",
        title: "Room edited successfully",
      });
      dispatch(clearBooking())
    }
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error while editing",
        text: error.response?.data?.message || "An unexpected error occurred",
      });
      dispatch(clearBooking())

    }
  }, [isRoomEdit, error, dispatch]);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Manage Rooms</h1>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by room number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 border rounded p-2"
        />
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredRooms?.map((room) => (
            <div
              key={room.number}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between"
            >
              <h2 className="text-lg font-bold text-teal-700">Room {room.number}</h2>
              <p className="text-gray-600">Type: {room.type}</p>
              <p className="text-gray-600">Price: Rs. {room.standardPrice}</p>
              <button
                onClick={() => handleEditRoom(room)}
                className="mt-4 bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-500 transition"
              >
                Edit Room
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Room Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Room Number</label>
                <input
                  type="text"
                  name="number"
                  value={editedRoom.number || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700">Price</label>
                <input
                  type="number"
                  name="standardPrice" // Corrected here
                  value={editedRoom.standardPrice || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-gray-700">Max Persons</label>
                <input
                  type="number"
                  name="maxPersons"
                  value={editedRoom.maxPersons || ""}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-500 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRooms;
