import { Routes, Route } from 'react-router-dom'
import LoginPage from './components/pages/LoginForm'
import SignupPage from './components/pages/signupForm'
import UserDashboard from './components/pages/UserDashboard'
import AdminDashboard from './components/pages/AdminDashboard'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup"element={<SignupPage/>}/>
        <Route path="/user"element={<UserDashboard/>}/>
        <Route path="/admin"element={<AdminDashboard/>}/>
    </Routes>
  )
}

export default App