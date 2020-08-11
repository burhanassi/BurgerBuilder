import  * as actionTypes from './actionTypes';
import axios from "../../axios-orders";

export const addIngredient = (ingName) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingName: ingName
    }
}

export const removeIngredient = (ingName) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingName: ingName
    }
}

export const setIngredients = (ingredients) =>{
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients: ingredients
    };
};

export const fetchIngreientFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    }
}

export const initIngredient = () => {
    return dispatch => {
        axios.get('https://react-my-burger-4fb3a.firebaseio.com/ingredients.json').then(response => {
            dispatch(setIngredients(response.data));
        }).catch(error => {
            dispatch(fetchIngreientFailed());
        });
    };
};