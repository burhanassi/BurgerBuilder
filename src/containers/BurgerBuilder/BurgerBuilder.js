import React, {Component} from "react";
import Aux from "../../hoc/Auxiliry/Auxiliry";
import Burger from "../../components/Burger/Burger";
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrederSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const PRICES = {
  salad: 0.2,
  bacon: 0.3,
  cheese: 0.5,
  meat: 0.8
};

class  BurgerBuilder extends Component{
    state = {
        ingredients: null,
        totalPrice: 3,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://react-my-burger-4fb3a.firebaseio.com/ingredients.json').then(response => {
            this.setState({ingredients: response.data});
        }).catch(error => {
            this.setState({error: true});
        });
    }

    updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients).map(igKey => {
           return ingredients[igKey];
        }).reduce((sum,el) =>{
            return sum +el;
        }, 0);
        this.setState({purchasable: sum>0});
    }

    addIngredientHandler = (type) => {
        const oldCount =this.state.ingredients[type];
        const newCount = oldCount + 1;
        const updateIngredients = {
            ...this.state.ingredients
        };
        updateIngredients[type] = newCount;
        const addedForPrice = PRICES[type];
        this.setState({ingredients: updateIngredients, totalPrice: this.state.totalPrice + addedForPrice});
        this.updatePurchaseState(updateIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount =this.state.ingredients[type];
        if (oldCount <= 0){
            return;
        }
        const newCount = oldCount - 1;
        const updateIngredients = {
            ...this.state.ingredients
        };
        updateIngredients[type] = newCount;
        const removeFromPrice = PRICES[type];
        this.setState({ingredients: updateIngredients, totalPrice: this.state.totalPrice - removeFromPrice});
        this.updatePurchaseState(updateIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing:true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing:false});
    }

    purchaseContinueHandler = () => {
        // alert("You continue!");
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            costumer: {
                name: 'Ali',
                address: {
                    street: 'Teststreet',
                    city: 'Ramallah'
                },
                email: 'test@test.com',
            },
            deliveryMethod: 'Normal'
        }
        axios.post('/orders.json', order).then(response => {
            this.setState({loading: false, purchasing: false});
        }).catch(error => {
            this.setState({loading: true, purchasing: false});
        });
    }

    render() {
        
        const disabledInfo = {
          ...this.state.ingredients
        };

        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null;

        let burger = this.state.error ?<p> Ingredients can't be loaded!</p> : <Spinner/>;
        if(this.state.ingredients){
            orderSummary = <OrderSummary
                price={this.state.totalPrice}
                purchaseCancel={this.purchaseCancelHandler}
                purchaseContinue={this.purchaseContinueHandler}
                ingredients={this.state.ingredients}/>;
            burger =(
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice}
                        ingredientAdd={this.addIngredientHandler}
                        ingredientRemove={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}/>
                </Aux>
            );
        }

        if(this.state.loading){
            orderSummary = <Spinner/>;
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

export default withErrorHandler(BurgerBuilder, axios);