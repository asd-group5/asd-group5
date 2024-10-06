import { useState } from 'react';

export default function InstructionModal({ onClose, instructions, setInstructions }) {
    const [value, setValue] = useState(instructions);

    const inputValidation = () =>{
        if(value.trim() === "" && value.length != 0){
            alert("Invalid input! Instructions not saved! Empty whitespaces!");
            return false;
        }else{
            if(value.length > 500){
                alert("Invalid input! Instructions not saved! Character limited exceeded!")
                return false;
            }else{
                return true;
            }
        }
    }

    const handleSubmit = () =>{
        if(inputValidation()){
            console.log(typeof value);
            setInstructions(value);
            onClose();
        }
    }

    const handleClear = () =>{
        setInstructions("");
        onClose();
    }

    return (
        <div className="modal-back" onClick={onClose}>   
            <div className="modal" onClick={e => {e.stopPropagation()}}>
                <h3 style={{margin: "0"}}>Add additonal instructions</h3>
                <textarea 
                    style={{resize: "vertical", width: "25em", height: "30em", fontSize: "1.5em"}} 
                    placeholder="Example: Please leave on door"
                    value={value}
                    onChange={(e) => {setValue(e.target.value)}}
                />
                <span>Character count: <strong>{value.length}</strong> (500 Character Limit)</span>
                <div style={{display: "flex", gap: "5px"}}>
                    <button onClick={handleSubmit}>Submit</button>
                    {instructions ? 
                        <button onClick={handleClear}>Clear</button>:
                        <button disabled>Clear</button>}
                </div>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
  }
  