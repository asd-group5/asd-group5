import axios from "axios";

const getOptions = (menuIDList) =>{
    let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://127.0.0.1:8000/api/custom/options/',
    params:{
        menuID: menuIDList
    },
    paramsSerializer: {
      indexes: null
    },
    headers: { }
    };

    return axios.request(config)
}

export default {
    getOptions: getOptions
}