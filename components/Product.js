import React from 'react';
import Swal from 'sweetalert2'
import { gql, useMutation } from '@apollo/client'
import Router from 'next/router';

const DELETE_PRODUCT = gql`
    mutation deleteProduct($id: ID!) {
        deleteProduct(id: $id) 
    }
`;

const GET_PRODUCTS = gql`
  query getProducts {
      getProducts {
          id
          nombre
          precio
          existencia
      }
  }
`;

const Product = ({product}) => {
    const { name, price, stock, id } = product;

    /* Apollo Mutation */
    const [ deleteProduct ] = useMutation(DELETE_PRODUCT, {
        update(cache) {
            const { getProducts } = cache.readQuery({
                query: GET_PRODUCTS
            });

            cache.writeQuery({
                query: GET_PRODUCTS,
                data: {
                    getProducts: getProducts.filter( currentProduct => currentProduct.id !== id )
                }
            })
        }
    });


    const confirmDeleteProduct = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, delete it!',
            cancelButtonText: 'No, cancel!'
          }).then( async (result) => {
                if (result.isConfirmed) {
                        try {
                            /* Delete product from DB */
                            const { data } = await deleteProduct({
                                variables: {
                                    id
                                }
                            });

                            // console.log(data);

                            Swal.fire(
                                'Deleted',
                                data.deleteProduct,
                                'success'
                            )
                        } catch (error) {
                            console.log(error);
                        }
                
                }
          })
    }


    const editProduct = () => {
        console.log('click')
        Router.push({
            pathname: "/editproduct/[id]",
            query: { id }
        })
    }

    return ( 
        <tr>
            <td className="border px-4 py-2">{name} </td>
            <td className="border px-4 py-2">{stock} Units</td>
            <td className="border px-4 py-2">{price} €</td>
            <td className="border px-4 py-2">
                <div className="flex">
                    <button
                            type="button"
                            className="flex-1 mr-2 justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                            onClick={() => confirmDeleteProduct() }
                    >
                        Delete
                    </button>
                    <button
                        type="button"
                        className="flex-1 justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold"
                        onClick={() => editProduct() }
                    >
                        Edit
                    </button>
                </div>
            </td>
        </tr>
     );
}
 
export default Product;