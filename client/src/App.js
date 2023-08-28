import React, { useState, useEffect, Fragment } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"; // Importe o arquivo CSS do Bootstrap
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import drizzleOptions from "./configs/drizzleOptions";
import Header from "./components/Header";
import Home  from "./pages/Home"
import Entities from "./pages/Entities";
import Evidences from "./pages/Evidences";
import MyNavBar from "./components/Navbar";
import Loader from "./components/Loader";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const drizzle = new Drizzle(drizzleOptions);

function App() {
  const [drizzleReadinessState, setDrizzleReadinessState] = useState({ drizzleState: null, loading: true });
  const [tokenData, setTokenState] = useState();

  useEffect(() => {
    const unsubscribe = drizzle.store.subscribe(() => {
      const drizzleState = drizzle.store.getState();

      if (drizzleState.drizzleStatus.initialized) {
        setDrizzleReadinessState({ drizzleState: drizzleState, loading: false });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [drizzle.store]);

  useEffect(() => {
    // Defina o manipulador para ouvir o evento "accountsChanged"
    const handleAccountsChanged = async (accounts) => {
      // Recarregue a página
      localStorage.removeItem("token")
      window.location.reload();
    };

    const token = localStorage.getItem("token");
    setTokenState(token);
    // Verifique se o MetaMask está instalado
    if (window.ethereum) {
      // Adicione o manipulador de eventos
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      // Remova o manipulador de eventos ao desmontar o componente
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  return (
    <DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {(drizzleContext) => {
          const { drizzle, drizzleState } = drizzleContext;

          if (drizzleReadinessState.loading) {
            return <Loader />;
          }

          return (
            <Router>
              <MyNavBar drizzleContext={drizzleContext} token = {tokenData}/>
              <Routes>
                <Route exact path="/" element={<Home drizzleContext={drizzleContext} />} />
                <Route path="/entities" element={<Entities drizzleContext={drizzleContext} />} />
                <Route path="/evidences" element={<Evidences drizzleContext={drizzleContext} />} />
              </Routes>
            </Router>
          );
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  );
}

export default App;
