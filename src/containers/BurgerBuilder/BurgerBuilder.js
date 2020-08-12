import React, {Component} from "react";
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions/actionTypes';

import axios from '../../axios-orders';

import Aux from "../../hoc/Auxiliry/Auxiliry";
import Burger from "../../components/Burger/Burger";
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrederSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as burgerBuilderActions from "../../store/actions/index";

class  BurgerBuilder extends Component{
    state = {
        purchasing: false,
    }

    componentDidMount() {
        this.props.initIngredients();
    }

    updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients).map(igKey => {
           return ingredients[igKey];
        }).reduce((sum,el) =>{
            return sum +el;
        }, 0);
        return  sum>0;
    }

    purchaseHandler = () => {
        if(this.props.isAuthenticated){
            this.setState({purchasing:true});
        }else {
            this.props.setAuthRedirectPath("/checkout");
            this.props.history.push('/auth');
        }
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing:false});
    }

    purchaseContinueHandler = () => {
        this.props.initPurchase();
        this.props.history.push('/checkout');
    }

    render() {
        
        const disabledInfo = {
          ...this.props.ings
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null;

        let burger = this.props.error ?<p> Ingredients can't be loaded!</p> : <Spinner/>;
        if(this.props.ings){
            orderSummary = <OrderSummary
                price={this.props.price}
                purchaseCancel={this.purchaseCancelHandler}
                purchaseContinue={this.purchaseContinueHandler}
                ingredients={this.props.ings}/>;
            burger =(
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls
                        ordered={this.purchaseHandler}
                        price={this.props.price}
                        ingredientAdd={this.props.addIngredient}
                        ingredientRemove={this.props.removeIngredient}
                        disabled={disabledInfo}
                        isAuth={this.props.isAuthenticated}
                        purchasable={this.updatePurchaseState(this.props.ings)}/>
                </Aux>
            );
        }

        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
};

const mapDispatchToProps = dispatch => {
    return {
        addIngredient: (name) => dispatch(burgerBuilderActions.addIngredient(name)),
        removeIngredient: (name) => dispatch(burgerBuilderActions.removeIngredient(name)),
        initIngredients: () => dispatch(burgerBuilderActions.initIngredient()),
        initPurchase: () => dispatch(burgerBuilderActions.purchaseInit()),
        setAuthRedirectPath: (path) => dispatch(burgerBuilderActions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));