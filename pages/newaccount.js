import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const NEW_ACCOUNT = gql`
    mutation newUser($input: UserInput) {
        newUser(input: $input) {
            id
            name
            firstname
            email
        }
    }
`;


const NewAccount = () => {

    /* Message state */
    const [message, setMessage] = useState(null)

    /* Apollo mutation */
    const [ newUser ] = useMutation(NEW_ACCOUNT);

    /* Routing */
    const router = useRouter();

    /* Formik validation form */
    const formik = useFormik({
        initialValues: {
            name: '',
            firstname: '',
            email: '',
            password: ''
        }, 
        validationSchema: Yup.object({
            name: Yup.string()
                        .required('Name is required'), 
            firstname: Yup.string()
                        .required('Firstname is required'),
            email: Yup.string()
                        .email('Format is not valid')
                        .required('Email is required'),
            password: Yup.string()
                        .required('Password is required')
                        .min(7, 'Minimum 7 characters')
        }),
        onSubmit: async values => {
            // console.log('Sending...');
            // console.log(values);
            const { name, firstname, email, password } = values;
            

            try {
                const { data } = await newUser({
                    variables : {
                        input: {
                            name,
                            firstname,
                            email,
                            password
                        }
                    }
                });
                // console.log(data);

                setMessage(`User was created succesfully: ${data.newUser.name} `);

                /* Redirect to Login Page*/
                setTimeout(() => {
                    setMessage(null);
                    router.push('/login')
                }, 2000);     
            } catch (error) {
                setMessage(error.message.replace('GraphQL error: ', ''));

                setTimeout(() => {
                    setMessage(null);
                }, 4000);
            }
        }
    });

    const showMessage = () => {
        return(
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{message}</p>
            </div>
        )
    }

    return ( 
        <>
            <Layout> 
                {message && showMessage() }

                <h1 className="text-center text-3xl text-white font-bold">New Account</h1>

                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form
                            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
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
                                    placeholder="User Name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
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
                                    Firstname
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="firstname"
                                    type="text"
                                    placeholder="Firstname"
                                    value={formik.values.firstname}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            { formik.touched.firstname && formik.errors.firstname ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.firstname}</p>
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
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            { formik.touched.email && formik.errors.email ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.email}</p>
                                </div>
                            ) : null  }

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            { formik.touched.password && formik.errors.password ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.password}</p>
                                </div>
                            ) : null  }

                            <input
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:cursor-pointer hover:bg-gray-900"
                                value="Create Account"
                            />

                        </form>
                    </div>
                </div>
            </Layout>
        </>
     );
}
 
export default NewAccount;