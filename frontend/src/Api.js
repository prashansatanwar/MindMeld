import axios from "axios";

const URL="http://127.0.0.1:5000"

export async function uploadFile(file) {
    var config = {
        method: 'POST',
        url: URL + '/resume',
        headers: {
            'Content-Type': 'application/json'
        },
        data: file
    };

    try {
        const response = await axios(config);
        // console.log(JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getQuestions() {
    try {
        const res = await axios
            .get(URL + '/questions');
        return res.data;
    } catch (err) {
        return console.log(err);
    }
}