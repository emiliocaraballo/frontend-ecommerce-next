/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useLoginMutation } from '../../shared/store/api';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, setUser, UserState } from '../../shared/store/slices/userSlice';
import { useRouter } from 'next/navigation';

import { FaUserAlt, FaLock } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const user: UserState = useSelector(getUser);
  if(user?.id > 0){
    router.push("/dashboard");
  }

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data  = await login({ username: email, password, rol: "ADMIN" }).unwrap();      
      dispatch(setUser(data));
      router.push('/dashboard');
    } catch (err) {
      console.log(err, 'err');
      
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center" id="my-modal">
    <div className="flex w-full max-w-4xl justify-center items-center mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="hidden md:block w-1/2">
        <img className="w-full object-cover" src="https://objectstorage.me-dubai-1.oraclecloud.com/n/axwzijd5v1vn/b/DSL_IMAGES/o/IMAGE/3081ea8a-49c2-4fc8-abc7-f47efe94a05f-Mobile login-bro.png" />
      </div>
      <div className="w-1/2 p-5">
        <div className="flex justify-center space-x-4 mb-4">
          <button className={`px-4 py-2 ${'signup' === 'signup' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'} focus:outline-none`}>Welcome</button>
        </div>
        <div className="signup-tab">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex items-center border-b border-gray-200 py-2">
              <FaUserAlt className="text-gray-400 mr-3" />
              <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                placeholder="Usuario"
                aria-label="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* Campo de contraseña */}
            <div className="flex items-center border-b border-gray-200 py-2">
              <FaLock className="text-gray-400 mr-3" />
              <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="password"
                placeholder="Contraseña"
                aria-label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>            
            
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button type="submit" className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none">
            {isLoading ? "Cargando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
};

export default LoginPage;
