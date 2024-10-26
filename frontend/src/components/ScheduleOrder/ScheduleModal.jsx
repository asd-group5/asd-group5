import { useState } from 'react';

export default function ScheduleModal({ onClose }) {
    const [orderDate, setOrderDate] = useState(new Date());
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const time = new Date();
    const min = time.toISOString().slice(0,new Date().toISOString().lastIndexOf(":"));
    console.log(min);
    
    const validateDate = () =>{
        if(orderDate < new Date()){
            console.log("Error! Invalid date");
            setErrorMessage("Invalid date provided! Cannot schedule for the past!")
            setError(true);
        }else if(orderDate < (new Date().getTime() + (600000 * 3))){
            setErrorMessage("Must schedule for greater than 30 minutes!")
            setError(true);
        }else{
            console.log("Success!");
            onClose();
        } 
    }


    return (
        <div className="modal-back" onClick={onClose}>   
            <div className="modal" onClick={e => {e.stopPropagation()}}>
                <h3>Schedule Order</h3>
                <input 
                    style={{fontSize: '2em'}}
                    type='datetime-local' 
                    min={min}
                    onChange={(e) => {setOrderDate(new Date(e.target.value))}}/>
                {error ? 
                <div className="errorPopup" role="alert">
                    <strong style={{fontWeight: "700"}}>Error! </strong>
                    <span className='errorMessage'>{errorMessage}</span>
                    <span className='error'>
                        <svg 
                            onClick={() => {setError(false)}}
                            style={{"width":"1.5rem","height":"1.5rem","color":"#EF4444","fill":"currentColor"}} 
                            role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                    </span>
                </div>
                :null}
                <div>
                    <button onClick={validateDate}>Submit</button>
                    <button onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
  }
  