import React from "react";
import classes from "./Burger.module.css";
import BurgerIngredient from "./BurgerIngredient/BurgerIngredient";

const burger = (props) => {
    let transIng = Object.keys(props.ingredients).map(igKey=>{
        return [...Array(props.ingredients[igKey])].map((_,i) => {
            return <BurgerIngredient key={igKey + i} type={igKey}/>;
        })
    }).reduce((arr, el) => {
        return arr.concat(el)
    }, []);
    console.log(transIng)
    if (transIng.length === 0){
        transIng = <p>Please Add Some Ingredients!</p>;
    }
    return(
        <div className={classes.Burger}>
            <BurgerIngredient type ="bread-top"/>
            {transIng}
            <BurgerIngredient type ="bread-bottom"/>

        </div>
    );
};

export default burger;