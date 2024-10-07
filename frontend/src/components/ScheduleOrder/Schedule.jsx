const Schedule = ({order, instructions}) =>{
    console.log(order);
return(
    <div>
        <h3>Your Order</h3>
        {order.map((item) =>{
            return(
                <p>
                    {item.name} ${item.totalPrice}
                    <br/>
                    {item.hasOwnProperty("custom") ? 
                        item['custom'].map((element) =>(
                            element['option_name'] + " " + element['option_price'] + " " + element['checked'] + " ")) 
                        :null}
                    {item.hasOwnProperty("required") ? 
                    <>
                        Selected: {item['required'][item['selected']]['option_name']}  
                    </>
                    :null}
                </p>
            )
        })}
        {instructions ? 
                    <p>Instructions provided: {instructions}</p> : 
                    <p>No instructions provided</p>}
    </div>
)

}

export default Schedule