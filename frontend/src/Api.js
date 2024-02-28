import axios from "axios";

const API_URL="http://127.0.0.1:5000"

// User signup
export async function userSignup(userData) {
    var config = {
        method: 'POST',
        url: API_URL + '/addUser',
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
            .get(API_URL+'/'+googleId)
            .then((res) => res.data)
            .catch((err) => console.log(err));
}

// getUser
export async function getUser(googleId) {
    return await axios 
            .get(API_URL+'/'+googleId)
            .then((res) => res.data)
            .catch((err) => console.log(err));
}

// Upload Resume
export async function uploadFile(file, googleId) {
    const formData = new FormData();
    formData.append('file',file,file.name)

    var config = {
        method: 'POST',
        url: API_URL +"/"+ googleId +'/resume',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: formData
    };

    console.log(file)

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

// Read Resume
export async function getFile(googleId, fileId) {
    try {
        const response = await axios.get(`${API_URL}/${googleId}/resume/${fileId}`);
        console.log(response.data)
        // const fileUrl = URL.createObjectURL(new Blob([response.data.content],{type:'application/pdf'}));
        return response.data;

    } catch (error) {
        console.log('Error fetching file:', error);
        throw error;
    }
}

// Delete Resume
export async function deleteFile(googleId,fileId) {
    return await axios
                .delete(API_URL+"/"+googleId+'/resume/'+fileId)
                .then((res) => res.data)
                .catch((err) => console.log(err))

}

export async function getQuestions(googleId, fileId) {
    try {
        const res = await axios
            .get(API_URL+"/"+googleId+'/resume/'+fileId + '/questions');
        console.log(res.data)
        return res.data;
    } catch (err) {
        return console.log(err);
    }
}

export async function analyzeResponse(fileId, data) {
    var config = {
        method: 'POST',
        url: API_URL + `/${fileId}/analyzeResponse`,
        headers: {
            'Content-Type': 'application/json'
        },
        data:data
    };

    try {
        const response = await axios(config);
        return response.data;
    }
    catch(error) {
        console.log(error);
    }
}