import Schedule from '../components/ScheduleOrder/Schedule';
import { useLocation } from "react-router-dom";

const SchedulePage = () => {
    const {state: {order, instructions, total}} = useLocation();

    return (
        <div style={{backgroundColor: "#242424", padding: "50px", borderRadius: "20px", minWidth: "400px"}}>
            <h1 style={{marginBottom: "0"}}>Schedule</h1>
            <Schedule order={order} instructions={instructions} total={total}/>
        </div>
    );
};

export default SchedulePage;