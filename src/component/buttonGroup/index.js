import React from "react";
import loading from '../../asset/img/loading.gif';
const ButtonGroup = props => {

    const buttonChange = () => {
        switch(props.status){
            case 'connected':
                return <button className="waveButton bg-sky-500 w-full text-white" onClick={props.wave}>
                Wave at Me
              </button>
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