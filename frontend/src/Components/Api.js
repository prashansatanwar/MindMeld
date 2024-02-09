import axios from "axios";

URL="http://127.0.0.1:5000"

export function uploadFile(file) {
    var config = {
        method: 'POST',
        url: URL + '/resume',
        headers: {
            'Content-Type': 'application/json'
        },
        data: file
    };

    return axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        })
}