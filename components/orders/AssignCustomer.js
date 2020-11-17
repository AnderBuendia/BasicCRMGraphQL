import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select'
import { gql, useQuery } from '@apollo/client';
import orderContext from '../../context/orders/orderContext';

const GET_CUSTOMERS_USER = gql`
    query getCustomersSalesman {
        getCustomersSalesman {
            id
            name
            firstname
            company
            email
        }
    }
`;

const AssignCustomer = () => {

    const [ customer, setCustomer ] = useState([]);

    /* orderContext */
    const OrderContext = useContext(orderContext);
    const { addCustomer } = OrderContext;
    

    // Consultar la base de datos
    const { data, loading, error } = useQuery(GET_CUSTOMERS_USER);

    // console.log(data)
    // console.log(loading)
    // console.log(error)

    useEffect(() => {
        addCustomer(customer);
    }, [customer])

    const selectCustomer = customers => {
        setCustomer(customers);
    }

    // Resultados de la consulta
    if(loading) return null;

    const { getCustomersSalesman } = data;

    return ( 

        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1.- Asigna un Cliente al pedido</p>
            <Select
                className="mt-3"
                options={ getCustomersSalesman }
                onChange={ option => selectCustomer(option) }
                getOptionValue={ options => options.id }
                getOptionLabel={ options => options.name }
                placeholder="Select a Customer"
                noOptionsMessage={() => "No results"}
            />

        </>
     );
}
 
export default AssignCustomer;