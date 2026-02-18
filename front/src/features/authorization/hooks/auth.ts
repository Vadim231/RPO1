import { useState } from 'react';
import axios, { AxiosError } from 'axios';
const host = 'http://localhost:8000';
export interface signUpData {
  phone_number: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
}
export interface signUpResponse {
  id: number;
  title: string;
  body: string;
}
export function useSignUp() {
  const [data, setData] = useState<signUpResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (payload: signUpData) => {
    const url = `${host}/auth/register/`;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<signUpResponse>(url, payload);
      setData(response.data);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, data, loading, error };
}
export interface signInData {
  phone_number: string;
}
export interface signInResponse {
  token: string;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    phone_number: string;
  };
}
export function useSignIn() {
  const [data, setData] = useState<signInResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const execute = async (payload: signInData) => {
    const url = `${host}/auth/login/?phone_number=${payload.phone_number.replace(/\+/g, '%2B')}`;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<signInResponse>(url, payload);
      setData(response.data);
      console.log(response.data);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError;
      console.log(axiosError.message);
      setError(axiosError.message);
      setTimeout(() => setError(null), 1500);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { execute, data, loading, error };
}
