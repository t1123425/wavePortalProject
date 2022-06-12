import React,{useEffect,useState} from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
import ButtonGroup from "./component/buttonGroup";
export default function App() {
  const contractABI = abi.abi;
  const { ethereum } = window;
  let provider = null;
  let signer = null;
  let wavePortalContract = null;
  const [currentAccount,setCurrentAccount] = useState("");
  const [waveCount,setWaveCount] = useState(0);
  const [bgStatus,setBgStatus] = useState('init');


  const changeBg = () => {
     switch (bgStatus) {
        case 'mining':
          return 'frog2'
        case 'finish':
          return 'frog3'
        case 'error':
          return 'frog_error'
        default:
          return 'frog1'
     }
  }
  const changeMsg = () => {
      if(bgStatus === 'finish'){
        return <h3>Done !! Thank you</h3>
      }else if(bgStatus === 'mining'){
         return <p> Mining... Plesae wait a mins</p>
      }else{
        return <>
           <p>My name is Tom , Nice to meet you guys.</p>
           <p>Please give me a wave, Thank you</p>
        </>
      }
  }
  const checkWalletConnect = async () => {
    try{
      setBgStatus('init');
      if(!ethereum){
        console.log('make sure you have MetaMask!');
        setBgStatus('error');
        return;
      }else{
        console.log("We have the ethereum object", ethereum);
      }
       /*
      * Check if we're authorized to access the user's wallet
      */
       const accounts = await ethereum.request({ method: "eth_accounts" });
       if(accounts.length > 0){
         const account = accounts[0];
         console.log("Found an authorized account:", account);
         setCurrentAccount(account);
         await checkEtherProvider();
         await refreshWaveCount();
       }else{
          setBgStatus('error');
          console.log("No authorized account found")
       }

    }catch(err){
      setBgStatus('error');
      console.error(err);
    }
  }
  const checkEtherProvider = async () => {
    provider = new ethers.providers.Web3Provider(ethereum);
    signer = provider.getSigner();
    wavePortalContract = new ethers.Contract(process.env.REACT_APP_WAVEPORTAL_ADDRESS, contractABI, signer);
  }
  const refreshWaveCount = async () => {
    const count = await wavePortalContract.getTotalWaves();
    console.log('count:',count);
    setWaveCount(count.toNumber())
  }

  const connectWallet = async () => {
    try {
      if(!ethereum){
        alert("Get MetaMask!");
        setBgStatus('error');
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      //console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      // await checkWaveCount(ethereum);
    }catch (error){
      setBgStatus('error');
      console.log(error);
    }
  }
  
  const wave = async () => {
    try{
      const {ethereum} = window;
      if(ethereum){
        // const provider = new ethers.providers.Web3Provider(ethereum);
        // const signer = provider.getSigner();
        // const wavePortalContract = new ethers.Contract(process.env.REACT_APP_WAVEPORTAL_ADDRESS, contractABI, signer);
        // let count = await wavePortalContract.getTotalWaves();
        // console.log("Retrieved total wave count...", count.toNumber());
        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave();
        setBgStatus('mining');
        console.log("Mining...", waveTxn.hash);
        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        await refreshWaveCount();
        // count = await wavePortalContract.getTotalWaves();
        // setWaveCount(count.toNumber());
        setBgStatus('finish');
        console.log("Retrieved total wave count...",waveCount);
      }else{
        console.log("Ethereum object doesn't exist!");
        setBgStatus('error');
      }
    }catch(err){
      setBgStatus('error');
      console.log(err);
    }
  }
  const checkButtonStatus = () => {
     if(currentAccount){
        if(bgStatus === 'init' || bgStatus === 'finish'){
          return 'connected';
        }else if(bgStatus === 'mining'){
          return 'loading';
        }
        return 'unconnected';
     }else{
       return null;
     }
  }
  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkWalletConnect();
  },[]);  

  return (
    <div className="w-full h-full flex flex-col text-center justify-center bg-slate-900 flex-wrap mainContainer">
      <div className="dataContainer w-full bg-slate-400 p-3 rounded-md">
        <div className="header">
          <h1 className="text-3xl font-bold underline">
            <span role="img">👋</span> Hey What Up!
          </h1>
         </div>
        <div className="bio mt-5 mb-5">
          <div className={"imgBg "+changeBg()}></div>
          {
            changeMsg()
          }
        </div>
        {
          currentAccount && bgStatus !== 'error'? (
            <div className="waveCountBox mt-5 text-center">
              <p>the Current Wave Count :</p>
              <h2 className="text-white">{waveCount}</h2>
          </div>
          ):<p className="text-red-600"> oops~ something wrong</p>
        }
        <ButtonGroup status={checkButtonStatus()} wave={wave} connectWallet={connectWallet} ></ButtonGroup>
      </div>
    </div>
  );
}
