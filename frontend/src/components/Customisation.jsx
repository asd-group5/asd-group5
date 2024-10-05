import { useState } from "react";
import './Customisation.css';

const Customisation = ({custom, updateCart, index}) => {
    const [items, setItems] = useState(structuredClone(custom));
    const [update, setUpdate] = useState(true);

    const handleCheck = (value) => {
        let temp = structuredClone(items);
        
        temp[value]['checked'] = !temp[value]['checked'];

        setUpdate(temp.every((element, index) => custom[index]['checked'] == element['checked']));

        setItems(temp);
    }

    const handleUpdate = () => {
        setUpdate(true);
        updateCart(items, index);
    }

    return(
        <div>
            {items.map((item, index) => {
                return(
                    <div className="customisationOption" key={index}>
                        <label>
                            ${item['price']} {item['name'][0].toUpperCase() + item['name'].slice(1)}
                        </label>
                        <div>
                            <input type="checkbox" 
                            checked={item['checked']}
                            onChange={() => handleCheck(index)}/>
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