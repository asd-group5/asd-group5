

const Schedule = ({order}) =>{

    console.log(order);
return(
    <>
        This is the schedule page
        
        Your Order:
        {order.map((item) =>{
            return(
                <p>
                    {item.name} ${item.totalPrice}
                </p>
            )
        })}
    </>
)

}

export default Schedule