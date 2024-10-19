import Schedule from '../components/ScheduleOrder/Schedule';
import { useLocation } from "react-router-dom";

const SchedulePage = () => {
    const {state: {order, instructions, total}} = useLocation();

    return (
        <div style={{backgroundColor: "#242424", padding: "50px", borderRadius: "20px"}}>
            <h1>Schedule</h1>
            This is the schedule page
            <Schedule order={order} instructions={instructions} total={total}/>

            <button>
                Order Now
            </button>
        </div>
    );
};

export default SchedulePage;