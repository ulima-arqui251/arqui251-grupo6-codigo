import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Login from '../pages/Login';
import Register from '../pages/Register';
import HomePage from '../pages/HomePage';
import LandingPage01 from '../pages/LandingPage01';
import LandingPage02 from '../pages/LandingPage02';
import LandingPage03 from '../pages/LandingPage03';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import ProfileAlbums from '../pages/ProfileAlbums';
import ProfileArtists from '../pages/ProfileArtists';
import Artist from '../pages/Artist';
import Album from '../pages/Album';
import Search from '../pages/Search';
import Recommendation from '../pages/Recommendation';
import PrivateRoute from '../components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/landing_page_01" element={<LandingPage01 />} />
        <Route path="/landing_page_02" element={<LandingPage02 />} />
        <Route path="/landing_page_03" element={<LandingPage03 />} />

        import PrivateRoute from '../components/PrivateRoute'; // crea este archivo

      <Route element={<Header />}>
        <Route
          path="/home_page"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit_profile"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile_albums"
          element={
            <PrivateRoute>
              <ProfileAlbums />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile_artists"
          element={
            <PrivateRoute>
              <ProfileArtists />
            </PrivateRoute>
          }
        />
        <Route
          path="/artist/:artistId"
          element={
            <PrivateRoute>
              <Artist />
            </PrivateRoute>
          }
        />
        <Route
          path="/album/:albumId"
          element={
            <PrivateRoute>
              <Album />
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <Search />
            </PrivateRoute>
          }
        />
        <Route
          path="/recommendation"
          element={
            <PrivateRoute>
              <Recommendation />
            </PrivateRoute>
          }
        />
      </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;