import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router'

const NEW_CUSTOMER = gql`
    mutation newCustomer($input: CustomerInput) {
        newCustomer(input: $input) {
            id
            name
            firstname
            company
            email
            phone
        }
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

const NewCustomer = () => {

    const router = useRouter();

    /* Alert message */
    const [message, setMessage] = useState(null);

    /* Apollo mutation */
    const [ newCustomer ] = useMutation(NEW_CUSTOMER, {
        update(cache, { data: { newCustomer } } ) {
            const { getCustomersSalesman } = cache.readQuery({ query: GET_CUSTOMERS_USER  });

            cache.writeQuery({
                query: GET_CUSTOMERS_USER,
                data: {
                    getCustomersSalesman : [...getCustomersSalesman, newCustomer ]
                }
            })
        }
    })


    const formik = useFormik({
        initialValues: {
            name: '',
            firstname: '',
            company: '',
            email: '',
            phone: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string() 
                        .required('Name is required'),
            firstname: Yup.string() 
                        .required('Firstname is required'),
            company: Yup.string() 
                        .required('Company is required'),
            email: Yup.string()
                        .email('Format is not valid') 
                        .required('Email is required')
        }), 
        onSubmit: async values => {

            const {name, firstname, company, email, phone } = values

            try {
                const { data } = await newCustomer({
                    variables: {
                        input: {
                            name, 
                            firstname, 
                            company, 
                            email, 
                            phone
                        }
                    }
                });
    
                router.push('/'); /* Redirect to customer page */
            } catch (error) {
                setMessage(error.message.replace('GraphQL error: ', ''));

                setTimeout(() => {
                    setMessage(null);
                }, 2000);
            }
        }
    })

    const showMessage = () => {
        return(
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{message}</p>
            </div>
        )
    }

    return ( 
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">New Customer</h1>

            {message && showMessage() }

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
                                    placeholder="Customer Name"
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstname">
                                    FirstName
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="firstname"
                                    type="text"
                                    placeholder="FirstName"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.firstname}
                                />
                            </div>

                            { formik.touched.firstname && formik.errors.firstname ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.firstname}</p>
                                </div>
                            ) : null  }


                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
                                    Company
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="company"
                                    type="text"
                                    placeholder="Company"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.company}
                                />
                            </div>

                            { formik.touched.company && formik.errors.company ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.company}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                />
                            </div>

                            { formik.touched.email && formik.errors.email ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.email}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                                    Phone
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="phone"
                                    type="tel"
                                    placeholder="Phone"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.phone}
                                />
                            </div>

                            <input
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                value="Create Customer"
                            />
                    </form>
                </div>
            </div>
        </Layout>
        
     );
}
 
export default NewCustomer;