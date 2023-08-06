import React, { useState, useEffect, Fragment } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"; // Importe o arquivo CSS do Bootstrap
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import drizzleOptions from "./configs/drizzleOptions";
import Header from "./components/Header";
import Home  from "./pages/Home"
import Participants from "./pages/Participants";
import Evidences from "./pages/Evidences";
import MyNavBar from "./components/Navbar";
import Loader from "./components/Loader";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const drizzle = new Drizzle(drizzleOptions);

function App() {
  const [drizzleReadinessState, setDrizzleReadinessState] = useState({drizzleState: null, loading: true})
  const [intervalState, setIntervalState] = useState({interval:true})
  useEffect( 
    () => {
      const unsubscribe = drizzle.store.subscribe( () => {
        // every time the store updates, grab the state from drizzle
        const drizzleState = drizzle.store.getState()
        // check to see if it's ready, if so, update local component state
        if (drizzleState.drizzleStatus.initialized) {
          setDrizzleReadinessState({drizzleState: drizzleState, loading: false})
        }
      })
      return () => {
        unsubscribe()
      }
    }, [drizzle.store, drizzleReadinessState]
  )
  return (
    <DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {(drizzleContext) => {
          const { drizzle, drizzleState } = drizzleContext;

          if (drizzleReadinessState.loading) {
            return <Loader/>;
          }
          return (
            <Router>
              <MyNavBar drizzle={drizzle} drizzleState={drizzleState}/>
              <Routes>
                <Route exact path="/" element={<Home drizzle={drizzle} drizzleState={drizzleState}/>} />
                <Route path="/participants" element={<Participants drizzle={drizzle} drizzleState={drizzleState}/>} />
                <Route path="/evidences" element={<Evidences drizzle={drizzle} drizzleState={drizzleState}/>} />
              </Routes>
            </Router>
          );
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  );
}

export default App;
