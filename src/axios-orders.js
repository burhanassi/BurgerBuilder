import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-4fb3a.firebaseio.com/',
});

export default instance;