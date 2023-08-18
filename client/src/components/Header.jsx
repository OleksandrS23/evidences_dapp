import React from "react";
import { newContextComponents } from "@drizzle/react-components";
import styled from "styled-components";

const { AccountData } = newContextComponents;

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

function Header(props) {
  return (
    <AccountData
      drizzle={props.drizzle}
      drizzleState={props.drizzleState}
      accountIndex={0}
      units="ether"
      precision={3}
      render={({ address, balance }) => {
        return (
          <AccountBox>
            <Address>Account Address: {address}</Address>
            <Balance>Balance: {balance} ETH</Balance>
          </AccountBox>
        );
      }}
    />
  );
}

export default Header;
