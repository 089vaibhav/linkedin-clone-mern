// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../redux/slices/usersApiSlice';
import { setCredentials } from '../redux/slices/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Call the login mutation and unwrap the result
      const res = await login({ email, password }).unwrap();
      // Dispatch the setCredentials action with the user data
      dispatch(setCredentials({ ...res }));
      navigate('/');
    } catch (err) {
      // Handle errors, e.g., show a toast notification for "Invalid credentials"
      console.error(err?.data?.message || err.error);
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor='email'>Email Address</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit' disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <div>
        <p>
          New Customer? <Link to='/signup'>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;