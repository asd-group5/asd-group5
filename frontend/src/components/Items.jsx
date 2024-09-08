import './Items.css'
import Customisation from './Customisation';
import { useState } from 'react';

const Items = ({itemName, totalPrice, index, orders, setOrders, custom, required}) =>{
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

    const updateCart = (items) => {
        console.log(orders);
        let temp = [...orders];
        temp[index]['custom'] = items;
        temp[index]['totalPrice'] = temp[index]['basePrice'] + getNewPrice(items)
        console.log(temp);
        setOrders(temp);
    }

    const getNewPrice = (items) => {
        let newPrice = 0;
        for (const property in items) {
            if(items[property]['checked']){
                newPrice += items[property]['price'];
            }
        }
        return(newPrice);
    }

return(
    <div className='itemCard'>
        <div className='itemDetails'>
            <h3>
            {itemName}
            </h3>
        </div>

        <div className='quantity'>
            
            <button onClick={() => {
                handleAddQuanity();
            }}>Add Item</button>
            {/* <input type='number'/> */}
            <button onClick={() => {
                handleRemove();
            }}>Remove Item</button>
        </div>
            {(required) ? 
                <div>
                    {required.name}
                </div> : null}
        <div className='buttonContainer'>
            {(custom) ? 
                <button onClick={handleCustomise}>
                    {showCustom ? 'Hide Customisation' : 'View Customisation'}
                </button> : null }
        </div>
        {showCustom ? 
            <div className='customisationContainer'>
                <h4>
                    Customise {itemName}
                </h4>
                <Customisation 
                    custom={custom} 
                    updateCart={updateCart}/>
            </div> : null}
        <strong>
            ${totalPrice}
        </strong>
    </div>
)

}

export default Items