// import React from "react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import AddressComponent from "../AddressComponent";
// import { getValidToken } from "../../../utils/auth";

// jest.mock("../../../utils/auth", () => ({
//   getValidToken: jest.fn(),
// }));

// // 더 정확한 fetch 모의 함수 구현
// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     ok: true,
//     json: () => Promise.resolve([]),
//   })
// );

// describe("AddressComponent", () => {
//   beforeEach(() => {
//     fetch.mockClear();
//     getValidToken.mockResolvedValue("fake-token");
//   });

//   it("renders the component", async () => {
//     render(<AddressComponent />);
//     await waitFor(() => {
//       expect(screen.getByText("Add New Address")).toBeInTheDocument();
//       expect(screen.getByText("Your Addresses")).toBeInTheDocument();
//     });
//   });

//   it("fetches and displays addresses", async () => {
//     const mockAddresses = [
//       {
//         id: 1,
//         name: "Home",
//         street_address: "15 Broadway",
//         city: "Ultimo",
//         state: "NSW",
//         postal_code: "2007",
//         country: "Australia",
//         is_default: true,
//       },
//     ];

//     fetch.mockResolvedValueOnce({
//       ok: true,
//       json: async () => mockAddresses,
//     });

//     render(<AddressComponent />);

//     await waitFor(() => {
//       expect(
//         screen.getByText(
//           "Home - 15 Broadway, Ultimo, NSW 2007, Australia (Default)"
//         )
//       ).toBeInTheDocument();
//     });
//   });

//   it("adds a new address", async () => {
//     fetch.mockImplementation((url, options) => {
//       if (options.method === "POST") {
//         return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
//       }
//       return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
//     });

//     render(<AddressComponent />);

//     fireEvent.change(screen.getByLabelText("Address Name:"), {
//       target: { value: "Work" },
//     });
//     fireEvent.change(screen.getByLabelText("Street Address:"), {
//       target: { value: "15 Broadway" },
//     });
//     fireEvent.change(screen.getByLabelText("City:"), {
//       target: { value: "Ultimo" },
//     });
//     fireEvent.change(screen.getByLabelText("State:"), {
//       target: { value: "NSW" },
//     });
//     fireEvent.change(screen.getByLabelText("Postal Code:"), {
//       target: { value: "2007" },
//     });
//     fireEvent.change(screen.getByLabelText("Country:"), {
//       target: { value: "Australia" },
//     });

//     fireEvent.click(screen.getByText("Save Address"));

//     await waitFor(() => {
//       expect(fetch).toHaveBeenCalledWith(
//         "http://localhost:8000/api/address/",
//         expect.objectContaining({
//           method: "POST",
//           body: JSON.stringify({
//             name: "Work",
//             street_address: "15 Broadway",
//             city: "Ultimo",
//             state: "NSW",
//             postal_code: "2007",
//             country: "Australia",
//             is_default: false,
//           }),
//         })
//       );
//     });
//   });

//   it("edits an existing address", async () => {
//     const mockAddresses = [
//       {
//         id: 1,
//         name: "Home",
//         street_address: "15 Broadway",
//         city: "Ultimo",
//         state: "NSW",
//         postal_code: "2007",
//         country: "Australia",
//         is_default: true,
//       },
//     ];

//     fetch.mockImplementation((url, options) => {
//       if (options.method === "PUT") {
//         return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
//       }
//       return Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve(mockAddresses),
//       });
//     });

//     render(<AddressComponent />);

//     await waitFor(() => {
//       fireEvent.click(screen.getByText("Edit"));
//     });

//     fireEvent.change(screen.getByLabelText("Address Name:"), {
//       target: { value: "Updated Home" },
//     });
//     fireEvent.click(screen.getByText("Update Address"));

//     await waitFor(() => {
//       expect(fetch).toHaveBeenCalledWith(
//         "http://localhost:8000/api/address/1/",
//         expect.objectContaining({
//           method: "PUT",
//           body: expect.stringContaining('"name":"Updated Home"'),
//         })
//       );
//     });
//   });

//   it("deletes an address", async () => {
//     const mockAddresses = [
//       {
//         id: 1,
//         name: "Home",
//         street_address: "15 Broadway",
//         city: "Ultimo",
//         state: "NSW",
//         postal_code: "2007",
//         country: "Australia",
//         is_default: true,
//       },
//     ];

//     fetch.mockImplementation((url, options) => {
//       if (options.method === "DELETE") {
//         return Promise.resolve({ ok: true });
//       }
//       return Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve(mockAddresses),
//       });
//     });

//     render(<AddressComponent />);

//     await waitFor(() => {
//       fireEvent.click(screen.getByText("Delete"));
//     });

//     await waitFor(() => {
//       expect(fetch).toHaveBeenCalledWith(
//         "http://localhost:8000/api/address/1/",
//         expect.objectContaining({
//           method: "DELETE",
//         })
//       );
//     });
//   });

//   it("handles fetch error", async () => {
//     fetch.mockRejectedValueOnce(new Error("API is down"));

//     console.error = jest.fn();

//     render(<AddressComponent />);

//     await waitFor(() => {
//       expect(console.error).toHaveBeenCalledWith(
//         "Error fetching addresses:",
//         expect.any(Error)
//       );
//     });
//   });

//   it("handles save error", async () => {
//     fetch.mockImplementation((url, options) => {
//       if (options.method === "POST") {
//         return Promise.reject(new Error("Failed to save"));
//       }
//       return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
//     });

//     console.error = jest.fn();

//     render(<AddressComponent />);

//     fireEvent.change(screen.getByLabelText("Address Name:"), {
//       target: { value: "Work" },
//     });
//     fireEvent.change(screen.getByLabelText("Street Address:"), {
//       target: { value: "15 Broadway" },
//     });
//     fireEvent.change(screen.getByLabelText("City:"), {
//       target: { value: "Ultimo" },
//     });
//     fireEvent.change(screen.getByLabelText("State:"), {
//       target: { value: "NSW" },
//     });
//     fireEvent.change(screen.getByLabelText("Postal Code:"), {
//       target: { value: "2007" },
//     });
//     fireEvent.change(screen.getByLabelText("Country:"), {
//       target: { value: "Australia" },
//     });

//     fireEvent.click(screen.getByText("Save Address"));

//     await waitFor(() => {
//       expect(console.error).toHaveBeenCalledWith(
//         "Error saving address:",
//         expect.any(Error)
//       );
//     });
//   });
// });
