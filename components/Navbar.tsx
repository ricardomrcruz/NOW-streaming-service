import {useCallback, useState, useEffect} from 'react';

import NavbarItem from '@/components/NavbarItem';
import MobileMenu from '@/components/MobileMenu';
import AccountMenu from '@/components/AccountMenu';
import {BsChevronDown, BsSearch, BsBell} from 'react-icons/bs';

const TOP_OFFSET = 66;

const Navbar = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false); 
    const [showAccountMenu, setShowAccountMenu] = useState(false); 
    const [showBackground, setShowBackground] = useState(false); 

    // function that adds background color to nav while scrolling

    useEffect(() => {
        const handleScroll = () => {
        if(window.scrollY >= TOP_OFFSET){
            setShowBackground(true);
        }else{
            setShowBackground(false);
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }

    }
    }, []);


    // callbacks to toggle the two menus in the navbar

    const toggleMobileMenu = useCallback(() => {
        setShowMobileMenu((current) => !current);
    }, []);
    const toggleAccountMenu = useCallback(() => {
        setShowAccountMenu((current) => !current);
    }, []);

    return (
        <nav className="w-full fixed z-40 ">
           <div
           className={`
           px-4
           md:px-16
           py-6
           flex
           flex-row
           items-center
           transition
           duration-500
           ${showBackground ? 'bg-zinc-900 bg-opacity-90' : ''}
           `}
           >
            <img className="h-6 lg:h-10" src="/images/logo.png" alt="" />
            <div className="
            flex-row
            ml-8
            gap-7
            hidden
            lg:flex
            ">

                <NavbarItem label='Home' />
                <NavbarItem label='Videos' />
                <NavbarItem label='Movies' />
                <NavbarItem label='Trending' />
                <NavbarItem label='My List' />
                <NavbarItem label='Browse by topic' />

            </div>

            {/* nav left items menu toggle */}

            <div onClick={toggleMobileMenu} className='lg:hidden flex flex-row items-center gap-2 ml-8 cursor-pointer relative'>
                <p className='text-white text-sm'>Browse</p>
                <BsChevronDown className={`text-white transition ${ showMobileMenu ? 'rotate-180' : 'rotate-0'}`}  />
                <MobileMenu visible={showMobileMenu} />
            </div>
           
           <div className='flex flex-row ml-auto gap-7 items-center'>
                <div className='text-gray-200 hover:text-gray-300 cursor-pointer transition'>
                    <BsSearch />
                </div>
                <div className='text-gray-200 hover:text-gray-300 cursor-pointer transition'>
                    <BsBell/>
                </div>

                {/* accounts right menu toggle */}

                <div onClick={toggleAccountMenu} className='flex flex-row items-center gap-2 cursor-pointer relative'>
                    <div className='w-6 h-6 lg:w-10 lg:h-10 rounded-md overflow-hidden '>
                        <img src="/images/default-slate.png" alt="" />
                    </div>
                    <BsChevronDown className={`text-white transition ${showAccountMenu ? 'rotate-180' : 'rotate-0'}`}  />
                    <AccountMenu visible={showAccountMenu} />
                </div>
           </div>
           
           
           </div>
           



        </nav>
    )
}

export default Navbar;