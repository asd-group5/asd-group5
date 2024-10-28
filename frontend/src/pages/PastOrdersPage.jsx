import { useLocation } from "react-router-dom";
import OrderHistory from "../components/OrderHistory/OrderHistory";

const PastOrdersPage = () => {
    
    return (
        <div  style={{backgroundColor: "#242424", padding: "50px", borderRadius: "20px", minWidth: "400px"}}>
            <h1>Past Orders</h1>
            <OrderHistory/>
        </div>
    );
};

export default PastOrdersPage;