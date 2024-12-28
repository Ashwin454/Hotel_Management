import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addExpense, clearBooking, deleteExpense, getAllExpenses } from "../store/slices";
import Loader from "../components/loader";
import Swal from "sweetalert2";

const Expenses = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const {expenses1, loading, error, isExpenseAdded, isExpenseDeleted} = useSelector((state) => state.book);
  const {user} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Add a new expense
  const addExpense1 = async () => {
    if (!name || !amount) return alert("Please fill out all fields.");
    try {
      dispatch(addExpense({
        hotelName: user?.data?.user1?.hotelName,
        name,
        amount
      }))
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Add Failed',
            text: error.response?.data?.message || 'An unexpected error occurred',
        })
    }
  };

  // Delete an expense
  const deleteExpense1 = async (id) => {
    try {
        dispatch(deleteExpense({expenseId: id}))
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Delete Failed',
            text: error.response?.data?.message || 'An unexpected error occurred',
        })
    }
  };

  useEffect(() => {
    const fetchExpenses =async () =>{
        if(error){
            Swal.fire({
                icon: 'error',
                title: `${error?.response?.data?.message}`,
            })
            dispatch(clearBooking());
        }
        if(!expenses1){
            await dispatch(getAllExpenses({hotelName: user?.data?.user1?.hotelName})).unwrap();
        }
    }
    fetchExpenses()
    if(isExpenseDeleted){
        Swal.fire({
            icon: 'success',
            title: 'Deleted successfully',
        })
        dispatch(clearBooking());
    }
    if(isExpenseAdded){
        Swal.fire({
            icon: 'success',
            title: 'Added successfully',
        })
        dispatch(clearBooking());
    }
  }, [user, dispatch, expenses1, error, isExpenseAdded, isExpenseDeleted]);

  return (
    <div className="bg-[#F6F4F0] min-h-screen p-6 flex flex-col">
      <nav className="bg-[#2E5077] text-[#F6F4F0] py-4 px-6 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">Expense Manager</h1>
      </nav>

      <div className="bg-[#79D7BE] text-center py-6 rounded-lg shadow-lg mt-6 mb-6">
        <h2 className="text-3xl font-bold text-[#2E5077]">Manage Expenses</h2>
      </div>

      <div className="flex flex-col gap-6">
        {/* Add Expense Form */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-bold text-[#2E5077] mb-4">Add Expense</h3>
          <div className="flex flex-col lg:flex-row gap-4">
            <input
              type="text"
              placeholder="Expense Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none"
            />
            <button
              onClick={addExpense1}
              className="bg-[#4DA1A9] text-white py-2 px-4 rounded hover:bg-[#79D7BE] transition-all"
              disabled={loading}
            >
              Add Expense
            </button>
          </div>
        </div>

        {/* Expense Table */}
        {/* Expense Table */}
        <div className="bg-white shadow-lg rounded-lg p-4">
        <h3 className="text-xl font-bold text-[#2E5077] mb-4">All Expenses</h3>
        {loading ? (
            <Loader />
        ) : (
            <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                <tr className="bg-[#2E5077] text-white">
                    <th className="border border-gray-300 px-4 py-2 text-sm md:text-base">Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-sm md:text-base">Amount</th>
                    <th className="border border-gray-300 px-4 py-2 text-sm md:text-base">Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-sm md:text-base">Action</th>
                </tr>
                </thead>
                <tbody>
                {expenses1?.data?.expenses?.length > 0 ? (
                    expenses1?.data?.expenses?.map((expense) => (
                    <tr key={expense._id} className="text-center">
                        <td className="border border-gray-300 px-4 py-2 text-sm md:text-base">{expense.name}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm md:text-base">{expense.amount}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm md:text-base">{new Date(expense.date).toLocaleDateString()}</td>
                        <td className="border border-gray-300 px-4 py-2">
                        <button
                            onClick={() => deleteExpense1(expense._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-all text-sm md:text-base"
                            disabled={loading}
                        >
                            Delete
                        </button>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan="4" className="text-center py-4 text-sm md:text-base">
                        No expenses found.
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        )}
        </div>

      </div>
    </div>
  );
};

export default Expenses;
