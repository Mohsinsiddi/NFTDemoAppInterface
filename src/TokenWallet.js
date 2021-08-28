import React, { useEffect, useState } from "react";
import { drizzleReactHooks } from "@drizzle/react-plugin";
import { newContextComponents } from "@drizzle/react-components";
import { Drizzle } from "@drizzle/store";
import options from './drizzleOptions';

const { useDrizzle, useDrizzleState } = drizzleReactHooks;
const { ContractData, ContractForm } = newContextComponents;

const drizzle = new Drizzle(options);

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [nftBal,setNftbal]= useState(0);
  const state = useDrizzleState(state => state);
 


  useEffect(()=>{
    console.log(drizzle.contracts.ERC721Token.methods)
    drizzle.contracts.ERC721Token.methods.balanceOf(state.accounts[0]).call().then(res=>{
      setNftbal(res);
    }).catch()
    
  },[])

  return (
    <div className="App">
      <div>
        <h2>NFT minted : {nftBal}</h2>
       
      </div>
      {/* <div>
        <h2>Transfer from</h2>
        <ContractForm
          drizzle={drizzle}
          contract="ERC721Token"
          method="transferFrom"
        />
      </div>
      <div>
        <h2>Safe Transfer from</h2>
        <ContractForm
          drizzle={drizzle}
          contract="ERC721Token"
          method="safeTransferFrom"
        />
      </div>
      <div>
        <h2>Approve</h2>
        <ContractForm
          drizzle={drizzle}
          contract="ERC721Token"
          method="approve"
        />
      </div> */}
    </div>
  );
};