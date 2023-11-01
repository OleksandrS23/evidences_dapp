import React from "react";
import { motion } from "framer-motion";
import Container from "react-bootstrap/Container";
import Image from 'react-bootstrap/Image';
import loadingLogo from "../images/loading.gif"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Loader = () => {
  return (
    <Container>
      <div>
      <h1>Instalação do MetaMask Necessária</h1>
      <p>
        Para acessar esta aplicação, é necessaria a extensão do MetaMask, uma extensão de carteira de criptomoedas para navegadores.
      </p>
      <p>
        Siga os passos abaixo para instalar o MetaMask:
      </p>
      <ol>
      <li>
          <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">
            Descarregue o MetaMask
          </a> na Chrome Web Store ou no site oficial.
        </li>
        <li>Instale a extensão no navegador.</li>
        <li>Crie uma nova carteira ou restaure uma existente.</li>
        <li>Na extensão, no canto superior direito ative as <b>Test Networks</b> e selecione <b>Sepolia</b>.</li>
        <li>No <a href="https://sepolia-faucet.pk910.de/" target="_blank" rel="noopener noreferrer">
            sepolia faucet
          </a> coloque o seu endereço publico da carteira para minerar algum Ether (somente para teste).</li>
      </ol>
      <p>
        Após a instalação do MetaMask e a configuração da carteira, será possivel acessar a aplicação.
      </p>
    </div>
      <Row className="justify-content-center align-items-center vh-100">
        <Col className="text-center">
          <Image src={loadingLogo} alt="Loading"/>
        </Col>
      </Row>
    </Container>
  );
};

export default Loader;