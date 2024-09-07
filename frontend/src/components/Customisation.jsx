import { useState } from "react";

const Customisation = ({custom, updateCart}) => {
    const [items, setItems] = useState(custom);

    let customs = Object.getOwnPropertyNames(custom);

    const handleCheck = (value) => {
        let temp = JSON.parse(JSON.stringify(items));
        temp[value]['checked'] = !temp[value]['checked'];
        setItems(temp);
    }

    return(
        <div>
            {customs.map(value => {
                return(
                    <div>
                        <label>
                            ${custom[value]['price']} {value}
                        </label>
                        <div>
                            <input type="checkbox" 
                            checked={items[value]['checked']}
                            onChange={() => handleCheck(value)}/>
                        </div>
                    </div>
                )
            })}
            <button onClick={() => updateCart(items)}>Update Item</button>
        </div>
    )
}

export default Customisation