import axios from "axios";

const URL="http://127.0.0.1:5000"

// User signup
export async function userSignup(userData) {
    var config = {
        method: 'POST',
        url: URL + '/addUser',
        headers: {
            'Content-Type': 'application/json'
        },
        data:userData
    };

    try {
        const response = await axios(config);
        return response.data;
    }
    catch(error) {
        console.log(error);
    }
}

// User login
export async function userlogin(googleId) {
    return await axios 
            .get(URL+'/'+googleId)
            .then((res) => res.data)
            .catch((err) => console.log(err));
}

// Upload file
export async function uploadFile(file, googleId) {
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