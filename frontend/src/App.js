
import './App.css';
import { Routes, Route } from 'react-router-dom'
import Homepage from './pages/homepage';
import Createpage from './pages/createproduct'
import Navbar from './components/navbar';
import Box from '@mui/material/Box';

function App() {
  
  return (
    <>
      <Box
        sx={{
          height: "100vh",
          // backgroundColor: 'secondary.main',
          // color: 'white',
          // padding: 2,
          // display: 'flex',
          // alignItems: 'center',
          // justifyContent: 'center',
          // '&:hover': {
          //   backgroundColor: 'secondary.dark',
          // },
        }}
      >
        <Navbar/>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/create' element={<Createpage />} />
        </Routes>

      </Box>
    </>
  );
}

export default App;