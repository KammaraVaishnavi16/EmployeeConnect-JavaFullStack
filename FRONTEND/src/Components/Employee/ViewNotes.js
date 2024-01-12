import React from 'react'
import { useEffect } from 'react'
import { findMeetById, updateRemarks } from '../../Service/MeetService'
import { useState } from 'react'

function ViewNotes({x,id}) {
  const [note,setNote] = useState("");
  const [rem,setRem] = useState("");
  const [check,setCheck] = useState(true);
  useEffect(()=>{
    findMeetById(id).then((res)=>{
        setNote(res.data.hrNotes);
        setRem(res.data.empRemarks);
        setCheck(res.data.edited)
    })
  },[])

  const handleUpdate=()=>{
    const meet = {
      empRemarks:rem
    }
    console.log(JSON.stringify(meet));
    updateRemarks(id,meet).then((res)=>{
        console.log(res.data);
        setRem("");
        x(false);
    })
  }
  return (
    <div className='contentContainer'>
        <div className="overlay"></div>
        <div className="popupview" style={{width:"600px"}}>

        <div className='tag'><h2>CONNECT OUTCOMES</h2></div>

        <div className='subtag'  style={{marginTop:"30px"}}><h4>HR NOTES</h4></div>

        <p style={{marginTop:"10px"}}>{note}</p>

        <div className='subtag' style={{marginTop:"30px"}}><h4>EMPLOYEE REMARKS</h4></div>

        {!check&&<>
          <textarea value={rem}  onChange={(e)=>setRem(e.target.value)} style={{marginTop:"10px"}} rows={10} cols={50} placeholder='Add Remarks'/>
          <div>
            <button className='btn_close' style={{backgroundColor:"#636aea"}}onClick={()=>handleUpdate()} >UPDATE</button>
          </div>
        </>}
        {check&&<>
          <p style={{marginTop:"10px"}}>{rem}</p>
        </>}
 
        <button className='btn_close' style={{backgroundColor:"#dc3545",marginTop:"30px"}} onClick={()=>x(false)} >Close</button>
        </div>
 `  </div>
  )
}

export default ViewNotes