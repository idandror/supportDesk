import React, { useState, useEffect } from 'react';
import { FaSignInAlt } from 'react-icons/fa';
import { login, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import Spinner from '../components/Spinner';
import { useAppDispatch, useAppSelector } from '../app/hooks';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isSuccess, message, isError } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    //Redirect when logged in
    if (isSuccess || user) {
      navigate('/');
    }
    dispatch(reset());
  }, [isError, isSuccess, user, navigate, dispatch, message]);

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.value);

    setPassword(e.currentTarget.value);
  };
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.value);

    setEmail(e.currentTarget.value);
  };
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };
  return (
    <>
      {isLoading && <Spinner />}
      <section className="heading">
        <h1>
          <FaSignInAlt /> Login
        </h1>
        <p>Please Log in to get support</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="email"
              name="email"
              value={email}
              onChange={onChangeEmail}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              onChange={onChangePassword}
              placeholder="Enter password"
              required
            />
          </div>

          <div className="form-group">
            <button className="btn btn-block">Submit</button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Login;
