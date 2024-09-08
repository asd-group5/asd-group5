import { useState } from "react";
import './Customisation.css';

const Customisation = ({custom, updateCart}) => {
    const [items, setItems] = useState(custom);
    const [update, setUpdate] = useState(true);

    let customs = Object.getOwnPropertyNames(custom);

    const handleCheck = (value) => {
        let temp = JSON.parse(JSON.stringify(items));
        temp[value]['checked'] = !temp[value]['checked'];

        setUpdate(Object.keys(custom)
            .every((key) => custom[key]['checked'] === temp[key]['checked']));
            
        setItems(temp);
    }

    const handleUpdate = () => {
        setUpdate(true);
        updateCart(items);
    }

    return(
        <div>
            {customs.map(value => {
                return(
                    <div className="customisationOption">
                        <label>
                            ${custom[value]['price']} {value[0].toUpperCase() + value.slice(1)}
                        </label>
                        <div>
                            <input type="checkbox" 
                            checked={items[value]['checked']}
                            onChange={() => handleCheck(value)}/>
                        </div>
                    </div>
                )
            })}
            <button 
                className="customUpdate"
                onClick={() => handleUpdate()} 
                disabled={update}>Update Item</button>
        </div>
    )
}

export default Customisation