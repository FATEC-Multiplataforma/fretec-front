'use client'

import Link from 'next/link';
import Cookies from 'js-cookie';
import Styles from "../styles/Main.module.css"
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

export default function Home() {
  const router = useRouter();
  const [erro, setErro] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function request() {
    try {
      if(login.trim().length === 0) {
        throw new Error("Login nao pode ser vazio");
      }

      if(password.trim().length === 0) {
        throw new Error("Senha nao pode ser vazio");
      }

      const payload = {
        username: login.trim(),
        password: password
      };

      const apiBase = process.env.NEXT_PUBLIC_API_BASE;
      const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;
      
      const data = await enviarRequisicao(`${apiBase}/${apiVersion}/auth/login`, payload);

    if (data.token) {
      Cookies.set('token', data.token, { expires: 1, path: '/' });
      window.location.href = '/frete';
    } else {
      alert('Token não recebido');
    }
    } catch (err: any) {
      setErro('Erro ao autenticar');
    }
  }

  async function enviarRequisicao(url: string, payload: object) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const erro = await response.text();
      throw new Error(`Erro do servidor: ${erro}`);
    }

    return await response.json();
  }

  return (
    <main className={Styles.container}>
      <Link href="/">
        <img className={Styles.logo} src="/globe.svg" alt="Logo" />
      </Link>

      <h2 className={Styles.title}>LOGIN</h2>

      <input 
        className={Styles.input}
        type="login"
        placeholder="Login"
        value={login}
        onChange={e => setLogin(e.target.value)}/>

      <div className={Styles.passwordWrapper}>
        <input
          className={Styles.input}
          type={showPassword ? 'text' : 'password'}
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)} />
        <span
          className={Styles.toggle}
          onClick={() => setShowPassword(!showPassword)}
          title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}> {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
        </span>
      </div>

      <button className={Styles.button} onClick={request}>Realizar Login</button>

      <div className={Styles.requisitos}>
        <p className={Styles.link} onClick={() => router.push('/usuario')}>
          Não tem uma conta? <strong>Crie agora</strong>
        </p>
      </div>

      {erro && <p className={Styles.error}>{erro}</p>}
    </main>
  );
}