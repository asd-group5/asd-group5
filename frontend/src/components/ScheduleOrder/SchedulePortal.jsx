import { useState } from 'react';
import { createPortal } from 'react-dom';
import ScheduleModal from './ScheduleModal';
import './DeliveryOption.css'

const SchedulePortal = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button className='deliveryButton' onClick={() => setShowModal(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-calendar-check" viewBox="0 0 16 16">
                <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
            </svg>
            Schedule
      </button>
      {showModal && createPortal(
        <ScheduleModal onClose={() => setShowModal(false)}/>,
        document.body
      )}
    </>
  );
}

export default SchedulePortal