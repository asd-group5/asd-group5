import './Items.css'
import Customisation from './Customisation';
import { useState } from 'react';

const Items = ({itemName, totalPrice, index, orders, setOrders, custom}) =>{
    const [showCustom, setShowCustom] = useState(false);
    
    const handleAddQuanity = () =>{
        let temp = orders.concat(structuredClone(orders[index]));
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

    const handleRequiredOption = (selected) =>{
        let temp = structuredClone(orders);
        temp[index]['selected'] = selected;
        temp[index]['totalPrice'] = temp[index]['basePrice'] + temp[index]['required'][selected]['price'];
        setOrders(temp);
    }

    const updateCart = (items, key) => { 
        console.log(orders);
        let temp = [...orders];
        temp[key]['custom'] = items;
        temp[key]['totalPrice'] = temp[key]['basePrice'] + getNewPrice(items)
        console.log(temp);
        setOrders(temp);
    }

    const getNewPrice = (items) => {
        let newPrice = 0;
        for (const property in items) {
            if(items[property]['checked']){
                newPrice += Number(items[property]['option_price']);
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
            
            <button className='editButton' onClick={() => {
                handleAddQuanity();
            }}>
                Add
            </button>
            <button onClick={() => {
                handleRemove();
            }}>Remove</button>
        </div>
        <div className='buttonContainer'>
            {(custom) ? 
                <button onClick={handleCustomise}>
                    {showCustom ? 'Hide Customisation' : 'View Customisation'}
                </button> : null }
        </div>
        {showCustom ? 
            <div className='customisationContainer'>
                {orders[index].hasOwnProperty("required") ? 
                <div>
                    <h4>
                        Required Option
                    </h4>
                    <form 
                        className='option' 
                        style={{display: 'flex', flexDirection: 'column'}}
                        onChange={(e) => {handleRequiredOption(e.target.value)}}>
                        {orders[index]["required"].map((option, key) => (
                            <div style={{display: 'flex', justifyContent: 'space-between'}} key={key}>
                                <label>${option.price} {option.option_name}</label>
                                {orders[index]['selected'] == key ? 
                                    <input 
                                    value={key} 
                                    type='radio' 
                                    name="option"
                                    defaultChecked/>:
                                    <input 
                                    value={key} 
                                    type='radio' 
                                    name="option"/>}
                            </div>
                        ))}
                    </form>
                </div>
                : null}

                <Customisation 
                    custom={custom} 
                    updateCart={updateCart}
                    index={index}/>
            </div> : null}
        <strong>
            ${totalPrice}
        </strong>
    </div>
)

}

export default Items