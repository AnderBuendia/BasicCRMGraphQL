import React, { useReducer } from 'react';
import orderContext from './orderContext';
import orderReducer from './orderReducer';

import {
    SELECT_CUSTOMER,
    SELECT_PRODUCT,
    QUANTITY_PRODUCTS,
    UPDATE_TOTAL
} from '../../types';

const OrderState = ({children}) => {
    /* Orders State */
    const initialState = {
        customer: {},
        products: [],
        total: 0
    };

    const [state, dispatch] = useReducer(orderReducer, initialState);

    /* Modify customer */
    const addCustomer = customer => {
        // console.log(customer);
        dispatch({
            type: SELECT_CUSTOMER,
            payload: customer
        });
    };

    /* Modify products */
    const addProducts = selectedProducts => {
        let newProductState;

        if (state.products.length > 0) {
            /* Get a copy from the second array, to assign to the first one */
            newProductState = selectedProducts.map(product => {
                const newObject = state.products.find(
                    productState => productState.id === product.id);
                
                return {...product, ...newObject};
            });
        } else {
            newProductState = [];
        }

        dispatch({
            type: SELECT_PRODUCT,
            payload: newProductState
        });
    };

    /* Modify products quantities */
    const productsQuantity = newProduct => {
        dispatch({
            type: QUANTITY_PRODUCTS,
            payload: newProduct
        })
    };

    const updateTotal = () => {
        dispatch({
            type: UPDATE_TOTAL
        })
    }

    return (
        <orderContext.Provider
            value={{
                customer: state.customer,
                products: state.products,
                total: state.total,
                addCustomer,
                addProducts,
                productsQuantity,
                updateTotal
            }}
        >
            {children}
        </orderContext.Provider>
    );
} 

export default OrderState;