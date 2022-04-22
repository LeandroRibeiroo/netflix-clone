import CircularProgress from '@mui/material/CircularProgress';
import Head from 'next/head';
import Image from 'next/image';
import * as React from 'react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';

interface Inputs {
  email: string;
  password: string;
}

const Login = () => {
  const [isLoginScreen, setIsLoginScreen] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { signIn, signUp, loading } = useAuth();

  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    if (isLoginScreen) {
      await signIn(email, password);
    } else {
      signUp(email, password);
    }
  };

  return (
    <div
      className="relative flex h-screen w-screen flex-col bg-black md:items-center 
    md:justify-center md:bg-transparent"
    >
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Image
        src="https://rb.gy/p2hphi"
        layout="fill"
        className="-z-10 !hidden opacity-50 sm:!inline"
        objectFit="cover"
      />
      <img
        src="https://rb.gy/ulxxee"
        className="absolute left-4 top-4 cursor-pointer object-contain 
      md:left-10 md:top-6"
        alt="logo"
        width={150}
        height={150}
      />
      {isLoginScreen ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 
      md:max-w-md md:px-14"
        >
          <h1 className="text-4xl font-semibold">Entrar</h1>
          <div className="space-y-4">
            <label className="inline-block w-full">
              <input
                type="email"
                placeholder="Email"
                className="input"
                {...register('email', { required: true })}
              />
              {errors.email && (
                <span className="text-orange-600">
                  Insira um e-mail válido.
                </span>
              )}
            </label>
            <label className="inline-block w-full">
              <input
                type="password"
                placeholder="Senha"
                className="input"
                {...register('password', { required: true })}
              />
              {errors.password && (
                <span className="text-orange-600">
                  Senha deve conter entre 4 e 60 caracteres.
                </span>
              )}
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded bg-[#e50914] py-3 font-semibold"
          >
            {loading ? (
              <CircularProgress color="inherit" size={15} />
            ) : (
              'Entrar'
            )}
          </button>
          <div className="text-[gray]">
            Não tem uma conta?
            <button
              type="button"
              onClick={() => setIsLoginScreen(false)}
              className="ml-4 text-white hover:underline"
            >
              Criar conta
            </button>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 
      md:max-w-md md:px-14"
        >
          <h1 className="text-4xl font-semibold">Entrar</h1>
          <div className="space-y-4">
            <label className="inline-block w-full">
              <input
                type="email"
                placeholder="Email"
                className="input"
                {...register('email', { required: true })}
              />
              {errors.email && (
                <span className="text-orange-600">
                  Insira um e-mail válido.
                </span>
              )}
            </label>
            <label className="inline-block w-full">
              <input
                type="password"
                placeholder="Senha"
                className="input"
                {...register('password', { required: true })}
              />
              {errors.password && (
                <span className="text-orange-600">
                  Senha deve conter entre 4 e 60 caracteres.
                </span>
              )}
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded bg-[#e50914] py-3 font-semibold"
          >
            {loading ? (
              <CircularProgress color="inherit" size={15} />
            ) : (
              'Criar conta'
            )}
          </button>
          <div className="text-[gray]">
            Já tem uma conta?
            <button
              type="button"
              onClick={() => setIsLoginScreen(true)}
              className="ml-4 text-white hover:underline"
            >
              Faça login aqui.
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
