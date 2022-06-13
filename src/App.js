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
  const [errorMsg,setErrorMsg] = useState("");


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
        return <>
            <h2 className="font-black text-orange-400 text-lg">Thank for your wave.</h2>
            <h2 className="font-black text-orange-400 text-lg">HAVE A NICE DAY !!</h2>
            <p className="mt-5">the Total Wave Count :</p>
            <h2 className="text-white text-lg">{waveCount}</h2>
          </>
      }else if(bgStatus === 'mining'){
         return <p className="font-bold text-lime-400"> Mining... Plesae wait a mins</p>
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
        //console.log('make sure you have MetaMask!');
        setErrorMsg("Make sure you have MetaMask!");
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
        //  await refreshWaveCount();
       }else{
          setBgStatus('error');
          setErrorMsg("Please Connect the wallet");
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
    // console.log('count:',count);
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
      console.error(error);
    }
  }
  
  const wave = async () => {
    try{
      const {ethereum} = window;
      if(ethereum){
        await checkEtherProvider();
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
      console.error(err);
    }
  }
  const checkButtonStatus = () => {
     if(currentAccount){
        if(bgStatus === 'mining'){
          return 'loading';
        }else{
          return 'connected';
        }
     }else{
      return 'unconnected';
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
        <div className="mt-5 text-center">
          {
            bgStatus === 'error' && (
              <>
               <p className="text-red-600"> oops~ something wrong</p>
               <p className="text-red-600">{errorMsg}</p>
              </>
            )
          }
        </div>
        <ButtonGroup status={checkButtonStatus()} wave={wave} connectWallet={connectWallet} ></ButtonGroup>
      </div>
    </div>
  );
}
