import React from 'react';
import { newContextComponents } from "@drizzle/react-components";
import Header from '../components/Header';

const { AccountData, ContractData, ContractForm } = newContextComponents;


function Participants (props) {


  return (
    <div>
    <h2>Participants</h2>
    <div className="section">
          <p>
          <ContractData
            drizzle={props.drizzle}
            drizzleState={props.drizzleState}
            contract="EvidenceChain"
            method="getParticipant"
            render={(participantData) => {
              console.log(participantData)
              if (participantData!=null && participantData!=undefined){
              return <span>{participantData.userName}</span>;
              }
            }}
          />{" "}
           </p>
        {/* <ContractForm drizzle={props.drizzle} contract="SimpleStorage" method="set" /> */}
      </div>
  </div>
  );
};

export default Participants;