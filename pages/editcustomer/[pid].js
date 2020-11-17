import React from 'react';
import { useRouter } from 'next/router'
import Layout from '../../components/Layout';
import { useQuery, gql, useMutation } from '@apollo/client'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2';

const GET_CUSTOMER = gql`
    query getCustomer($id:ID!) {
        getCustomer(id:$id) {
            name
            firstname
            email
            phone
            company
        }
    }
`;

const UPDATE_CUSTOMER = gql`
    mutation updateCustomer($id: ID!, $input: CustomerInput) {
        updateCustomer(id: $id, input: $input) {
            name
            email
        }
    }
`;

const EditCustomer = () => {
    /* Get current ID */
    const router = useRouter();
    const { query: { id } } = router;
    // console.log(id)

    /* Apollo query to get customer */
    const { data, loading, error } = useQuery(GET_CUSTOMER, {
        variables: {
            id
        }
    });

    /* Update customer */
    const [ updateCustomer ] = useMutation(UPDATE_CUSTOMER);

    // Schema de validacion
    const schemaValidation = Yup.object({
        name: Yup.string() 
                    .required('Customer name is required'),
        firstname: Yup.string() 
                    .required('Firstname customer is required'),
        company: Yup.string() 
                    .required('Company is required'),
        email: Yup.string()
                    .email('Format is not valid') 
                    .required('Customer email is required')
    });

    if(loading) return null;

    // console.log(data.getCustomer)

    const { getCustomer } = data;

    /* Modifies customer in DB */
    const updateInfoCustomer = async values => {
        const { name, firstname, company, email, phone } = values;

        try {
            const { data } = await updateCustomer({
                variables: {
                    id,
                    input: {
                        name, 
                        firstname, 
                        company, 
                        email, 
                        phone
                    }
                }
            });

            /* Show an alert */
            Swal.fire(
                'Updated',
                'CUstomer has been updated',
                'success'
            )

            /* Redirect to Home Page */
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    return ( 
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Edit Customer </h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">

                    <Formik
                        validationSchema={ schemaValidation }
                        enableReinitialize
                        initialValues={ getCustomer }
                        onSubmit={ ( values ) => {
                            updateInfoCustomer(values)
                        }}
                    >

                    {props => {
                    // console.log(props);
                    return (
                            <form
                                className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                onSubmit={props.handleSubmit}
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.name}
                                        />
                                    </div>

                                    { props.touched.name && props.errors.name ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.name}</p>
                                        </div>
                                    ) : null  } 

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstname">
                                            Firstname
                                        </label>

                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="firstname"
                                            type="text"
                                            placeholder="Customer Firstname"
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.firstname}
                                        />
                                    </div>

                                    { props.touched.firstname && props.errors.firstname ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.firstname}</p>
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.company}
                                        />
                                    </div>

                                    { props.touched.company && props.errors.company ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.company}</p>
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.email}
                                        />
                                    </div>

                                    { props.touched.email && props.errors.email ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.email}</p>
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            value={props.values.phone}
                                        />
                                    </div>

                                    <input
                                        type="submit"
                                        className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                                        value="Edit Customer"
                                    />
                            </form>      
                        )
                    }}
                    </Formik> 
                </div>
            </div>

        </Layout>
     );
}
 
export default EditCustomer;