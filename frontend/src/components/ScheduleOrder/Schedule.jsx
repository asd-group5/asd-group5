import { useState } from 'react';
import DeliveryOptions from './DeliveryOptions';
import orderService from '../../services/order.jsx'
import { getValidToken } from "../../utils/auth";
import './Schedule.css'

const Schedule = ({order, instructions, total}) =>{
    const [isPriority, setIsPriority] = useState(false);
    const [isStandard, setIsStandard] = useState(false);
    const [schedule, setSchedule] = useState(null);

    const handleSchedule = (date) =>{
        setSchedule(date);
        setIsPriority(false);
        setIsStandard(false);
        console.log(date);
    }

    const processOrder = () =>{
        if(isPriority){
            return {
                "order": order,
                "delivery": "Priority",
                "total": total + 7,
                "instructions": instructions
            }
        }else if(isStandard){
            return {
                "order": order,
                "delivery": "Standard",
                "total": total + 3,
                "instructions": instructions
            }
        }else{
            
            const time = schedule.toLocaleTimeString('en-AU', {hour12: false});
            const date = schedule.getFullYear() + "-" + ('0' + (schedule.getMonth()+1)).slice(-2)+ "-" + schedule.getDate()
            const fullDate = date + " " + time;
            
            return{
                "order": order,
                "delivery": "Schedule",
                "total": total + 3,
                "instructions": instructions,
                "schedule": fullDate
            }
        }
    }

    const handleSubmit = async () =>{
        let res = processOrder();
        const token = await getValidToken();

        let data = JSON.stringify({
            "total": res.total,
            "delivery": res.delivery,
            "date": res.schedule,
            "instruction": res.instructions
        })

        orderService.process(data, token).then((response) => {
        console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
        console.log(error);
        });
        
    }
return(
    <div>
        <h2>Order Details</h2>
        {order.map((item) =>{
            return(
                <p>
                    <dl>
                        <dt>
                            <span style={{display: 'flex', justifyContent: 'space-between'}}>
                                <h4 style={{fontSize: "1.4em"}}>
                                    {item.name} 
                                </h4>
                                <h4 style={{fontSize: "1.4em"}}>
                                    ${item.totalPrice}
                                </h4>
                            </span>
                        </dt>
                        <dd style={{margin: 0, textAlign: 'left'}}>
                        {item.hasOwnProperty("required") ? 
                        <span>
                            Selected: <strong>
                                {item['required'][item['selected']]['option_name']}  
                                </strong>
                        </span>
                            :null}
                        </dd>
                    </dl>
                    <ul style={{listStyleType: "none"}}>
                    {item.hasOwnProperty("custom") ? <h5>Customisation</h5> : null}  
                    {item.hasOwnProperty("custom") ? 
                        item['custom'].map((element) =>(
                            <li>
                            {element['option_name'] + " $" + element['option_price'] + " " + element['checked'] + " "}
                            </li>)) 
                        :null}
                    </ul>
                </p>
            )
        })}

        <DeliveryOptions 
            isPriority={isPriority} 
            setIsPriority={setIsPriority}
            isStandard={isStandard}
            setIsStandard={setIsStandard}
            handleSchedule={handleSchedule}
            setSchedule={setSchedule}/>
        
        <h2>Order Summary</h2>
        <div className='orderSummary'>
            <label>Subtotal</label>
            <span>${total}</span>
            <label>Delivery Fee</label>
            <span>$3</span>
            {isPriority ? <>
                <label>Priority Fee</label>
                <span>$4</span>
            </>: null}
            <label><strong>Total</strong></label>
            <span>
                <strong>
                    ${isPriority ? total + 7 : total + 3}
                </strong>
            </span>
        </div>
        {instructions ? 
                    <p>Instructions provided: {instructions}</p> : 
                    <p>No instructions provided</p>}

        <div>
            Delivery Option: {isPriority ? "Priority" : null}
            {isStandard ? "Standard" : null}
            {schedule ? <> Scheduled for <strong style={{wordWrap: 'break-word'}}>
                {schedule.toLocaleString("en-AU")}
            </strong>
            </> : null}
        </div>
        <button 
            disabled={isPriority || isStandard || schedule ? false : true}
            onClick={() => {handleSubmit()}}>
            Proceed to Checkout
        </button>
    </div>
)

}

export default Schedule