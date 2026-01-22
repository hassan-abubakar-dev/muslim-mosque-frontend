
import './App.css'
import Homepage from './pages/HomePage'
import RegisterMosque from './pages/RegisterMosque';
import Signup from './pages/Signup'
import RegisterVerification from './pages/RegisterVerification';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Header from './components/Header'
import Profile from './pages/Profile';
import Mosque from './pages/Mosque';
import AppSkeletonLoader from './components/loadingSkeletons/AppSkeletonLoader';
import { useUserContext } from './context/UserContext';

function App() {
  const {appLoading} = useUserContext();

  if(appLoading){
    return <AppSkeletonLoader />
  }
  else{
     return (
    <>
    <Router>
      <Header />
      <Routes>
        <Route path='/test' element={<AppSkeletonLoader />} />
        <Route path='/' element={<Homepage />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/verify-email' element={<RegisterVerification />} />
        <Route path='/register-mosque' element={<RegisterMosque />} />
        <Route path='/register' element={<RegisterMosque />} />
        <Route path='/login' element={<Login />} />
        <Route path='/mosque/:id' element={<Mosque />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </Router>
    </>
  )
  }
}
export default App
