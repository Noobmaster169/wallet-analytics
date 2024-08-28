"use client";

import dynamic from 'next/dynamic'; 
import Link from 'next/link'
import { useState } from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { usePathname } from 'next/navigation';

const links = [
    { name: 'Home', 
      href: '/'
    },
    {
      name: 'Courses',
      href: '/courses',
    },
    { name: 'Bounties', 
      href: '/bounties', 
    },
  ];

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

export default function NavBar() {
    const [dropdown, setDropdown] = useState<boolean>(false);

    return (
        <nav className = "w-full p-4 dark:bg-gray-900 fixed top-0 left-0 right-0 position-sticky z-50">
            <div className="justify-between mx-auto px-4 lg:max-w-7x1 items-center flex md:px-8">
                <h1 className = "hidden md:block text-semibold text-3xl">Deducation</h1>
                <div className ="opacity-0 pointer-events-none">
                    <WalletMultiButtonDynamic style={{background:"#222222"}} />
                </div>

                <div className="gap-5 hidden md:flex center">
                    <PCNavLinks />
                </div>
            
                <h1 className = "hidden md:block text-semibold text-3xl opacity-0">Deducation</h1>
                {/*<div className ="opacity-0 pointer-events-none">*/}
                    <div><WalletMultiButtonDynamic style={{background:"#222222"}} /></div>
                {/*</div>*/}

                <button
                    className="md:hidden p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                    onClick = {() => setDropdown(!dropdown)}
                >
                    {dropdown ? 
                    <IoMdClose /> : 
                    <GiHamburgerMenu />
                    }
                </button>
            </div>
            {/* mobile burger menu*/}
            <div
                className={`items-center justify-between w-full
                ${
                    dropdown ? 'block' : 'hidden'
                    }`}
                onClick = {() => setDropdown(!dropdown)}
            >
                <div 
                className={`flex flex-col font-medium p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 rtl:space-x-reverse dark:bg-gray-800 dark:border-gray-700`}>
                    <div className = "flex items-center mx-auto p-2">
                        <h1 className = "text-xl">Deducation</h1>
                    </div>
                    <ul>
                        <MobileNavLinks />
                    </ul>
                </div>
            </div>
        </nav>
      )
}

function MobileNavLinks() {
    const pathname = usePathname();
    return (
      <>
        {links.map((link) => {
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`${pathname === link.href ? 'block py-2 px-3 text-white bg-blue-700 rounded' : 'block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:border-gray-700'}`}
            >
              <li>{link.name}</li>
            </Link>
          );
        })}
      </>
    );
  }

function PCNavLinks() {
    const pathname = usePathname();
    return (
      <>
        {links.map((link) => {
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`${pathname === link.href ? 'text-blue-300 font-semibold text-2xl' : 'font-semibold text-2xl'}`}
            >
              <h2>{link.name}</h2>
            </Link>
          );
        })}
      </>
    );
}