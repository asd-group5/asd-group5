const Customisation = ({custom}) => {

    let customs = Object.getOwnPropertyNames(custom);


    return(
        <div>
            {customs.map(value => {
                return(
                    <div>
                        ${custom[value]['price']} {value} {custom[value]['quantity']}
                    </div>
                )
            })}
        </div>
    )
}

export default Customisation