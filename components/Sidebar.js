import React from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router';

const Sidebar = () => {

    /* Next Routing */
    const router = useRouter();

    // console.log(router.pathname)

    return ( 
        <aside className="bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5" >
            <div>
                <p className="text-white text-2xl font-black">CRM Customers</p>
            </div>

            <nav className="mt-5 list-none">
                <li className={router.pathname === "/" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/">
                        <a className="text-white block">
                            Customer
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === "/orders" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/orders">
                        <a className="text-white block">
                            Orders
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === "/products" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/products">
                        <a className="text-white block">
                            Products
                        </a>
                    </Link>
                </li>
            </nav>

            <div className="sm:mt-10">
                <p className="text-white text-2xl font-black">More Options</p>
            </div>
            <nav className="mt-5 list-none">
                <li className={router.pathname === "/bestsalesmen" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/bestsalesmen">
                        <a className="text-white block">
                            Best Salesmen
                        </a>
                    </Link>
                </li>
                <li className={router.pathname === "/bestcustomers" ? "bg-blue-800 p-2" : "p-2"}>
                    <Link href="/bestcustomers">
                        <a className="text-white block">
                            Best Customers
                        </a>
                    </Link>
                </li>
            </nav>

        </aside>
     );
}
 
export default Sidebar;