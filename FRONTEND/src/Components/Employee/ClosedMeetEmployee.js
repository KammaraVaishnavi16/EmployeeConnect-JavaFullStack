import React from 'react';
import ViewNotes from './ViewNotes';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import Context from '../Authentication';
import { getEmployeeMeetByStatus } from '../../Service/MeetService';

function ClosedMeetEmployee(props) {
    const [popUp,setPopUp]=useState(false);
    const [remarkPop,setRemarkPop]=useState(false);
    const [id,setId] = useState(-1);
    const reader = useContext(Context);
    const {mail} = reader;
    const handleView=(x)=>{
        console.log(x);
        setId(x);
        setPopUp(true);
    }
    const handleRemark=(x)=>{
        setId(x);
        setRemarkPop(true);
    }
    const[meet,setMeet] = useState([]);

    useEffect(()=>{
        getEmployeeMeetByStatus(mail,1).then((res)=>{
            setMeet(res.data);
        })
    })
    return (
        <div className='contentContainer'>
            {meet.length===0?
            <h2 style={{margin:"20px",textAlign:"center"}}>NO CLOSED MEETS</h2>:<>
            <div className='tableContainer'>
                <table className='center'>
                  <caption>CLOSED MEETS</caption>
                <thead>
                    <tr>
                        
                        <th>HR NAME</th>
                        <th>DATE</th>
                        <th>TIME</th>
      
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>

                    {meet.map((v)=>{
                        return(<tr>
                            <td>{v.hr.name}</td>
                            <td>{v.date}</td>
                            <td>{v.time}</td>
                            <td>
                        
                            <button className='notes_btn' style={{height:"40px"}} onClick={()=>handleView(v.id)}>CONNECT OUTCOMES</button>
                        </td>
                        </tr>)
                    })}
                        
                </tbody>
              </table>
              </div>
               {popUp && <ViewNotes x={setPopUp} id={id}/>}
               </>}
        </div>
    );
}

export default ClosedMeetEmployee;