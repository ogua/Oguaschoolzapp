import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { schoolzapi } from '../components/constants';

//const token = useSelector(selecttoken);

const initialState = {
  exam: null,
  origin: null,
  orgaddress: null,
  destination: null,
  desaddress: null,
}

export const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setExam: (state,action) => {
      state.exam = action.payload
    },
    setOrigin: (state, action) => {

     // console.log("action",action);

      state.origin = action.payload.cordinates;

      axios.get(schoolzapi+'/routes',
      {
            headers: {Accept: 'application/json',
            Authorization: "Bearer "+action.payload.token
      }})
          .then(function (response) {
            console.log("routes",response.data.data);
          })
          .catch(function (error) {
           console.log("error",error.response);
     });

    },
    setOrgaddress: (state, action) => {
      state.orgaddress = action.payload
    },
    setDestination: (state, action) => {
      state.destination = action.payload
    },
    setdesAdrress: (state, action) => {
      state.desaddress = action.payload
    },
    
  },
})

export const {setOrigin, setOrgaddress, setDestination, setdesAdrress,setExam} = examSlice.actions

export const selectexam = (state) => state.exam.exam
export const seleteorigin = (state) => state.exam.origin
export const selectorgaddress = (state) => state.exam.orgaddress
export const selectdestination = (state) => state.exam.destination
export const selectdesaddress = (state) => state.exam.desaddress


export default examSlice.reducer