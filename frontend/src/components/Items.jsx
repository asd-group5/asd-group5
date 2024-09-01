import './Items.css'

const Items = ({itemName, totalPrice, index, orders, setOrders}) =>{

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

        ${totalPrice}
    </div>
)

}

export default Items