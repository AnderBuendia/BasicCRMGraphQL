import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client'
import Router from 'next/router'

const DELETE_CUSTOMER = gql`
    mutation deleteCustomer($id: ID!) {
        deleteCustomer(id:$id) 
    }
`;

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

const Customer = ({customer}) => {

    /* Apollo mutation */
    const [ deleteCustomer ] = useMutation( DELETE_CUSTOMER, {
        update(cache) {
            /* get a copy from cache object */
            const { getCustomersSalesman } = cache.readQuery({ query: GET_CUSTOMERS_USER });

            /* Rewrite cache object */
            cache.writeQuery({
                query: GET_CUSTOMERS_USER,
                data: {
                    getCustomersSalesman : getCustomersSalesman.filter( currentCustomer => currentCustomer.id !== id )
                }
            })
        }
    }  );

    const { name, firstname, company, email, id } = customer;


    /* Delete a customer */
    const confirmDeleteCustomer = () => {
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
                    /* Delete by ID */
                    const { data } = await deleteCustomer({
                        variables: {
                            id
                        }
                    });
                    // console.log(data);

                    /* Show an alert */
                    Swal.fire(
                        'Deleted!',
                        data.deleteCustomer,
                        'success'
                    )
                } catch (error) {
                    console.log(error);
                }
            }
          })
    }

    const editCustomer = () => {
        Router.push({
            pathname: "/editcustomer/[id]",
            query: { id }
        })
    }

    return ( 
            <tr>
                <td className="border px-4 py-2">{name}  {firstname}</td>
                <td className="border px-4 py-2">{company}</td>
                <td className="border px-4 py-2">{email}</td>
                <td className="border px-4 py-2">
                    <div className="flex">
                        <button
                            type="button"
                            className="flex-1 mr-2 justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                            onClick={() => confirmDeleteCustomer() }
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            className="flex-1 justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                            onClick={() => editCustomer() }
                        >
                            Edit
                        </button>
                    </div>
                </td>
            </tr>
     );
}
 
export default Customer;