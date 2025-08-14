// src/pages/Register.js
import React, { useState } from 'react';
import { register } from '../api/auth';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'investor' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register(form);
      console.log('Registration successful:', data);
      // Store token and redirect user, etc.
    } catch (error) {
      console.error('Registration failed:', error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <select name="role" onChange={handleChange}>
        <option value="investor">Investor</option>
        <option value="business_owner">Business Owner</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;