// src/components/Header.jsx
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutMutation } from '../redux/slices/usersApiSlice';
import { logout } from '../redux/slices/authSlice';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap(); // Call the backend logout endpoint
      dispatch(logout()); // Clear credentials from Redux state and localStorage
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#eee' }}>
      <Link to='/'>
        <h1>LinkedIn Clone</h1>
      </Link>
      <nav>
        {userInfo ? (
          <>
            <Link to="/mynetwork" style={{ marginRight: '1rem' }}>My Network</Link>
            <Link to="/messages" style={{ marginRight: '1rem' }}>Messages</Link>
            <Link to={`/profile/${userInfo._id}`}>
              <span>Welcome, {userInfo.name}</span>
            </Link>
            <button onClick={logoutHandler} style={{ marginLeft: '1rem' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to='/login' style={{ marginRight: '1rem' }}>Sign In</Link>
            <Link to='/signup'>Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;