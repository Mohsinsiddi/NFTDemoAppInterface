import React, { useState, useEffect } from "react";

import { drizzleReactHooks } from "@drizzle/react-plugin";
import { newContextComponents } from "@drizzle/react-components";

// const ipfsAPI = require('ipfs-api');
// const ipfs = ipfsAPI('ipfs', 5001,{protocol : "http"});

import { Drizzle } from "@drizzle/store";
import options from './drizzleOptions';

const drizzle = new Drizzle(options);

const ipfsClient = require('ipfs-http-client');

const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
const { useDrizzle, useDrizzleState } = drizzleReactHooks;
const { ContractForm } = newContextComponents;
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [nftBal,setNftbal]= useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [images,setImages] = useState([]);
  const [nftUri,setnftUri] = useState("");
  const [buff,setBffr] = useState([]);
  const { drizzle } = useDrizzle();
  const state = useDrizzleState(state => state);

  let dotransaction = async (data)=>{
    await drizzle.contracts.ERC721Token.methods.mint(data).send().then(function(finalResult) {
    
      console.log('Got the final result: ' + finalResult);
    })
    .catch();
  }


  

  let captureFile = (event) => {

    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      const res = Buffer(reader.result);
      setBffr(res);
    }
  }

  let uploadImage = (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")
    console.log(buff)

    //adding file to the IPFS
    ipfs.add(buff, (error, result) => {
      console.log('Ipfs result', result)
      if(error) {
        console.error(error)
        return
      }
      dotransaction(result[0].hash)
    })
  }
  const init = async () => {
    var bal=0;
    await drizzle.contracts.ERC721Token.methods.balanceOf(state.accounts[0]).call().then(res=>{
      bal = res;
    }).catch()
  

    for (var i=0; i<bal; i++) {
        await drizzle.contracts.ERC721Token.methods.tokenOfOwnerByIndex(state.accounts[0],i).call().then(res=>{
          drizzle.contracts.ERC721Token.methods.tokenURI(res).call().then(res=>{  
            setImages(images=>[...images,res]);
          });
      }).catch()
     
    }
  }
  useEffect(() => {
    init();
  },[]);

  // if(!isAdmin) {
  //   return null;
  // }

  return (
    <div className="App">
      <div>
        {/* <h2>Mint</h2> */}
        {/* <ContractForm
          drizzle={drizzle}
          contract="ERC721Token"
          method="mint"
          methodArgs={nftUri}
        /> */}
      </div>
      <div>
      <p>&nbsp;</p>
              <h2>MINT new NFT</h2>
              <form onSubmit={
                uploadImage} >
                <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={captureFile} />
                <button type="submit" class="btn btn-primary btn-block btn-lg">Upload!</button>
              </form>
              <p>&nbsp;</p>
      </div>

      <div>
      { images.map((image, key) => {
                return(
                  <div className="card mb-4" key={key} >
                    <div className="card-header">
                      {/* <small className="text-muted">{image}</small> */}
                    </div>
                    <ul id="imageList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p class="text-center"><img src={`https://ipfs.infura.io/ipfs/${image}`} style={{ maxWidth: '420px'}}/></p>
                      </li>
                      {/* <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          TIPS: {window.web3.utils.fromWei(image.tipAmount.toString(), 'Ether')} ETH
                        </small>
                      </li> */}
                    </ul>
                  </div>
                )
              })}
      </div>
      
    </div>
  );
};