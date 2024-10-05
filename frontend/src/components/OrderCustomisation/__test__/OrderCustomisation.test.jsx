import { render, screen } from '@testing-library/react'
import OrderCustomisation from '../OrderCustomisation'
import Items from '../Items'
import "@testing-library/jest-dom";

jest.mock('../Items');
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

test('Order Customisation renders', () => {
    render(<OrderCustomisation/>)
    expect(screen.getByRole('heading', {level: 2})).toHaveTextContent('Order')
  })

test('Items was called', () => {
    render(<OrderCustomisation/>)
    expect(Items).toHaveBeenCalled()
})
