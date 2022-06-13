import React,{useState} from "react";
import loading from '../../asset/img/loading.gif';
const ButtonGroup = props => {
    const [message,setMessage] = useState('');
    const buttonChange = () => {
        switch(props.status){
            case 'connected':
                return (
                <div className="inputGroup">
                    <input type="text" name="msgInput" placeholder="Say for anything?" onChange={(e)=>{setMessage(e.target.value)}} className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" />
                    <button className="waveButton mt-5 bg-sky-500 w-full text-white" onClick={()=>props.wave(message)}>
                        Send a Wave Message
                    </button>
                </div>)
            case 'loading':
                return  <img src={loading} className="inline"  alt="lOADING"/>
            case 'unconnected':
                return <button  className="waveButton bg-sky-600 w-full text-white" onClick={props.connectWallet}>
                Connect wallet
              </button>  
            default:
                return null
        }
    }
    return (
        <div className="btnGroup">
            {
                buttonChange()
            }
        </div>
    )
}

export default ButtonGroup;