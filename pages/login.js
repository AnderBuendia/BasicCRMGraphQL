import React, {useState} from 'react';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router'
import Layout from '../components/Layout';

const AUTH_USER = gql`
    mutation authenticateUser($input: AuthenticateInput) {
        authenticateUser(input: $input) {
            token
        }
    }
`;

const Login = () => {
    /* Routing */
    const router = useRouter();

    const [message, setMessage] = useState(null);

    /* Apollo mutation */
    const [ authenticateUser ] = useMutation(AUTH_USER);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        }, 
        validationSchema: Yup.object({
            email: Yup.string()
                        .email('Format is not valid')
                        .required('Email is required'),
            password: Yup.string()
                        .required('Password is required')
        }), 
        onSubmit: async values => {
            // console.log(values);
            const { email, password } = values;

            try {
                const { data } = await authenticateUser({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                });
                console.log(data);
                setMessage('Authenticating...');

                /* Save token in localStorage */
                setTimeout(() => {
                    const { token } = data.authenticateUser;
                    localStorage.setItem('token', token);
                }, 1000);
             
                /* Redirect to customer page */
                setTimeout(() => {
                    setMessage(null);
                    router.push('/');
                }, 2000);

            } catch (error) {
                setMessage(error.message.replace('GraphQL error: ', ''));
                // console.log(error);

                setTimeout(() => {
                    setMessage(null);
                }, 3000);
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

        <>
            <Layout>
                <h1 className="text-center text-3xl text-white font-bold">Login</h1>

                {message && showMessage() }

                <div className="flex justify-center mt-5">
                    <div className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4">
                        <form
                            className="w-full max-w-sm"
                            onSubmit={formik.handleSubmit}
                        >
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>

                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
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
                                value="Login"
                            />
                        </form>
                        <div>
                            <div className="border-gray border-t-2 block mt-8 text-center"></div>
                            <div className="w-full grid">
                                <p className="text-lg font-roboto font-bold text-gray-800 mt-8 text-center">You don't have an account?</p>
                                <Link href="/newaccount"><a className="bg-gray-800 w-full mt-5 p-2 text-white text-center uppercase font-bold hover:cursor-pointer hover:bg-gray-900">Create New Account</a></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
     );
}
 
export default Login;