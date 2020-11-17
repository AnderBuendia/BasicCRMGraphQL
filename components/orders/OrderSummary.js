import React, { useContext } from 'react';
import ProductSummary from './ProductSummary';
import orderContext from '../../context/orders/orderContext';

const OrderSummary = () => {
    /* orderContext */
    const OrderContext = useContext(orderContext);
    const { products } = OrderContext;

    // console.log(products);

    return ( 
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">3.- Ajusta las cantidades del Producto</p>
            
            {products == null ? (
            <p>No Products</p>
            ) : (
                products.length > 0 ? (
                    <>
                        { products.map( product => (
                            <ProductSummary
                                key={product.id}
                                product={product}
                            />
                        )) }
                    </>
                    
                ) : (
                    
                    <p>No products</p>
                )
            )}
        </>
     );
}
 
export default OrderSummary;