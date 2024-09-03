import { useEffect, useState } from "react"
import Items from "./Items"
import './OrderCustomisation.css'

const OrderCustomisation = () => {

    const [total, setTotal] = useState(0);
    //Mock data
    const [orders, setOrders] = useState([{
        "itemID": 1,
        "name": "Cheese burger",
        "basePrice": 10,
        "totalPrice": 10,
        "custom": {
            "tomato": {
                "quantity": 0,
                "price": 1
            },
            "lettuce": {
                "quantity": 0,
                "price": 2
            },
            "sauce": {
                "quantity": 0,
                "price": 0.5
            }
        }
    },
    {
        "itemID": 2,
        "name": "Chips",
        "basePrice": 4,
        "totalPrice": 4.5,
        "custom": {
            "sauce": {
                "quantity": 1,
                "price": 0.5
            }
        }
    }
]) 

    const updateOrder = (order) =>{
        console.log("test");
        setOrders(order);
    }

    const updateTotal = () => {
        console.log("Updating total price");
        const result = orders.reduce((acc, value) =>{
            return acc + value.totalPrice;
        }, 0)
        setTotal(result);
    }

    useEffect(() =>{
        updateTotal();
    }, [orders])

    return(
        <div>
            <h1>Current Order</h1>
            Edit
            <div className="orders">
                {orders.map((value, index) =>{
                    return(
                        <Items 
                            itemName={value.name} 
                            totalPrice={value.totalPrice} 
                            index={index}
                            orders={orders} 
                            setOrders={updateOrder}
                            custom={value.custom}
                        />
                    )
                })}
            </div>
            <div>
                Total: ${total}
            </div>
        </div>
    )
}

export default OrderCustomisation