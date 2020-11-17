import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const GET_USER = gql`
    query getUser{
        getUser {
            id
            name
            firstname
        }
    }
`;

const Header = () => {

    const router = useRouter();

    /* Apollo query */ 
    const { data, loading, error} = useQuery(GET_USER);

    /* Don't access data before get results */
    if(loading) return null;

    /* If there's no information */
    if(!data) {
        return router.push('/login');
    }

    console.log(data);
    const { name, firstname } = data.getUser;

    const signOut = () => {
        localStorage.removeItem('token');
        router.push('/login');
    }

    return ( 
        <div className="flex justify-between mb-6">
            <p className="mt-1 mr-2 mb-5 lg:mb-0 font-medium">Hi: {name} {firstname}</p>

            <button 
                onClick={() => signOut() }
                type="button"
                className="bg-blue-800 font-bold uppercase text-xs rounded py-2 px-5 text-white shadow-md"    
            >
                Sign Out
            </button>
        </div>
        
     );
}
 
export default Header;