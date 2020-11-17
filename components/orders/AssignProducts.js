import React, { useEffect, useState, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import orderContext from '../../context/orders/orderContext';


const GET_PRODUCTS = gql`
    query obtenerProductos {
        obtenerProductos {
            id
            nombre
            precio
            existencia
        }
    }
`;


const AssignProducts = () => {
    /* Product state local component */
    const [ products, setProducts ] = useState([]);

    /* orderContext */
    const OrderContext = useContext(orderContext);
    const { addProducts } = OrderContext;


    /* Apollo query */
    const { data, loading, error } = useQuery(GET_PRODUCTS);

    useEffect(() => {
        addProducts(products);
    }, [products])

    const selectProduct = product => {
        setProducts(product)
    }

    if(loading) return null;
    const { getProducts } = data;

    return ( 
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">2.- Selecciona o busca los productos</p>
            <Select
                className="mt-3"
                options={ getProducts }
                onChange={ option => selectProduct(option) }
                isMulti={true}
                getOptionValue={ options => options.id }
                getOptionLabel={ options => `${options.name} - ${options.stock} U.` }
                placeholder="Select a Product"
                noOptionsMessage={() => "No results"}
            />

        </>
     );
}
 
export default AssignProducts;