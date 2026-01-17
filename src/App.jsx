
import './App.css'
import Homepage from './pages/HomePage'
import RegisterMosque from './pages/RegisterMosque';
import Signup from './pages/Signup'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Mosque from './pages/Mosque';
import Header from './components/Header'

function App() {
  return (
    <>
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/register-mosque' element={<RegisterMosque />} />
        <Route path='/register' element={<RegisterMosque />} />
        <Route path='/login' element={<Login />} />
        <Route path='/mosque/:id' element={<Mosque />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
