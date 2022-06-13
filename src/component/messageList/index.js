import React from "react";
import FrogAvatar from '../../asset/img/pepefrog3.jpg';
const MessageList = props => {

    return (
        <div className="msgListWrap mt-3 bg-white p-2 rounded-lg">
            <h2 className="text-blue-700 mb-5 text-3xl font-bold">
                Message list :
            </h2>
             {
                 props.allWaves.map((e,i)=> {
                     return (
                         <div key={i} className="msgBox p-2 mt-5  flex flex-row flex-wrap bg-gray-200">
                             <div className="w-1/4  mr-2">
                                 <div className="imgWrap overflow-hidden relative rounded-lg">
                                    <img src={FrogAvatar} className="w-full inline"  alt="frog"/>
                                 </div>
                             </div>
                             <div className="w-2/4 ">
                                 <ul className="list-none text-left">
                                    <li>
                                        <span className="text-red font-bold text-base text-blue-700">Address:</span>
                                        <span className="text-sm">{e.address}</span>
                                    </li>
                                    <li>
                                        <span className="font-bold text-base text-blue-700">Time:</span>
                                        <span className="text-sm">{e.timestamp.toString()}</span>
                                    </li>
                                    <li>
                                         <label className="font-bold text-base text-blue-700">Message:</label>
                                         <p className="font-bold text-sm">{e.message}</p>
                                    </li>
                                 </ul>
                             </div>
                         </div>    
                     )
                 })
             }
        </div>
    )
 }

 export default MessageList;