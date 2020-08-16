import React, {useState, useEffect, useCallback} from "react";
import {connect, useDispatch, useSelector} from 'react-redux';

import axios from '../../axios-orders';

import Aux from "../../hoc/Auxiliry/Auxiliry";
import Burger from "../../components/Burger/Burger";
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrederSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as burgerBuilderActions from "../../store/actions/index";
import {initIngredient} from "../../store/actions/index";

const BurgerBuilder = props =>{
    const [purchasing, setPurchasing] = useState(false);

    const dispatch = useDispatch();

    const ings = useSelector(state => {
        return state.burgerBuilder.ingredients
    });
    const price = useSelector(state => {
        return state.burgerBuilder.totalPrice
    });
    const error = useSelector(state => {
        return state.burgerBuilder.error
    });
    const isAuthenticated = useSelector(state => {
        return state.auth.token !== null
    });

    const addIngredient =  (name) => dispatch(burgerBuilderActions.addIngredient(name));
    const removeIngredient =  (name) => dispatch(burgerBuilderActions.removeIngredient(name));
    const initIngredients =  useCallback(() => dispatch(burgerBuilderActions.initIngredient()), [dispatch]);
    const initPurchase =  () => dispatch(burgerBuilderActions.purchaseInit());
    const setAuthRedirectPath =  (path) => dispatch(burgerBuilderActions.setAuthRedirectPath(path));

    useEffect(() => {
        initIngredients();
    }, [initIngredients]);

    const updatePurchaseState = (ingredients) =>{
        const sum = Object.keys(ingredients).map(igKey => {
           return ingredients[igKey];
        }).reduce((sum,el) =>{
            return sum +el;
        }, 0);
        return  sum>0;
    };

    const purchaseHandler = () => {
        if(isAuthenticated){
            setPurchasing(true);
        }else {
            setAuthRedirectPath("/checkout");
            props.history.push('/auth');
        }
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        initPurchase();
        props.history.push('/checkout');
    }

        const disabledInfo = {
          ...ings
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null;

        let burger = error ?<p> Ingredients can't be loaded!</p> : <Spinner/>;
        if(ings){
            orderSummary = <OrderSummary
                price={price}
                purchaseCancel={purchaseCancelHandler}
                purchaseContinue={purchaseContinueHandler}
                ingredients={ings}/>;
            burger =(
                <Aux>
                    <Burger ingredients={ings}/>
                    <BuildControls
                        ordered={purchaseHandler}
                        price={price}
                        ingredientAdd={addIngredient}
                        ingredientRemove={removeIngredient}
                        disabled={disabledInfo}
                        isAuth={isAuthenticated}
                        purchasable={updatePurchaseState(ings)}/>
                </Aux>
            );
        }

        return(
            <Aux>
                <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
}

export default withErrorHandler(BurgerBuilder, axios);