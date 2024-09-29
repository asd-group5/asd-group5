import { useState } from 'react';
import { createPortal } from 'react-dom';
import InstructionModal from './InstructionModal';

const InstructionPortal = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Add order instructions
      </button>
      {showModal && createPortal(
        <InstructionModal onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}

export default InstructionPortal
