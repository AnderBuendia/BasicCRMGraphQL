import React, {useEffect} from 'react';
import {
    BarChart, Bar,  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
  } from 'recharts';
import { gql, useQuery } from '@apollo/client';
import Layout from '../components/Layout'

const BEST_CUSTOMERS = gql`
    query bestCustomers {
            bestCustomers {
            customer {
                name
                company
            }
            total
        }
    }
`;

const BestCustomers = () => {

    const {data, loading, error, startPolling, stopPolling} = useQuery(BEST_CUSTOMERS);

  

    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling();
        }
    }, [startPolling, stopPolling])

    if(loading) return null;

    // console.log(data);
    const { bestCustomers } = data;
    
    const customerGraph = [];

    bestCustomers.map((customer, index) => {
        customerGraph[index] = {
            ...customer.customer[0],
            total: customer.total
        }
    })


    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Best Customers</h1>

            <ResponsiveContainer
                width={'99%'}
                height={550}
            >
                <BarChart
                    className="mt-10"
                    width={600}
                    height={500}
                    data={customerGraph}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#3182CE" />
                </BarChart>
            </ResponsiveContainer>
        </Layout>
     );
}
 
export default BestCustomers;