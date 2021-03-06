import React, {useState} from 'react';
import useForm from './useForm';
import validateInfo from './validateInfo';
import './register.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const {handleChange, values, handleSubmit, errors, databaseMSG} = useForm(validateInfo);

  const handleNavigate = e => {
      e.preventDefault();
      navigate('../fitness_database/login');
  };
  return (
      <div className='form-content'>
          <form className='form' onSubmit={handleSubmit}>
              <h1>Create a new account to get started with your fitness journey!</h1>
           <div className='form-inputs'>
              <label htmlFor='username' className='form-label'>Username</label>
               <input 
                id='username'
                type={'text'}
                name='username'
                className='form-input'
                placeholder='Enter your username'
                value={values.username}
                onChange={handleChange}></input>
                {errors.username && <p>{errors.username}</p>}
          </div>
           <div className='form-inputs'>
              <label htmlFor='password' className='form-label'>Password</label>
               <input 
                id='password'
                type={'password'}
                name='password'
                className='form-input'
                placeholder='Enter your password'
                value={values.password}
                onChange={handleChange}></input>
                {errors.password && <p>{errors.password}</p>}
          </div>
          <div className='form-inputs'>
              <label htmlFor='password-confirm' className='form-label'>Confirm Password</label>
               <input 
                id='password2'
                type={'password'}
                name='password2'
                className='form-input'
                placeholder='Confirm your password'
                value={values.password2}
                onChange={handleChange}></input>
                {errors.password2 && <p>{errors.password2}</p>}
          </div>
          <button className='form-register-btn' type='submit'>Sign up</button>
          </form>
           <button className='login-btn' onClick={handleNavigate}>Already have an account? Login here!</button>
           {databaseMSG && <p>{databaseMSG}</p>}
      </div>
      
  );
}
export default Register;
