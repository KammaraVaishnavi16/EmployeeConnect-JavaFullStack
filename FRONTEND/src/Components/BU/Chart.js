import React from 'react';
import { getEmployeeByEmail } from '../../Service/EmployeeService';
import { getMeetBuQuater } from '../../Service/MeetService';
import { useEffect } from 'react';
import { useContext } from 'react';
import Context from '../Authentication';
import { useState } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Cell } from 'recharts';
import { Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

function Chart(props) {
    const x = window.location.pathname;
    const arr = x.split('/');
    const quater = arr[arr.length-1];
    const reader = useContext(Context);
    const {mail} = reader;
    
    const [red,setRed] = useState(0);
    const [amb,setAmb] = useState(0);
    const [green,setGreen] = useState(0);
    const history = useNavigate();
    useEffect(()=>{
        getEmployeeByEmail(mail).then((res)=>{
            
            getMeetBuQuater(res.data.bu.id,quater).then((x)=>{
                
                x.data.map((a)=>{
                    if(a.ragStatus===1){
                        setRed(red+1);
                    }else if(a.ragStatus===2){
                        setAmb(amb+1);
                    }else if(a.ragStatus===3){
                        setGreen(green+1);
                    }
                })
            })
        })
        
    },[]);

    const getData = ()=>{
        const data = [
            {category: 'RED', employees: red},
            {category: 'AMBER', employees: amb},
            {category: 'GREEN', employees: green},
            console.log(green)
          ];
          return data;
    }

    const handleBack = ()=>{
        history(`/qua/${quater}`)
    }

    const colors = ["#dc3545", '#ffbf00', '#28a745'];

    return (
        <div className='contentContainer'>
             <div className='barHeading'><h2 style={{marginTop:"6px"}}>BAR CHART</h2></div>
            <div style={{display:"flex",justifyContent:"center",alignItems:"center", marginTop:"100px"}}>
           
            <BarChart width={600} height={300} data={getData()} layout="vertical">
      <YAxis
        dataKey="category"
        type="category"
        label={{
          value: 'RAG Status',
          position: 'insideLeft',
          angle: -90,
          style: { textAnchor: 'middle', fontSize: '14px', fontWeight: 'bold' },
        }}
        tick={{ dy: 10 }}
        interval={0}
        width={100}

      />
      <XAxis
        type="number"
        label={{
          value: 'Employees',
          position: 'insideBottom',
          style: { textAnchor: 'middle', fontSize: '14px', fontWeight: 'bold' },
        }}
        tick={{ dx: -10 }}
        height={50}
      />
      <Tooltip />
      <Bar dataKey="employees" animationDuration={1000}>
        {getData().map((entry, index) => (
          <Cell key={index} fill={colors[index % colors.length]} />
        ))}
      </Bar>
    </BarChart>
    
        </div>
        <div><button className='back' onClick={handleBack}>BACK</button></div>
        </div>
      );
}

export default Chart;