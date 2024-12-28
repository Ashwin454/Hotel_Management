import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomers } from "../store/slices";

const CustomersPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { customers1, error, loading } = useSelector((state) => state.book);

  useEffect(() => {
    const fetchCustomers = async () => {
      await dispatch(getAllCustomers({ hotelName: user.data.user1.hotelName })).unwrap();
    };

    fetchCustomers();
  }, [dispatch, user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        <p className="text-lg text-gray-700 mt-4">Loading Customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center py-5">Customer Information</h1>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-collapse border border-gray-200">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Visit Count</th>
              </tr>
            </thead>
            <tbody>
              {customers1 &&
                customers1?.data?.customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-t border-gray-200 hover:bg-gray-100"
                  >
                    <td className="px-4 py-2">{customer.adhaar}</td>
                    <td className="px-4 py-2">{customer.name}</td>
                    <td className="px-4 py-2">{customer.phone}</td>
                    <td className="px-4 py-2">{customer.visitCount}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
