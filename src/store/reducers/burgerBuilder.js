import * as actionTypes from '../actions/actionTypes';
import updateObject from '../utility';
import {fetchIngreientFailed} from "../actions/burgerBuilder";

const initialState = {
    ingredients: null,
    totalPrice: 3,
    error: false,
    building: false
};

const PRICES = {
    salad: 0.2,
    bacon: 0.3,
    cheese: 0.5,
    meat: 0.8
};

const addIngredient = (state, action) => {
    const updatedIngredient = {[action.ingName]: state.ingredients[action.ingName] + 1};
    const updatedIngredients = updateObject(state.ingredients, updatedIngredient);
    const updatedState = {
        ingredients: updatedIngredients,
        totalPrice: state.totalPrice + PRICES[action.ingName],
        building: true
    };
    return updateObject(state, updatedState);
};

const removeIngredient = (state, action) => {
    const updatedIng = {[action.ingName]: state.ingredients[action.ingName] - 1};
    const updatedIngs = updateObject(state.ingredients, updatedIng);
    const updatedSt = {
        ingredients: updatedIngs,
        totalPrice: state.totalPrice - PRICES[action.ingName],
        building: true
    };
    return updateObject(state, updatedSt);
};

const setIngredients = (state, action) => {
    return updateObject(state, {
        ingredients: {
            salad: action.ingredients.salad,
            bacon: action.ingredients.bacon,
            cheese: action.ingredients.cheese,
            meat: action.ingredients.meat
        },
        totalPrice: 3,
        error: false,
        building: false
    });
};

const fetchIngredientsFailed = (state) => {
    return updateObject(state, {error: true});
};

const burgerBuilder = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT: return addIngredient(state, action);
        case actionTypes.REMOVE_INGREDIENT: return removeIngredient(state, action);
        case actionTypes.SET_INGREDIENTS: return setIngredients(state,action);
        case actionTypes.FETCH_INGREDIENTS_FAILED: return fetchIngredientsFailed(state);
        default: return state;
    }
};

export default burgerBuilder;