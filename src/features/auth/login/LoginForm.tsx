import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { login } from './login-api';


export default function LoginForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRecover = () => { 
        navigate("/recovery")
     }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await login(email, password);
            setError('');
            navigate('/debug'); // redirection - link mail : http://localhost:5173/reset-password
        } catch (err: any) {
            // setError(err.message);
            setError("LOGIN_FAILURE_MESSAGE");
        }
    };

    return (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex justify-center gap-6 md:gap-10 px-6 py-4"> {/*bg-white dark:bg-gray-100 shadow-lg rounded-2xl*/}
                {/* <IconWrapper icon={<FcGoogle />} />
                <IconWrapper icon={<FaApple />} color="text-black" />
                <IconWrapper icon={<FaFacebook />} color="text-blue-600" />
                <IconWrapper icon={<FaSquareXTwitter />} color="text-black" /> */}
            </div>
            <hr />
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
                className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                type="submit">
                Connexion
            </button>
                <p className="w-fit cursor-pointer text-sm md:hover:underline text-[#f56a2c]" onClick={() => handleRecover()}>Vous avez oublié votre mot de passe ?</p>
            {/* <p className="text-gray-500 text-xs  flex justify-center">Plus d'options de connexion</p> */}
        </form>
    );
}