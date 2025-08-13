'use client'

import Link from 'next/link';
import Cookies from 'js-cookie';
import styles from "../../styles/Main.module.css"
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 

export default function Usuario() {
  const router = useRouter();
  const [erro, setErro] = useState('');
  const [client, setClient] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  
  function validarCampos({ client, email, cep }: {
    client: string;
    email: string;
    cep: string;
  }) {
    const cepRegex = /^\d{5}-?\d{3}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validacoes = [
      { cond: client.trim().length === 0, msg: "Cliente não pode ser vazio" },
      { cond: email.trim().length === 0, msg: "E-mail não pode ser vazio" },
      { cond: !emailRegex.test(email), msg: "Formato de e-mail inválido" },
      { cond: cep.trim().length === 0, msg: "CEP não pode ser vazio" },
      { cond: !cepRegex.test(cep), msg: "CEP inválido" },
    ];

    for (const v of validacoes) {
      if (v.cond) throw new Error(v.msg);
    }
  }

  async function request() {
    try {
      validarCampos({ client, email, cep });

      const apiBase = process.env.NEXT_PUBLIC_API_BASE;
      const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;

      const clientPayload = {
        name: client.trim(),
        email,
        cep,
      };

      await enviarRequisicao(`${apiBase}/${apiVersion}/client`, clientPayload);

      setErro('');
      router.push('/frete');
    } catch (err: any) {
      setErro('Erro ao autenticar');
    }
  }

  async function enviarRequisicao(url: string, payload: object) {
    const token = Cookies.get('token');

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
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
    <main className={styles.container}>
      <Link href="/frete">
        <img className={styles.logo} src="/globe.svg" alt="Logo" />
      </Link>

      <h2 className={styles.title}>CRIAR CLIENTE</h2>

      <input 
        className={styles.input}
        type="client"
        placeholder="Cliente"
        value={client}
        onChange={e => setClient(e.target.value)}/>

      <input 
        className={styles.input}
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}/>

      <input 
        className={styles.input}
        type="cep"
        placeholder="CEP"
        value={cep}
        onChange={e => setCep(e.target.value)}/>

      <button className={styles.button} onClick={request}>Cadastrar</button>

      {erro && <p className={styles.error}>{erro}</p>}
    </main>
  );
}