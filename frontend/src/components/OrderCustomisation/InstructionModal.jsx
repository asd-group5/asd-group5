import { useState } from 'react';

export default function InstructionModal({ onClose, instructions, setInstructions }) {
    const [value, setValue] = useState(instructions);

    const handleSubmit = () =>{
        setInstructions(value);
        onClose();
    }

    const handleClear = () =>{
        setInstructions("");
        onClose();
    }

    return (
        <div className="modal-back" onClick={onClose}>   
            <div className="modal" onClick={e => {e.stopPropagation()}}>
                <div>Add additonal instructions here</div>
                <textarea 
                    style={{resize: "vertical", width: "25em", height: "30em", fontSize: "1.5em"}} 
                    placeholder="Example: Please leave on door"
                    value={value}
                    onChange={(e) => {setValue(e.target.value)}}
                />
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
  