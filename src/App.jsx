import './App.css'
import { useState } from 'react';
import Homepage from './pages/HomePage'
import RegisterMosque from './pages/RegisterMosque';
import Signup from './pages/Signup'
import RegisterVerification from './pages/RegisterVerification';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import FooterNav from './components/FooterNav'
import Profile from './pages/Profile';
import Mosque from './pages/mosque/Mosque';
import AnnouncementsPage from './pages/mosque/AnnouncementsPage';
import NotificationPage from './pages/mosque/NotificationPage';
import SplashScreen from './components/loadingSkeletons/SplashScreen';
import { useUserContext } from './context/UserContext';
import CategoryLecture from './pages/categoryLecture/CategoryLacture';
import VideoPlayer from './pages/categoryLecture/VideoPlayer';
import Adzkar from './pages/Adzkar';
import Qiuran from './quran/quran';
import Surah from './quran/Surah';
import AboutPage from './pages/About';
import FollowingPage from './pages/FollowingPage';
import BookmarkPage from './pages/Bookmark';
import VideoLibrary from './pages/VideoLibrary';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import MosqueTeamSettings from './pages/MosqueTeamSettings';
import SuperAdminDashboard from './pages/superAdmin/SuperAdmin';
import ForgotPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  const {appLoading} = useUserContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if(appLoading){
    return <SplashScreen />
  }
  else{
     return (
    <>
    <Router>
      <Header onToggleSidebar={handleToggleSidebar} />
      <div className="flex pt-24">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1">
          <Routes>
            <Route path='/test' element={<SplashScreen />} />
            <Route path='/' element={<Homepage />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/verify-email' element={<RegisterVerification />} />
            <Route path='/register-mosque' element={<RegisterMosque />} />
            <Route path='/register' element={<RegisterMosque />} />
            <Route path='/login' element={<Login />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/mosque/:id' element={<Mosque />} />
            <Route path='/mosque/:id/announcements' element={<AnnouncementsPage />} />
            <Route path='/mosque/:id/notifications' element={<NotificationPage />} />
            <Route path='/notifications' element={<NotificationPage />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/category/lacture' element={<CategoryLecture />} />
            <Route path='/video-player' element={<VideoPlayer />} />
            <Route path='/adhkar' element={<Adzkar />} />
            <Route path='/prayer' element={<div className="flex items-center justify-center min-h-screen text-gray-500">📌 Coming Soon...</div>} />
            <Route path='/following' element={<FollowingPage />} />
            <Route path='/quran' element={<Qiuran />} />
            <Route path='/surah/:id' element={<Surah />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/bookmarks' element={<BookmarkPage />} />
            <Route path='/reports' element={<Reports />} />
            <Route path='/video-library' element={<VideoLibrary />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/mosque-team-settings/:mosqueId' element={<MosqueTeamSettings />} />
            <Route path='/super-admin' element={<SuperAdminDashboard />} />
          
          </Routes>
          <FooterNav />
        </div>
      </div>
    </Router>
    </>
  )
  }
}
export default App


