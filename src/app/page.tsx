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
    console.log("Clicou no botao")
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

      {erro && <p className={Styles.error}>{erro}</p>}
    </main>
  );
}