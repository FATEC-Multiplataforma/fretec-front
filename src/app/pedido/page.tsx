'use client'

import Link from 'next/link';
import Cookies from 'js-cookie';
import styles from "../../styles/Main.module.css"
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 

export default function Usuario() {
  const router = useRouter();
  const [erro, setErro] = useState('');
  const [id, setId] = useState('');
  const [client, setClient] = useState('');
  const [frete, setFrete] = useState('');
  
  async function consultarFrete() {
    try {
      const token = Cookies.get('token');

      if (client.trim().length === 0) return;

      const apiBase = process.env.NEXT_PUBLIC_API_BASE;
      const apiVersion = process.env.NEXT_PUBLIC_API_VERSION;

      const resCliente = await fetch(`${apiBase}/${apiVersion}/client/find-name/${client}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!resCliente.ok) throw new Error('Cliente não encontrado');
      const clienteData = await resCliente.json();

      const uf = clienteData.pokemon.uf;

      const resFrete = await fetch(`${apiBase}/${apiVersion}/order/value/${uf}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!resFrete.ok) throw new Error('UF inválida');
      const freteData = await resFrete.json();

      setId(clienteData.id)
      setFrete(`R$ ${freteData.valor.toFixed(2)}`);
      setErro('');
    } catch (err: any) {
      setFrete('');
      setErro(err.message || 'Erro ao consultar frete');
    }
  }

  async function realizarPedido() {
    const token = Cookies.get('token');

    const res = await fetch(`http://localhost:8080/fretec/v1/client/order/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) {
      throw new Error('Erro ao realizar pedido');
    }

    setErro('');
    router.push('/frete');
  }

  return (
    <main className={styles.container}>
      <Link href="/frete">
        <img className={styles.logo} src="/globe.svg" alt="Logo" />
      </Link>

      <h2 className={styles.title}>CRIAR PEDIDO</h2>

      <input 
        className={styles.input}
        type="id"
        placeholder="ID"
        value={id}
        readOnly/>

      <input 
        className={styles.input}
        type="client"
        placeholder="Cliente"
        value={client}
        onChange={e => setClient(e.target.value)}
        onBlur={consultarFrete}/>

      <input 
        className={styles.input}
        type="frete"
        placeholder="Frete"
        value={frete}
        readOnly/>

      <button className={styles.button} onClick={realizarPedido}>Realizar Pedido</button>

      {erro && <p className={styles.error}>{erro}</p>}
    </main>
  );
}