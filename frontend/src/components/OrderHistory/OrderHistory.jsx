import { useEffect, useState } from "react"
import orderService from '../../services/order.jsx'
import { getValidToken } from "../../utils/auth";

const OrderHistory = () =>{
    const [orders, setOrders] = useState([]);
    
    const getOrders = async () =>{
        const token = await getValidToken();

        orderService.getOrdersList(token)
            .then((response) =>{
                console.log(response.data);

                const promises = response.data.map(e => {
                    return orderService.getOrderDetail(e)
                })

                Promise.all(promises).then(responses => {
                    let data = [];

                    responses.forEach(response => {
                        data = data.concat(response.data)
                    })
                    setOrders(data);
                })
        })
    }

    useEffect(() =>{
        getOrders();
        console.log(orders);
        
    }, [])

return(
    <div>
        {orders.map(order => {
            return(
                <>
                    <h3>
                        Order ID: {order.id}
                    </h3>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span>Price: <strong>${order.total_price}</strong></span>
                        <span>Delivery Method: <strong>{order.delivery_method}</strong></span>
                    </div>
                    {order.instructions ? <p>Order Instruction provided: {order.instructions}</p> : null}
                    {order.delivery_date ? <span>Scheduled for <strong>{order.delivery_date}</strong></span>:null}
                </>
            )
        })}
    </div>
)

}

export default OrderHistory