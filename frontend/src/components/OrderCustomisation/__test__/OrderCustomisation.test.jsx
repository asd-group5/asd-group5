import { render, screen, waitFor } from '@testing-library/react'
import OrderCustomisation from '../OrderCustomisation'
import Items from '../Items'
import axios from "axios";
import "@testing-library/jest-dom";

let mockData = [{"fields": {"option_name": "Secret Sauce", "option_price": "100", "menuItem":[1]},
                "pk": 1,
                "model": "custom.option"}]

jest.mock('../Items');
jest.mock('axios');

axios.request = jest.fn().mockImplementation(() => Promise.resolve({data: mockData}))

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

test('Order Customisation renders', async () => {
    render(<OrderCustomisation/>)

    await waitFor(() => {
        expect(screen.getByRole('heading', {level: 2})).toHaveTextContent('Order')
    })
    
  })

test('Items was called', async () => {
    render(<OrderCustomisation/>)

    await waitFor(() => {
        expect(Items).toHaveBeenCalled();
    }) 
})
