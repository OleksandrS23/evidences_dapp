import React, { useState } from 'react';
import { newContextComponents } from "@drizzle/react-components";
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';

const { AccountData, ContractData, ContractForm } = newContextComponents;

const AccountBox = styled.div`
border: 1px solid #ccc;
border-radius: 8px;
padding: 5px;
justify-content: start;
`;
const Address = styled.div`
font-size: 11px;
font-weight: bold;
margin-bottom: 1px;
`;

const Balance = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

function Header (props){

    // const [accountAddress, setAccountAddress] = useState('');
    // const handleSendToAPI = async () => {
    //     try {
    //         console.log(accountAddress)
    //       // Chamar sua API aqui usando o endereço da conta Ethereum
    //     //   const response = await fetch('SUA_API_URL', {
    //     //     method: 'POST',
    //     //     headers: {
    //     //       'Content-Type': 'application/json',
    //     //     },
    //     //     body: JSON.stringify({ address: accountAddress }),
    //     //   });
    
    //       // Lógica para lidar com a resposta da API, se necessário
    //     } catch (error) {
    //       console.error('Erro ao enviar para a API:', error);
    //     }
    //   };

    return (
            <AccountData
              drizzle={props.drizzle}
              drizzleState={props.drizzleState}
              accountIndex={0}
              units="ether"
              precision={3}
              render={({ address , balance}) => {
                // setAccountAddress(address); // Armazena o endereço no estado
                return (
                <AccountBox>
                  <Address>Account Address: {address}</Address>
                  <Balance>Balance: {balance} ETH</Balance>
                </AccountBox>); // Exibe o endereço
              }}
              />
  )
}

export default Header;