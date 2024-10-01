import { useState } from 'react';
import { createPortal } from 'react-dom';
import InstructionModal from './InstructionModal';

const InstructionPortal = ({instructions, setInstructions}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        {instructions ? 
            "Edit Order Instructions":
            "Add order instructions"}
      </button>
      {showModal && createPortal(
        <InstructionModal onClose={() => setShowModal(false)} instructions={instructions} setInstructions={setInstructions}/>,
        document.body
      )}
    </>
  );
}

export default InstructionPortal
