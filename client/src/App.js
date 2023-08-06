import "bootstrap/dist/css/bootstrap.min.css"; // Importe o arquivo CSS do Bootstrap
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import drizzleOptions from "./configs/drizzleOptions";
import Header from "./components/Header";
import Home  from "./pages/Home"
import Participants from "./pages/Participants";
import Evidences from "./pages/Evidences";
import MyNavBar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const drizzle = new Drizzle(drizzleOptions);
function App() {
  return (
    <DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {(drizzleContext) => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          if (!initialized) {
            return "Loading...";
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
