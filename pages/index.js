import Layout from '../components/Layout';
import Customer from '../components/Customer';
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router';
import Link from 'next/link'

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

const Index = () => {

  const router = useRouter();

  /* Apollo query */
  const { data, loading, refetch } = useQuery(GET_CUSTOMERS_USER);

  if(loading) {
    refetch();
    return <p>Loading...</p>;
  }
  
  if(!data.getCustomersSalesman) {
    router.push('/login');
    return <p>Loading...</p>;
  } 

  return (
    <div>
      <Layout>
          <h1 className="text-2xl text-gray-800 font-light">Customers</h1>
          <Link href="/newcustomer">
            <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">New Customer</a>
          </Link>
          
        <div className="overflow-x-scroll">
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-white">
                  <th className="w-1/5 py-2">Name</th>
                  <th className="w-1/5 py-2">Company</th>
                  <th className="w-1/5 py-2">Email</th>
                  <th className="w-1/4 py-2">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {data.getCustomersSalesman.map( customer => (
                <Customer 
                  key={customer.id}
                  customer={customer}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  )
}

export default Index;