import axios from 'axios';
import { useCallback, useState } from 'react';
import { NextPageContext } from 'next';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

import Input from '@/components/Input';

const Auth = () => {

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const [variant, setVariant] = useState('login'); 

    
    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login');
    }, []);

    const login = useCallback( async () => {
        try{
            await signIn('credentials', {
              email, 
              password,  
              callbackUrl: '/profiles'  
            });
            
        }catch (error){
            console.log(error);
        }
    } , [email, password]);
    
    const register = useCallback(async () => {
         try {
            await axios.post('/api/register', {
                email, 
                name, 
                password
            });
            
            // you got to define const register after const login so you can get redirected to login()

            login();
         }catch (error) {
            console.log(error);
         }
    }, [email, name, password, login]);

    



    return (
        <div className="relative h-full w-width bg-[url('/images/hero.png')] bg-no-repeat bg-center bg-fixed bg-cover">

            <div className="bg-black w-full h-full lg:bg-opacity-50 ">

                <nav className="px-12 py-5">
                    <img src="/images/logo.png" alt="logo" className="h-12" />
                </nav>



                <div className="flex justify-center">
                    <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
                        
                        <h2 className="text-white text-4xl mb-8 font-semibold">
                            {variant === 'login' ? 'Sign in' : 'Register'}
                        </h2>

                        <div className="flex flex-col gap-4">
                        {variant === 'register' && (
                        <Input 
                        label="Username"
                        onChange={(ev: any) => setName(ev.target.value)}
                        id="name"
                        type="text"
                        value={name} />
                        )}

                        <Input 
                        label="Email"
                        onChange={(ev: any) => setEmail(ev.target.value)}
                        id="email"
                        type="email"
                        value={email} />
                        
                        <Input 
                        label="Password"
                        onChange={(ev: any) => setPassword(ev.target.value)}
                        id="password"
                        type="password"
                        value={password} />
                            
                        </div>
                        
                        <button onClick={variant === 'login' ? login : register} className="bg-blue-600 py-3 text-white rounded-md w-full mt-10 hover:bg-blue-700 transition ">
                            {variant === 'login' ? 'Login' : 'Sign Up'}
                        </button>
                        <div className='flex flex-row items-center gap-4 mt-8 justify-center'>
                            <div 
                            onClick={() => signIn('google', { callbackUrl: '/profiles'})}
                            className="
                             w-10
                             h-10
                             bg-white
                             rounded-full 
                             flex
                             items-center
                             justify-center
                             cursor-pointer
                             hover: opacity-80
                             transition">
                            <FcGoogle size={30} />
                            </div>
                            
                            <div onClick={() => signIn('github', { callbackUrl: '/profiles'})}
                            className="
                             w-10
                             h-10
                             bg-white
                             rounded-full 
                             flex
                             items-center
                             justify-center
                             cursor-pointer
                             hover: opacity-80
                             transition">
                            <FaGithub size={30} />

                            </div>
                        </div>
                        <p className="text-neutral-500 mt-12">
                            {variant === 'login' ? 'First time using Now®?' : 'Already have an account?'} <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">{variant === 'login' ? 'Create an account' : 'Login'}</span>
                        </p>

                    </div>
                </div>




            </div>

        </div>
    );
}

export default Auth;