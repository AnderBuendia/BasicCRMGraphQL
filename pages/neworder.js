import React, { useContext, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';
import AssignCustomer from '../components/orders/AssignCustomer';
import AssignProducts from '../components/orders/AssignProducts';
import OrderSummary from '../components/orders/OrderSummary';
import Total from '../components/orders/Total';

/* orderContext */
import orderContext from '../context/orders/orderContext';

const NEW_ORDER = gql`
    mutation newOrder($input: OrderInput) {
        newOrder(input: $input) {
            id
        }
    }
`;

const GET_ORDERS = gql`
  query getOrdersSalesman {
    getOrdersSalesman {
      id
      order {
        id
        quantity
        name
      }
      customer {
        id
        name
        firstname
        email
        phone
      }
      salesman
      total
      state
    }
  }
`;

const NewOrder = () => {
    /* Routing */
    const router = useRouter();

    const [message, setMessage] = useState(null);

    /* Use context and extract functions and values */
    const OrderContext = useContext(orderContext);
    const { customer, products, total } = OrderContext;

    /* Apollo mutation */
    const [ newOrder ] = useMutation(NEW_ORDER, {
        update(cache, { data: { newOrder } }) {
            const { getOrdersSalesman } = cache.readQuery({
                query: GET_ORDERS
            });

            cache.writeQuery({
                query: GET_ORDERS,
                data: {
                    getOrdersSalesman: [...getOrdersSalesman, newOrder]
                }
            });
        }
    });

    const setOrder = () => {
        return !products.every(product => product.quantity > 0) || total === 0 || customer.length === 0 ? 
                                " opacity-50 cursor-not-allowed " : "";
    }

    const createNewOrder = async () => {
        const { id } = customer;

        /* Remove unnecesary things from products */
        const order = products.map(
            ( { __typename, stock, ...product } ) => product
        );

        try {
            const { data } = await newOrder({
                variables: {
                    input: {
                        customer: id,
                        total,
                        order
                    }
                }
            });

            /* Redirect to Orders page */
            router.push('/orders');

            /* Show alerts */
            Swal.fire(
              'Correct',
              'Order has registered successfully',
              'success'
            );
        } catch (error) {
            setMessage(error.message.replace('GraphQL error: ', ''));
            setTimeout(() => {
                showMessage(null);
            }, 3000);
        }
    
    };

    const showMessage = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{message}</p>
            </div>
        )
    }
     
    return (  
        <Layout>
            <h1 className="text-2xl text-gray-800 font-medium">Create New Order</h1>
            { message && showMessage() }
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <AssignCustomer />
                    <AssignProducts />
                    <OrderSummary />
                    <Total />

                    <button
                        type="button"
                        className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold rounded hover:bg-gray-900 ${setOrder()}`}
                        onClick={ () => createNewOrder() }
                    >Create Order</button>
                </div>
            </div>
        </Layout>
    );
}
 
export default NewOrder;