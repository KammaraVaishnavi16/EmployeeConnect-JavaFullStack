import React, { useContext, useEffect, useState } from 'react'
import { addMeet } from '../../Service/MeetService';
import { useNavigate } from 'react-router-dom';
import { findMeetById } from '../../Service/MeetService';
import { getAllMail } from '../../Service/EmployeeService';

import Select from 'react-select';


function ScheduleMeet(props) {

    const a = window.location.pathname;
    const arr = a.split('/');
    const meet_id = arr[arr.length-1];
    const[allMail,setAllMail] = useState([]);
    const [mail,setMail] = useState("");
    const [hr,setHr] = useState("");
    const[end,setEnd] = useState(-1);
    const[date,setDate] = useState(-1);
    const [time, setTime] = useState(-1);
    const [tokenClient,setTokenClient] = useState({});
    const [accessToken,setAccessToken] = useState("");
    const [isAccess, setAccess] = useState(false);
    const history = useNavigate();

    const [isBlurred, setIsBlurred] = useState(false);



    function handleClick(e){
        e.preventDefault();
        setHr(window.sessionStorage.getItem('mail'));
        tokenClient.requestAccessToken();
        setAccess(true);
    }
    function handleCreate(e){
        e.preventDefault();
        setIsBlurred(true);
        fetch ('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',{
            method: 'POST',
            headers: {
                'Authorization':'Bearer '+accessToken
            },
            body:JSON.stringify(TEST_EVENT)
        }).then((data) => {
            return data.json();
        }).then((data) => {
            console.log(data.hangoutLink);
            alert('Event created - Check Google Calendar')
            const meet = {
                date:date,
                time:time,
                employee:mail,
                hr:hr,
                link:data.hangoutLink
            }
            console.log(meet);
            addMeet(meet).then(()=>{
                setIsBlurred(false);
                history('/');
            })
        })

    }

    const TEST_EVENT = {
        'description': 'This is a new Schedule',
        'summary':'QUATERLY HR MEET',
        'start': {
        'dateTime': `${date}T${time}:00`,
        'timeZone': 'Asia/Calcutta'
        },
        'end': {
        'dateTime': `${date}T${end}:00`,
        'timeZone': 'Asia/Calcutta'
        },
        "conferenceData": {
        "createRequest": {
            "conferenceSolutionKey": {
            "type": "hangoutsMeet"
            },
            "requestId": "abcd"
        },
        },
        'attendees': [
            {'email':`${mail}`},
            {'email':`${hr}`}
        ],
        'reminders': {
        'useDefault': false,
        'overrides': [
            {'method': 'email', 'minutes': 60 },
            {'method': 'popup', 'minutes': 10}
        ]
        }
    };
    const cancel = (e)=>{setSelectedOption(null)
        e.preventDefault();
        console.log(date);
        console.log(time);
        console.log(mail);
        console.log(hr);
        console.log(end)
    }
    useEffect(()=>{
        if(meet_id!=-1){
            findMeetById(meet_id).then((res)=>{
                setMail(res.data.employee.email);
                const x = {}
                x['value']=res.data.employee.email;
                x['label']=res.data.employee.email;
                setSelectedOption(x);
                
            })
        }
        getAllMail().then((res)=>{
            setAllMail(res.data);
        })

        /* global google */
        const google = window.google;
        setTokenClient(
            google.accounts.oauth2.initTokenClient({
            client_id:"568792078547-mk250d3ov332nr0cvntliv9cndl9u3bs.apps.googleusercontent.com",
            scope:"openid email profile https://www.googleapis.com/auth/calendar",
            callback:(tokenResponse)=>{
                console.log(tokenResponse);
                setAccessToken(tokenResponse.access_token);
            }
            })
        )
    },[])

    

      const getMails = ()=>{
        const options = [];
        allMail.map((v)=>{
            const x = {}
            x['value']=v;
            x['label']=v;
            options.push(x);
        })
        return options;
      }

       const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        setMail(selectedOption.value);
        };

        const [selectedOption, setSelectedOption] = useState(null);

        const selectStyles = {
            container: (provided) => ({
              ...provided,
            //   width: 200, // Custom container width
            maxHeight: 50
            
            }),
            control: (provided) => ({
              ...provided,
            //   backgroundColor: 'lightgray', // Custom control background color
              borderRadius: 8, // Custom control border radius
            }),
            option: (provided) => ({
              ...provided,
              color: 'black', // Custom option color
            }),
            // Add more style definitions as needed
          };

    
    
    return (
        <div id={isBlurred ? "blur" : ""} className='contentContainer'>
            <div className='schedule'>
                    <div className='heading'><h2 style={{marginBottom:"20px"}}>SCHEDULE MEET</h2></div>
                        <form>
                            <div style={{marginTop:"20px"}}>
                                <label >EMPLOYEE MAIL-ID: </label>
                                <Select
                                    value={selectedOption}
                                    onChange={handleChange}
                                    options={getMails()}
                                    isSearchable
                                    placeholder='EMPLOYEE EMAIL-ID'
                                    styles={selectStyles}
                                    />
                            </div>


                            <div style={{marginTop:"20px"}}>
                                <label>DATE: </label>
                                <input style={{height:"50px"}} type='date'
                                value={date}
                                onChange={(e)=>setDate(e.target.value)}  required></input>
                            </div>

                            <div style={{marginTop:"20px"}}>
                                <label>START TIME: </label>
                                <input style={{height:"50px"}} type='time' 
                                value={time}
                                onChange={(e)=>setTime(e.target.value)} required></input>
                            </div>

                            <div style={{marginTop:"20px"}}>
                                <label>END TIME: </label>
                                <input style={{height:"50px"}} type='time' 
                                value={end}
                                onChange={(e)=>setEnd(e.target.value)} required></input>
                            </div>
                            
                            <div style={{marginTop:"20px"}}>
                            < button style={{marginBottom:"20px"}} onClick={handleClick} className='btn_schedule'>ACCESS</button>
                            {isAccess&&< button style={{marginBottom:"20px"}} onClick={handleCreate} className='btn_schedule'>SCHEDULE</button>}
                            {!isAccess&&< button style={{marginBottom:"20px", backgroundColor:"lightgray"}} onClick={handleCreate} disabled className='btn_schedule'>SCHEDULE</button>}
                            < button className='btn_cancel' onClick={cancel}>CANCEL</button>
                            </div>
                            
                            
                        </form>
                </div>
            </div>
    );
}

export default ScheduleMeet;