import './DeliveryOption.css'
import SchedulePortal from './SchedulePortal'

const DeliveryOptions = ({isPriority, setIsPriority, isStandard, setIsStandard, handleSchedule, setSchedule}) =>{
    const handlePriority = () =>{
        setIsPriority(!isPriority);
        setIsStandard(false);
        setSchedule(null);
    }

    const handleStandard = () =>{
        setIsStandard(!isStandard);
        setIsPriority(false);
        setSchedule(null);
    }

return(
    <div className='delivery'>
        <h3>
            Delivery Options
        </h3>
        <button id='deliveryButton' className={isPriority ? 'active' : undefined} onClick={() => {handlePriority()}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-fast-forward" viewBox="0 0 16 16">
                <path d="M6.804 8 1 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C.713 12.69 0 12.345 0 11.692V4.308c0-.653.713-.998 1.233-.696z"/>
                <path d="M14.804 8 9 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C8.713 12.69 8 12.345 8 11.692V4.308c0-.653.713-.998 1.233-.696z"/>
            </svg>
            Priority
        </button>
        <button id='deliveryButton' className={isStandard ? 'active' : undefined} onClick={() => {handleStandard()}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bag" viewBox="0 0 16 16">
                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
            </svg>
            Standard
        </button>
        <SchedulePortal handleSchedule={handleSchedule}/>
    </div>
)

}

export default DeliveryOptions