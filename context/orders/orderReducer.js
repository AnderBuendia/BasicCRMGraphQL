import {
    SELECT_CUSTOMER,
    SELECT_PRODUCT,
    QUANTITY_PRODUCTS,
    UPDATE_TOTAL
} from '../../types';


export default ( state, action ) => {
    switch(action.type) {
        case SELECT_CUSTOMER: 
            return {
                ...state,
                customer: action.payload
            }
        case SELECT_PRODUCT: 
            return {
                ...state,
                products: action.payload
            }
        case QUANTITY_PRODUCTS:
            return {
                ...state,
                products: state.products.map( product => product.id === action.payload.id ? producto = action.payload : producto )
            }
        case UPDATE_TOTAL:
            return {
                ...state,
                total: state.products.reduce( (newTotal, article) => newTotal += article.price * article.quantity, 0 )
            }

        default: 
            return state
    }
}