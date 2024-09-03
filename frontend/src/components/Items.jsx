import './Items.css'
import Customisation from './Customisation';
import { useState } from 'react';

const Items = ({itemName, totalPrice, index, orders, setOrders, custom}) =>{
    const [showCustom, setShowCustom] = useState(false);
    
    const handleAddQuanity = () =>{
        let temp = orders.concat(orders[index]);
        setOrders(temp);
        console.log(temp);
    }

    const handleRemove = () =>{
        let temp = [...orders];
        console.log(temp);
        temp.splice(index, 1);
        setOrders(temp);
    }

    const handleCustomise = () => {
        setShowCustom(!showCustom);
    }

return(
    <div className='itemCard'>
        <div className='itemDetails'>
            {itemName}
        </div>

        <div>
            Quantity
            <button onClick={() => {
                handleAddQuanity();
            }}>+</button>
            {/* <input type='number'/> */}
            <button onClick={() => {
                handleRemove();
            }}>-</button>
        </div>
        <div>
            <button onClick={handleCustomise}>
                {showCustom ? 'Hide Customisation' : 'View Customisation'}
            </button>
        </div>
        {showCustom ? 
            <div>
                <Customisation custom={custom}/>
            </div> : null}
        ${totalPrice}
    </div>
)

}

export default Items