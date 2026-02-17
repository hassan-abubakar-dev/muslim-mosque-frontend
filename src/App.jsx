import './App.css'
import Homepage from './pages/HomePage'
import RegisterMosque from './pages/RegisterMosque';
import Signup from './pages/Signup'
import RegisterVerification from './pages/RegisterVerification';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Header from './components/Header'
import FooterNav from './components/FooterNav'
import Profile from './pages/Profile';
import Mosque from './pages/mosque/Mosque';
import AppSkeletonLoader from './components/loadingSkeletons/AppSkeletonLoader';
import { useUserContext } from './context/UserContext';
import CategoryLecture from './pages/categoryLecture/CategoryLacture';
import VideoPlayer from './pages/categoryLecture/VideoPlayer';
import Adzkar from './pages/Adzkar';
import Qiuran from './pages/Qiuran';
import Surah from './pages/Surah';



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
        <Route path='/category/lacture' element={<CategoryLecture />} />
        <Route path='/video-player' element={<VideoPlayer />} />
        <Route path='/adhkar' element={<Adzkar />} />
        <Route path='/prayer' element={<div className="flex items-center justify-center min-h-screen text-gray-500">📌 Coming Soon...</div>} />
        <Route path='/dua' element={<div className="flex items-center justify-center min-h-screen text-gray-500">📌 Coming Soon...</div>} />
        <Route path='/quran' element={<Qiuran />} />
        <Route path='/surah/:id' element={<Surah />} />
      
      </Routes>
      <FooterNav />
    </Router>
    </>
  )
  }
}
export default App
