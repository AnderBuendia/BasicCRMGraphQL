import React, {useState, useEffect} from 'react';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2'

const UPDATE_ORDER = gql`
    mutation updateOrder($id: ID!, $input: OrderInput ) {
        updateOrder(id: $id, input: $input) {
            state
        }
    }
`;
const DELETE_ORDER = gql`
    mutation deleteOrder($id: ID!) {
        deleteOrder(id: $id) 
    }
`

const GET_ORDERS = gql`
  query getCustomersSalesman {
      getCustomersSalesman {
        id
      }
  }
`

const Order = ({order}) => {


    const { id, total, customer: { name, firstname, phone, email }, state, customer } = order;


    /* Apollo mutation */
    const [ updateOrder ] = useMutation(UPDATE_ORDER)
    const [ deleteOrder ] = useMutation(DELETE_ORDER, {
        update(cache) {
            const { getCustomersSalesman } = cache.readQuery({
                query: GET_ORDERS
            });

            cache.writeQuery({
                query: GET_ORDERS,
                data: {
                    getCustomersSalesman: getCustomersSalesman.filter( order => order.id !== id )
                }
            })
        }
    })

    // console.log(order)

    const [ orderState, setOrderState ] = useState(state);
    const [ orderClass, setOrderClass ] = useState('');

    useEffect(() => {
        if(orderState) {
            setOrderState(orderState);
        }

        orderClassStatus();
    }, [ orderState ]);

    /* fn that modifies the order color according to its status */
    const orderClassStatus = () => {
        if(orderState === 'PENDING') {
            setOrderClass('border-yellow-500')
        } else if (orderState === 'COMPLETED') {
            setOrderClass('border-green-500')
        } else {
            setOrderClass('border-red-800')
        }
    }

    const changeOrderState = async newState => {
        try {
            const { data } = await updateOrder({
                variables: {
                    id, 
                    input: {
                        state: newState,
                        customer: customer.id
                    }
                }
            });

            setOrderState(data.updateOrder.state);

        } catch (error) {
            console.log(error);
        }
    }

    const confirmDeleteOrder = () => {

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!'
        }).then( async (result) => {
            if (result.isConfirmed) {
                try {
                    const data = await deleteOrder({
                        variables: {
                            id
                        }
                    });

                    Swal.fire(
                        'Deleted',
                        data.deleteOrder,
                        'success'
                    );


                } catch (error) {
                    console.log(error)
                }
                
            }
        })
    };

    return ( 
        <div className={` ${orderClass} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
            <div>
                <p className="font-bold text-gray-800">Customer: {name} {firstname} </p>

                { email && (
                    <p className="flex items-center my-2">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        {email}
                    </p>
                )}

                { phone && (
                    <p className="flex items-center my-2">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 mr-2"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        {phone}
                    </p>
                )}

                <h2 className="text-gray-800 font-bold mt-10">Order State:</h2>

                <select
                    className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold"
                    value={orderState}
                    onChange={ e => changeOrderState( e.target.value )  }
                >
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="CANCELED">CANCELED</option>
                </select>
            </div>

            <div>
                <h2 className="text-gray-800 font-bold mt-2">Order Summary</h2>
                { order.order.map( article => (
                    <div key={article.id} className="mt-4">
                        <p className="text-sm text-gray-600">Product: {article.name} </p>
                        <p className="text-sm text-gray-600">Quantity: {article.quantity} </p>
                    </div>
                )) }

                <p className="text-gray-800 mt-3 font-bold ">Total:
                    <span className="font-light"> $ {total}</span>
                </p>

                <button
                    className="uppercase text-xs font-bold flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight"
                    onClick={ () => confirmDeleteOrder() }
                >
                    Delete Order
                </button>
            </div>
        </div>
     );
}
 
export default Order;