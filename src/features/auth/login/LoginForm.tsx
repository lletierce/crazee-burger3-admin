import React, { useState } from 'react'
import { useLogin } from './use-login';
import { Link } from 'react-router';


export default function LoginForm() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {
        handleLogin,
        error,
        loading,
    } = useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleLogin(email, password);
    };

    return (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* 
            <div className="flex justify-center gap-6 md:gap-10 px-6 py-4"> 
                <IconWrapper icon={<FcGoogle />} />
                <IconWrapper icon={<FaApple />} color="text-black" />
                <IconWrapper icon={<FaFacebook />} color="text-blue-600" />
                <IconWrapper icon={<FaSquareXTwitter />} color="text-black" />
            </div>
            <hr /> 
            */}
            {error && <p className="text-red-600">{error}</p>}
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                maxLength={50}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mot de passe"
                maxLength={30}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading}
                type="submit">
                {loading ? 'Connexion...' : 'Connexion'}
            </button>
                <Link className="w-fit cursor-pointer text-sm md:hover:underline text-[#f56a2c]" to="/recovery">
                    Vous avez oublié votre mot de passe ?
                </Link>
            {/* <p className="text-gray-500 text-xs  flex justify-center">Plus d'options de connexion</p> */}
        </form>
    );
}