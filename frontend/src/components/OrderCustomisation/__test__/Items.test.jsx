import { render, screen } from '@testing-library/react'
import Items from '../Items.jsx'
import "@testing-library/jest-dom";

const renderItems = () =>{
    render(
        <Items 
            itemName={"Banana"} 
            totalPrice={"100"} 
        />
    )
}

it("should render items", () =>{
    renderItems();

    expect(screen.getByText(/Banana/i)).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
})