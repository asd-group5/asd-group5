import Schedule from '../components/ScheduleOrder/Schedule';
import { useLocation } from "react-router-dom";

const SchedulePage = () => {
    const {state} = useLocation();

    return (
        <div>
            <h1>Schedule</h1>
            <Schedule order={state.order}/>
        </div>
    );
};

export default SchedulePage;