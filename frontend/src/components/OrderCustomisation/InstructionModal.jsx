export default function InstructionModal({ onClose }) {
    return (
        <div className="modal-back" onClick={onClose}>   
            <div className="modal" onClick={e => {e.stopPropagation()}}>
                <div>Add additonal instructions here</div>
                <textarea style={{resize: "vertical", width: "25em", height: "30em", fontSize: "1.5em"}} placeholder="Example: Please leave on door">
                </textarea>
                <button>Submit</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
  }
  