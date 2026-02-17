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
