import { render, screen, fireEvent } from '@testing-library/react'
import Customisation from '../Customisation'
import "@testing-library/jest-dom";
global.structuredClone = (val) => JSON.parse(JSON.stringify(val))

let updateCart = jest.fn();
let custom = [{
    option_name: "Cheese Test",
    option_price: "1",
    checked: false
}]

const renderCustomisation = () =>{
    render(
        <Customisation
            custom={custom}
            updateCart={updateCart}
            index={1}
        
        />
    )
}

test('Customisation renders', () => {
    renderCustomisation();
    expect(screen.getByText(/Cheese Test/i)).toBeInTheDocument();
    });

it("enables button on check/uncheck", () =>{
    renderCustomisation();

    const checkbox = screen.getByRole('checkbox')
    const updateButton = screen.getByRole('button', {name: /Update Item/i})

    expect(checkbox).not.toBeChecked();
    expect(updateButton).toBeDisabled();

    fireEvent.click(checkbox);

    expect(updateButton).not.toBeDisabled();
})