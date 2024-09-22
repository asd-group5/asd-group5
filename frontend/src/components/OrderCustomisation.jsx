import { useEffect, useState } from "react"
import Items from "./Items"
import customService from '../services/custom.jsx'
import './OrderCustomisation.css'

const OrderCustomisation = () => {

    const [total, setTotal] = useState(0);
    const [orders, setOrders] = useState([
        {
            "itemID": 1,
            "name": "Cheese burger",
            "basePrice": 10,
            "totalPrice": 10,
        },
        {
            "itemID": 2,
            "name": "Chips",
            "basePrice": 4,
            "totalPrice": 4,
        },
        {
            "itemID": 3,
            "name": "Red Bull",
            "basePrice": 2,
            "totalPrice": 2,
        },
        {
            "itemID": 1,
            "name": "Cheese burger",
            "basePrice": 10,
            "totalPrice": 10,
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

    const getUnique = () => {
        let setObj = new Set(orders.map(JSON.stringify));
        let output = Array.from(setObj).map(JSON.parse);
        return output.map(a => a.itemID)
    }

    useEffect(() =>{
        updateTotal();
    }, [orders])

    useEffect(() =>{
        customService.getOptions(getUnique())
            .then((response) =>{
                let result = response.data;
                result.forEach(element => {
                    element.fields.menuItem.forEach(item =>{
                    orders.forEach((order, index) =>{
                        if(order.itemID == item){
                            let temp = [...orders];
                            let tempOption = JSON.parse(JSON.stringify(element.fields));
                            delete tempOption["menuItem"];
                            tempOption["checked"] = false;

                            if(!temp[index].hasOwnProperty("custom")){
                                temp[index]["custom"] = [];
                                temp[index]["custom"].push(tempOption)
                            }else{
                                if(!temp[index]["custom"].find(item => item.option_name == element.fields.option_name)){
                                    temp[index]["custom"].push(tempOption)
                                }
                            }
                            setOrders(temp)
                        }
                    })
                   })
                });
            })
    }, [])

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
                <button onClick={() => customService.getOptions([1])}>
                    Submit Order
                </button>
            </div>
        </div>
    )
}

export default OrderCustomisation