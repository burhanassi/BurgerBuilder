import {useEffect, useState} from  'react';
import axios from '../axios-orders'

export default httpClient => {
    const [error, setError] = useState(null);



    useEffect(() => {
        console.log(axios.interceptors)

        const reqInterceptor = httpClient.interceptors.request.use(req => {
            console.log("request Interceptor")
            setError(null);
            return req;
        }, function (error) {
            // Do something with request error
            return Promise.reject(error);
        });
        const resInterceptor = axios.interceptors.response.use(
            res => res,
            error => {
                console.log(error)
                setError(error);
                // return Promise.reject(error)
            });
        return () => {
            httpClient.interceptors.request.eject(reqInterceptor);
            httpClient.interceptors.response.eject(resInterceptor);
        }
    }, []);

    const errorConfirmedHandler = () => {
        setError(null);
    }

    return [error, errorConfirmedHandler];
}