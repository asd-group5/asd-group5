import Schedule from '../components/ScheduleOrder/Schedule';
import { useLocation } from "react-router-dom";

const SchedulePage = () => {
    const {state: {order, instructions}} = useLocation();

    return (
        <div>
            <h1>Schedule</h1>
            This is the schedule page
            <Schedule order={order} instructions={instructions}/>

            <button>
                Order Now
            </button>
        </div>
    );
};

export default SchedulePage;