import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { getMeetByQuater } from '../../Service/MeetService';
import { useContext } from 'react';
import Context from "../Authentication"
import View from './View';
import { useNavigate } from 'react-router-dom';

function Quater(props) {
    const x = window.location.pathname;
    const arr = x.split('/');
    const quater = arr[arr.length-1];
    const reader = useContext(Context);
    const {mail} = reader;
    const [meet,setMeet] = useState([]);
    const [rag,setRag] = useState(-1);
    const [status,setStatus] = useState(-1);
    const [popUp,setPopUp]=useState(false);
    const [meet_id,setMeetId] = useState(-1);
    const history = useNavigate();
    const handleView=(id)=>{
        setMeetId(id);
        setPopUp(true);
    }

    useEffect(()=>{
        getMeetByQuater(mail,quater).then((res)=>{
            setMeet(res.data);
        })
    });
    const handleRag = (rs)=>{
        setRag(rs);
        setStatus(-1);
    }
    const handleStatus = (s)=>{
        setStatus(s);
        setRag(-1);
    }

    const getContent = ()=>{
        if(rag===-1  && status===-1){
            return meet;
        }else if(rag===1 || rag===2 || rag===3){
            return meet.filter((v)=>{
                    if(v.ragStatus===rag)return v;
            });
        }else if(status===0 ||status===1 ||status===2 ||status===3){
            return meet.filter((v)=>{
                if(v.status===status)return v;
            })
        }
    }

    const getRag = (color)=>{
        if(color===1){
            return <button className='reportview_btn' style={{width:"100px",fontWeight:"normal", fontSize:"13px", backgroundColor:"#dc3545"}}></button>
        }else if(color===2){
            return <button className='reportview_btn' style={{width:"100px",fontWeight:"normal", fontSize:"13px", backgroundColor:"#ffbf00"}}></button>
        }else if(color===3){
            return <button className='reportview_btn' style={{width:"100px",fontWeight:"normal", fontSize:"13px", backgroundColor:"#28a745"}}></button>
        }
    }

    const getStatus = (stat)=>{
        if(stat===3){
            return <button className='reportview_btn' style={{width:"100px",fontWeight:"normal", fontSize:"13px"}}>CANCELED</button>
        }else if(stat===1){
            return <button className='reportview_btn' style={{width:"100px",fontWeight:"normal", fontSize:"13px"}}>COMPLETED</button>
        }else if(stat===2){
            return <button className='reportview_btn' style={{width:"100px",fontWeight:"normal", fontSize:"13px"}}>RE-SCHEDULED</button>
        }else if(stat===0){
            return <button className='reportview_btn' style={{width:"100px",fontWeight:"normal", fontSize:"13px"}}>SCHEDULED</button>
        }
    }
    const getTitle = ()=>{
        if(quater==='1'){
            return <h2 style={{marginTop:"6px"}}>Quarter I (Jan-Mar)</h2>
        }else if(quater==='2'){
            return <h2 style={{marginTop:"6px"}}>Quarter II (Apr-June)</h2>
        }else if(quater==='3'){
            return <h2 style={{marginTop:"6px"}}>Quarter III (July-Sep)</h2>
        }else if(quater=='4'){
            return <h2 style={{marginTop:"6px"}}>Quarter IV (Oct-Dec)</h2>
        }
    }

    const [search,setSearch] = useState("");
    const getFilter = ()=>{
        const content = getContent();
        if(search===""){
            return content;
        }
        const filterBySearch = content.filter((item) => {
            const x = item.employee.name.toLowerCase();
            if (x
                .includes(search.toLowerCase())) { return item; }
        })
        return filterBySearch;

    }
    const handleGraph = ()=>{
        history(`/qua/graph/${quater}`)
    }

    const handleClose = ()=>{
        history('/reportees')
    }

    return (
        <div className='contentContainer'>
            <div className='quarterContainer'>
                <div className='heading'>
                    {getTitle()}
                
                    </div>
                    <button style={{marginLeft:"58px"}} onClick={()=>handleRag(1)} className='redFilter'></button>
                    <button onClick={()=>handleRag(2)} className='yellowFilter'></button>
                    <button onClick={()=>handleRag(3)} className='greenFilter'></button>
                    <input type="text" placeholder="Search.." onChange={(e)=>{setSearch(e.target.value)}} name="search" style={{width:"250px",height:"33px",marginLeft:"30px",marginRight:"30px"}}></input>
                    <button onClick={()=>handleStatus(-1)} className='greyFilter' style={{marginLeft:"10px"}}>ALL</button>
                    <button onClick={()=>handleStatus(0)} className='greyFilter'>SHEDULED</button>
                    <button onClick={()=>handleStatus(1)} className='greyFilter'>COMPLETED</button>
                    <button onClick={()=>handleStatus(2)} className='greyFilter' >RE-SCHEDULED</button>
                    <button onClick={()=>handleStatus(3)} className='greyFilter'>CANCELED</button>
                    
                    <div className='tableContainer'>
                            <table className='center'>
                            
                            <thead>
                                <tr>
                                    
                                    <th>EMPLOYEE NAME</th>
                                    <th>DATE</th>
                                    <th>TIME</th>
                                    <th>STATUS</th>
                                    <th>DETAILS</th>
                                    
                                </tr>
                            </thead>
                            <tbody>

                                {getFilter().map((v)=>{
                                    return(
                                        <tr>
                                            <td>{v.employee.name}</td>
                                            <td>{v.date}</td>
                                            <td>{v.time}</td>
                                            {(v.ragStatus!==0)?<td>{getRag(v.ragStatus)}</td>:
                                            <td>{getStatus(v.status)}</td>}
                                            {v.ragStatus!==0&&<td><button className='reportview_btn' onClick={()=>handleView(v.id)} >VIEW</button></td>}
                                            {v.ragStatus===0&&<td><button style={{background:"lightGrey"}} disabled className='reportview_btn' onClick={()=>handleView(v.id)} >VIEW</button></td>}
                                        </tr>
                                    )
                                })}
                                    
                            </tbody>
                        </table>
                        <button onClick={()=>{handleGraph()}}  style={{marginLeft:"58px"}} className='greyFilter'>GRAPH</button>
                        <button onClick={()=>{handleClose()}}  style={{marginLeft:"20px", backgroundColor:"#dc3545"}} className='greyFilter'>CLOSE</button>
                    </div>
                    
                    {popUp&& <View x={setPopUp} meet_id={meet_id}/>}
            </div>
        </div>
    );
}

export default Quater;