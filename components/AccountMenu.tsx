import React from 'react';

import {BiLogOut} from 'react-icons/bi';

import useCurrentUser from '@/hooks/useCurrentUser';
import { signOut } from 'next-auth/react';
import { sign } from 'crypto';


interface AccountMenuProps{
    visible?: boolean;
}

const AccountMenu: React.FC<AccountMenuProps> = ({ visible }) => {
    
    
    const { data } = useCurrentUser();
    
    if(!visible) {
        return null;
    }


return (
    <div className='bg-black w-56 absolute top-14 right-0 py-5 flex-col border-2 border-gray-800 flex'>
        <div className='flex flex-col gap-3'>
            <div className='px-3 group/item flex flex-row gap-3 items-center w-full '>
                <img className='w-8 rounded-md' src="/images/default-slate.png" alt="" />
                <p className='text-white text-sm group-hover/item:underline'>
                    {data?.name}
                </p>
            </div>
            <hr className=' border-gray-800 h-px my-1' />
            <div onClick={() => signOut() } className='px-3 text-center text-white text-sm hover:underline'>
                Sign Out 
            </div>
        </div>
    </div>
)



}

export default AccountMenu;