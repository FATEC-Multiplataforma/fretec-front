'use client'

import { useRouter } from 'next/navigation'; 
import styles from "../../styles/Frete.module.css"

type ClienteInfo = {
  cliente: string;
  cep: string;
  uf: string;
  valor: number;
  status: string;
};

export default function Frete() {
  const router = useRouter();
  
  const dados: ClienteInfo[] = [
    { cliente: 'João Silva', cep: '06455-000', uf: 'SP', valor: 150.75, status: 'Ativo' },
    { cliente: 'Maria Souza', cep: '01001-000', uf: 'RJ', valor: 89.90, status: 'Inativo' },
    { cliente: 'Carlos Lima', cep: '30140-110', uf: 'MG', valor: 230.00, status: 'Pendente' },
    { cliente: 'Ana Costa', cep: '80010-000', uf: 'PR', valor: 120.50, status: 'Ativo' },
  ];

  console.log(dados);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Lista de Clientes</h2>
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>CEP</th>
            <th>UF</th>
            <th>Valor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((item, index) => (
            <tr key={index}>
              <td>{item.cliente}</td>
              <td>{item.cep}</td>
              <td>{item.uf}</td>
              <td>R$ {item.valor.toFixed(2)}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.botoes}>
        <button className={styles.botao} onClick={() => router.push('/usuario')}>Cadastrar Cliente</button>
        <button className={styles.botao} onClick={() => router.push('/pedido')}>Novo Pedido</button>
      </div>
    </div>
  );
}