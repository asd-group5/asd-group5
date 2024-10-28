import axios from "axios";

const process = (data, token) =>{
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://127.0.0.1:8000/api/order/process/',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': "Bearer " + token
        },
        data : data
    };

    return axios.request(config)
}

const getOrdersList = (token) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://127.0.0.1:8000/api/order/view/',
        headers: { 
        'Authorization': "Bearer " + token
        }
    }

    return axios.request(config)
}

const getOrderDetail = (orderID) => {
    let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `http://127.0.0.1:8000/api/order/view/${orderID}/`,
    headers: { },
    }

    return axios.request(config)
}



export default {
    process: process,
    getOrdersList:getOrdersList,
    getOrderDetail:getOrderDetail
}