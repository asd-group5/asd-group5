import { useEffect, useState } from "react"
import Items from "./Items"
import './OrderCustomisation.css'

const OrderCustomisation = () => {

    const [total, setTotal] = useState(0);
    //Mock data
    const [orders, setOrders] = useState([
    {
        "itemID": 1,
        "name": "Cheese burger",
        "basePrice": 10,
        "totalPrice": 10,
        "custom": [
            {
                "name": "tomato",
                "checked": false,
                "price": 1
            },
            {
                "name": "lettuce",
                "checked": false,
                "price": 2
            },
            {
                "name": "sauce",
                "checked": false,
                "price": 0.5
            }
        ]
            
    },
    {
        "itemID": 2,
        "name": "Chips",
        "basePrice": 4,
        "totalPrice": 4.5,
        "custom": [
            {
                "name": "sauce",
                "checked": true,
                "price": 0.5
            }
        ]
            
        
    },
    {
        "itemID": 3,
        "name": "Red Bull",
        "basePrice": 2,
        "totalPrice": 2,
    }
]) 

//Might add this later
/* "required": {
    "name": "Meal selection",
    "description": "Comes with drink and chips",
    "selected": 2,
    "options": [
        {
            "option_name": "Large Meal",
            "price": 12
        },
        {
            "option_name": "Medium Meal",
            "price": 10
        },
        {
            "option_name": "No Meal",
            "price": 0
        }
    ]
} */

    const updateOrder = (order) =>{
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
        <div className="customisationContainer">
            <h1>Current Order</h1>

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
                            required={value.required}
                            key={index}
                        />
                    )
                })}
            </div>
            <div>
                <hr/>
                <h4>
                    Total: ${total}
                </h4>
                <button>
                    Submit Order
                </button>
            </div>
        </div>
    )
}

export default OrderCustomisation