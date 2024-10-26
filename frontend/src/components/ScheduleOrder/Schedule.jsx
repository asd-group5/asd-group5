import DeliveryOptions from './DeliveryOptions';
import './Schedule.css'

const Schedule = ({order, instructions, total}) =>{
    console.log(order);
return(
    <div>
        <h3>Your Order</h3>
        {order.map((item) =>{
            return(
                <p>
                    <dl>
                        <dt>
                            <h4>
                                {item.name} ${item.totalPrice}
                            </h4>
                        </dt>
                        <dd>
                        {item.hasOwnProperty("required") ? 
                        <>
                            Selected: {item['required'][item['selected']]['option_name']}  
                        </>
                            :null}
                        </dd>
                    </dl>
                    <ul>   
                    {item.hasOwnProperty("custom") ? 
                        item['custom'].map((element) =>(
                            <li>
                            {element['option_name'] + " " + element['option_price'] + " " + element['checked'] + " "}
                            </li>)) 
                        :null}
                    </ul>
                </p>
            )
        })}

        <p>
            Total price: ${total}
        </p>
        {instructions ? 
                    <p>Instructions provided: {instructions}</p> : 
                    <p>No instructions provided</p>}

        <DeliveryOptions/>
    </div>
)

}

export default Schedule