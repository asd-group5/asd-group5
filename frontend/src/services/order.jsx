import axios from "axios";

/* let data = JSON.stringify({
  "total": 10,
  "delivery": "PR",
  "date": "2024-09-28 09:51:04",
  "instruction": "test1 instruction"
});



axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
}); */


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

export default {
    process: process
}