import React from 'react';
import Layout from '../components/Layout'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import {gql, useMutation} from '@apollo/client' 
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

const GET_PRODUCT = gql`
    mutation newProduct($input: ProductInput) {
        newProduct(input: $input) {
            id
            name
            stock
            price
        }
    }
`;

const GET_PRODUCTS = gql`
  query getProducts {
      getProducts {
          id
          name
          price
          stock
      }
  }
`;

const NewProduct = () => {

    /* Routing */
    const router = useRouter();

    /* Apollo Mutation */
    const [ newProduct ] = useMutation(GET_PRODUCT, {
        update(cache, { data: { newProduct } }) {

            const { getProducts } = cache.readQuery({ query: GET_PRODUCTS });
            
            cache.writeQuery({
                query: GET_PRODUCTS,
                data: {
                    getProducts: [...getProducts, newProduct]
                }
            });
        }
    });

    /* Formik validation form */
    const formik = useFormik({
        initialValues: {
            name: '',
            stock: '',
            price: ''
        },
        validationSchema: Yup.object({
            name: Yup.string() 
                        .required('Product name is required'), 
            stock: Yup.number()
                        .required('Add an available quantity')
                        .positive('Negative numbers are not valid')
                        .integer('Stock must be a whole number'),
            price: Yup.number()
                        .required('Price is required')
                        .positive('Stock must be a whole number')
        }), 
        onSubmit: async values => {
            const { name, stock, price} = values;

            try {
                const { data } = await newProduct({
                    variables: {
                        input: {
                            name,
                            stock,
                            price
                        }
                    }
                });

                /* Show an alert*/
                Swal.fire(
                    'Created',
                    'Product has been created',
                    'success'
                )

                /* Redirect to product page */
                router.push('/products'); 
            } catch (error) {
                console.log(error);
            }
        }
    });

    return ( 
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Create New Product</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Name
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="name"
                                    type="text"
                                    placeholder="Product Name"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                />
                            </div>

                            { formik.touched.name && formik.errors.name ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.name}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
                                    Quantity
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="stock"
                                    type="number"
                                    placeholder="Quantity"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.stock}
                                />
                            </div>

                            { formik.touched.stock && formik.errors.stock ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.stock}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                                    Price
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="price"
                                    type="number"
                                    placeholder="Price"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.price}
                                />
                            </div>

                            { formik.touched.price && formik.errors.price ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.price}</p>
                                </div>
                            ) : null  }

                            <input
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                value="Create Product"
                            />
                    </form>
                </div>
            </div>
        </Layout>
     );
}
 
export default NewProduct;