import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
axios.defaults.withCredentials = true;

const initialState = {
    loading:false,
    user:null,
    data:null,
    error:null,
    isAuthenticated:false,
    isVerified:false,
}

const initialState2 = {
    loading:false,
    data:null,
    error:null,
    isBooked: false,
    bookings1: null,
    isEditted: false,
    isCancelled: false,
    rooms: null,
    isRoomEdit: false,
    isCheckedOut: false,
    customers1: null,
    allBookings: null,
    isExpenseDeleted: false,
    isExpenseAdded: false,
    expenses1: null
}

export const register = createAsyncThunk('auth/register', async(formData, thunkAPI)=>{
    try{
        const response = await axios.post('http://localhost:8080/api/v1/register', formData);
        return {
            data: response.data,
            status: response.status,
        }; 
    }catch(error){
        console.log("Error: ", error);
        return thunkAPI.rejectWithValue(error)
    }
})
export const verifyEmail = createAsyncThunk('auth/verifyEmail', async(formData, thunkAPI)=>{
    try{
        const response = await axios.post('http://localhost:8080/api/v1/verify-email', formData);
        return{
            data:response.data,
            status:response.status
        }
    }catch(error){
        console.log("Error: ", error);
        return thunkAPI.rejectWithValue(error)
    }
})
export const logout = createAsyncThunk('auth/logout', async(_, thunkAPI)=>{
    try{
        const response = await axios.post('http://localhost:8080/api/v1/logout');
        return{
            data:response.data,
            status: response.status
        }
    }catch(error){
        console.log("Error: ", error);
        return thunkAPI.rejectWithValue(error)
    }
})
export const login = createAsyncThunk('auth/login', async(formData, thunkAPI)=>{
    try {
        const response = await axios.post('http://localhost:8080/api/v1/login', formData);
        return{
            data:response.data,
            status:response.status
        }
    } catch (error) {
        console.log("Error: ", error);
        return thunkAPI.rejectWithValue(error)
    }
})
export const forgotPass = createAsyncThunk('auth/forgotPass', async(formData, thunkAPI)=>{
    try {
        const response = await axios.post('http://localhost:8080/api/v1/forgotPass', formData);
        return{
            data:response.data,
            status:response.status
        }
    } catch (error) {
        console.log("Error: ", error);
        return thunkAPI.rejectWithValue(error)
    }
})
export const resetPass = createAsyncThunk('auth/resetPass', async(formData, thunkAPI)=>{
    try {
        const d = {
            password: formData.password,
            confirmPass: formData.confirmPass
        }
        
        const token=formData.token;
        const response = await axios.post(`http://localhost:8080/api/v1/resetPass/${token}`, d);
        return{
            data:response.data,
            status:response.status
        }
    } catch (error) {
        console.log("Error: ", error);
        return thunkAPI.rejectWithValue(error)
    }
})
export const checkAvRooms = createAsyncThunk('book/checkAvRooms', async(formData, thunkAPI)=>{
    try{
        const response = await axios.post('http://localhost:8080/api/v1/bookings/getAvRooms', formData);
        return {
            data:response.data,
            status:response.status
        }
    }catch(error){
        console.log("Error: ", error);
        return thunkAPI.rejectWithValue(error)
    }
})
export const createBooking = createAsyncThunk('book/createBooking', async(formData, thunkAPI)=>{
    try{
        const response = await axios.post('http://localhost:8080/api/v1/bookings/create-booking', formData);
        return{
            data:response.data,
            status:response.status
        }
    }catch(error){
        console.log("Error: ", error);
        return thunkAPI.rejectWithValue(error)
    }
})
export const getBookings = createAsyncThunk('book/getBookings', async(formData, thunkAPI)=>{
    try {
        const response = await axios.post('http://localhost:8080/api/v1/bookings/get-bookings', formData);
        return{
            data:response.data,
            status:response.status
        }
    } catch (error) {
        console.log("Error: ", error);
        return thunkAPI.rejectWithValue(error)
    }
})
export const editBooking = createAsyncThunk('book/editBooking', async(formData, thunkAPI)=>{
    try {
        const response = await axios.post('http://localhost:8080/api/v1/bookings/update-booking', formData);
        return{
            data:response.data,
            status:response.status
        }
    } catch (error) {
        console.log("Error: ", error);
        return thunkAPI.rejectWithValue(error)
    }
})
export const cancelBooking = createAsyncThunk('book/cancelBooking', async(formData, thunkAPI)=>{
    try {
        const response = await axios.post('http://localhost:8080/api/v1/bookings/cancel-booking', formData);
        return{
            data:response.data,
            status:response.status
        }
    } catch (error) {
        console.log("Error: ", error);
        return thunkAPI.rejectWithValue(error)
    }
})
export const getAllRooms = createAsyncThunk('book/getAllRooms', async(formData, thunkAPI)=>{
    try {
        const response = await axios.post('http://localhost:8080/api/v1/rooms/getAllRooms', formData);
        console.log(response);
        return{
            data:response.data,
            status:response.status
        }
    } catch (error) {
        console.log("Error: ", error);
        return thunkAPI.rejectWithValue(error)
    }
})
export const editRoom = createAsyncThunk('book/editRoom', async(formData, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:8080/api/v1/rooms/edit-room', formData);
        return{
            data:response.data,
            status:response.status
        }
    } catch (error) {
        console.log("Error: ", error);
        return thunkAPI.rejectWithValue(error)
    }
})
export const addExpense = createAsyncThunk('book/addExpense', async(formData, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:8080/api/v1/bookings/add-expense', formData);
        console.log(response);
        return{
            data:response.data,
            status:response.status
        }
    } catch (error) {
        console.log("Error: ", error);
        return thunkAPI.rejectWithValue(error)
    }
})
export const deleteExpense = createAsyncThunk('book/deleteExpense', async(formData, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:8080/api/v1/bookings/delete-expense', formData);
        console.log(response);
        return{
            data:response.data,
            status:response.status
        }
    } catch (error) {
        console.log("Error: ", error);
        return thunkAPI.rejectWithValue(error)
    }
})

export const getAllCustomers = createAsyncThunk('book/getAllCustomers', async(formData, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:8080/api/v1/bookings/get-all-customers', formData);
        return{
            data:response.data,
            status:response.status
        }
    } catch (error) {
        console.log("Error: ", error);
        return thunkAPI.rejectWithValue(error)
    }
})
export const getAllBookings = createAsyncThunk('book/getAllBookings', async(formData, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:8080/api/v1/bookings/get-all-bookings', formData);
        console.log(response);
        return{
            data:response.data,
            status:response.status
        }
    } catch (error) {
        console.log("Error: ", error);
        return thunkAPI.rejectWithValue(error)
    }
})

export const getAllExpenses = createAsyncThunk('book/getAllExpenses', async(formData, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:8080/api/v1/bookings/all-expenses', formData);
        console.log(response);
        return{
            data:response.data,
            status:response.status
        }
    } catch (error) {
        console.log("Error: ", error);
        return thunkAPI.rejectWithValue(error)
    }
})

export const checkOuter = createAsyncThunk('book/checkOut', async (formData, thunkAPI) => {
    try {
        const response = await axios.post('http://localhost:8080/api/v1/bookings/checkOut', formData, {
            responseType: 'blob'  // Add this to handle the response as a Blob
        });
        
        // Check if the response is a PDF (you can also check other criteria like content type)
        if (response.headers['content-type'] === 'application/pdf') {
            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });

            // Create a link element to trigger the download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = `receipt_${formData.bookingId}.pdf`;  // Use dynamic filename if needed
            link.click();  // Trigger the download

            return {
                data: 'PDF download triggered',
                status: response.status
            };
        } else {
            console.error('Response is not a PDF:', response);
            return thunkAPI.rejectWithValue('Response is not a PDF');
        }
    } catch (error) {
        console.log('Error:', error);
        return thunkAPI.rejectWithValue(error);
    }
});

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        clear: (state) => {
            state.user = null
            state.error = null
            state.isAuthenticated = false
            state.loading = false
            state.isVerified = false
            state.data=null
        },      
    },
    extraReducers:(builder) =>{
        builder
        .addCase(register.pending, (state)=>{
            state.loading = true;
        })
        .addCase(register.fulfilled, (state, action)=>{
            state.loading=false;
            state.isAuthenticated=true;
            state.user=action.payload;
        })
        .addCase(register.rejected, (state, action)=>{
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload
        })
        .addCase(verifyEmail.pending, (state)=>{
            state.loading=true;
        })
        .addCase(verifyEmail.fulfilled, (state, action)=>{
            state.loading=false;
            state.isVerified=true;
            state.user=action.payload
        })
        .addCase(verifyEmail.rejected, (state, action)=>{
            state.loading = false;
            state.isVerified = false;
            state.error = action.payload
        })
        .addCase(logout.pending, (state)=>{
            state.loading=true;
        })
        .addCase(logout.fulfilled, (state, action)=>{
            Object.assign(state, initialState);
        })
        .addCase(logout.rejected, (state, action)=>{
            state.loading=false;
            state.error=action.payload
        })
        .addCase(login.pending, (state)=>{
            state.loading = true;
        })
        .addCase(login.fulfilled, (state, action)=>{
            state.loading=false;
            state.isAuthenticated=true;
            state.user=action.payload;
        })
        .addCase(login.rejected, (state, action)=>{
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload
        })
        .addCase(forgotPass.pending, (state)=>{
            state.loading = true;
        })
        .addCase(forgotPass.fulfilled, (state, action)=>{
            state.loading=false;
            state.data=action.payload;
            state.error=null
        })
        .addCase(forgotPass.rejected, (state, action)=>{
            state.loading=false;
            state.data=null;
            state.error=action.payload;
        })
        .addCase(resetPass.pending, (state)=>{
            state.loading = true;
        })
        .addCase(resetPass.fulfilled, (state, action)=>{
            state.loading=false;
            state.data=action.payload;
            state.error=null
        })
        .addCase(resetPass.rejected, (state, action)=>{
            state.loading=false;
            state.data=null;
            state.error=action.payload;
        })
    }
})
const bookSlice = createSlice({
    name:'book',
    initialState: initialState2,
    reducers:{
        clear:(state) => {
            state.loading = false;
            state.data = null;
            state.error = null;
            state.isBooked = false;
            state.bookings1 = null;
            state.isEditted = false;
            state.isCancelled = false;
            state.rooms = null;
            state.isRoomEdit = false;
            state.isCheckedOut = false;
            state.customers1 = null;
            state.allBookings = null;
            state.isExpenseAdded = false;
            state.isExpenseDeleted = false;
            state.expenses1 = null;
        }
    },
    extraReducers:(builder) =>{
        builder
        .addCase(checkAvRooms.pending, (state)=>{
            state.loading = true
        })
        .addCase(checkAvRooms.fulfilled, (state, action)=>{
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        })
        .addCase(checkAvRooms.rejected, (state, action)=>{
            state.loading = false;
            state.data = null;
            state.error = action.payload;
        })
        .addCase(createBooking.pending, (state)=>{
            state.loading = true;
        })
        .addCase(createBooking.fulfilled, (state, action)=>{
            state.loading = false;
            state.data=action.payload;
            state.isBooked=true;
            state.error = null;
        })
        .addCase(createBooking.rejected, (state, action)=>{
            state.loading = false;
            state.data = null;
            state.isBooked = false;
            state.error = action.payload;
        })
        .addCase(getBookings.pending, (state)=>{
            state.loading = true;
        })
        .addCase(getBookings.fulfilled, (state, action)=>{
            state.loading = false;
            state.bookings1 = action.payload;
            state.error = null;
        })
        .addCase(getBookings.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
            state.bookings1 = null;
        })
        .addCase(editBooking.pending, (state)=>{
            state.loading = true;
        })
        .addCase(editBooking.fulfilled, (state)=>{
            state.loading = false;
            state.isEditted = true;
            state.error = null;
        })
        .addCase(editBooking.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
            state.isEditted = false;
        })
        .addCase(cancelBooking.pending, (state)=>{
            state.loading = true;
        })
        .addCase(cancelBooking.fulfilled, (state)=>{
            state.loading = false;
            state.isCancelled = true;
            state.error = null;
        })
        .addCase(cancelBooking.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
            state.isCancelled = false;
        })
        .addCase(getAllRooms.pending, (state)=>{
            state.loading = true;
        })
        .addCase(getAllRooms.fulfilled, (state, action)=>{
            state.loading = false;
            state.rooms = action.payload;
            state.error = null;
        })
        .addCase(getAllRooms.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
            state.rooms = null;
        })
        .addCase(editRoom.pending, (state)=>{
            state.loading = true;
        })
        .addCase(editRoom.fulfilled, (state)=>{
            state.loading = false;
            state.isRoomEdit = true;
            state.error = null;
        })
        .addCase(editRoom.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
            state.isRoomEdit = false;
        })
        .addCase(checkOuter.pending, (state)=>{
            state.loading = true;
        })
        .addCase(checkOuter.fulfilled, (state)=>{
            state.loading = false;
            state.isCheckedOut = true;
            state.error = null;
        })
        .addCase(checkOuter.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
            state.isCheckedOut = false;
        })
        .addCase(getAllCustomers.pending, (state)=>{
            state.loading = true;
        })
        .addCase(getAllCustomers.fulfilled, (state, action)=>{
            state.loading = false;
            state.customers1 = action.payload;
            state.error = null;
        })
        .addCase(getAllCustomers.rejected, (state, action)=>{
            state.loading = false;
            state.customers1 = null;
            state.error = action.payload;
        })
        .addCase(getAllBookings.pending, (state)=>{
            state.loading = true;
        })
        .addCase(getAllBookings.fulfilled, (state, action)=>{
            state.loading = false;
            state.allBookings = action.payload;
            state.error = null;
        })
        .addCase(getAllBookings.rejected, (state, action)=>{
            state.loading = false;
            state.allBookings = null;
            state.error = action.payload;
        })
        .addCase(getAllExpenses.pending, (state)=>{
            state.loading = true;
        })
        .addCase(getAllExpenses.fulfilled, (state, action)=>{
            state.loading = false;
            state.expenses1 = action.payload;
            state.error = null;
        })
        .addCase(getAllExpenses.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
            state.expenses1 = null;
        })
        .addCase(addExpense.pending, (state)=>{
            state.loading = true;
        })
        .addCase(addExpense.fulfilled, (state)=>{
            state.loading = false;
            state.isExpenseAdded = true;
            state.error = null;
        })
        .addCase(addExpense.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
            state.isExpenseAdded = false;
        }).addCase(deleteExpense.pending, (state)=>{
            state.loading = true;
        })
        .addCase(deleteExpense.fulfilled, (state)=>{
            state.loading = false;
            state.isExpenseDeleted = true;
            state.error = null;
        })
        .addCase(deleteExpense.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
            state.isExpenseDeleted = false;
        })
    }
})
export const {clear: clearAuth} = authSlice.actions;
export default authSlice.reducer;

export const {clear: clearBooking} = bookSlice.actions;
export const bookReducer = bookSlice.reducer;