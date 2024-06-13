'use client';

import { useState, Suspense, useEffect } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import {
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    MoveRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import Loader from '@/components/ui/Loader';
import loginBg from '../../public/login_bg.webp';
import Image from 'next/image';

const supabase = createClient();

enum AuthState {
    Idle = 'IDLE',
    SigningIn = 'SIGNING_IN',
    SigningUp = 'SIGNING_UP',
}

const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authState, setAuthState] = useState(AuthState.Idle);

    const { user, loading } = useAuthStore();

    const signIn = async () => {
        setAuthState(AuthState.SigningIn);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setAuthState(AuthState.Idle);
            return router.push('/login?message=Could not authenticate user');
        }
        return router.push('/');
    };

    const signUp = async () => {
        setAuthState(AuthState.SigningUp);
        const origin = window.location.origin;

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
            },
        });

        if (error) {
            setAuthState(AuthState.Idle);
            return router.push('/login?message=Could not authenticate user');
        }

        setAuthState(AuthState.Idle);
        return router.push(
            '/login?message=Check email to continue sign in process'
        );
    };

    if (user) {
        router.push('/');
        return null;
    }

    if (loading) {
        return (
            <div className="mx-auto mt-10 flex w-full items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <div className="my-auto grid h-full w-full grid-cols-1 gap-10 sm:grid-cols-2">
                    <div className="relative hidden items-center sm:flex">
                        <div className="image-parallax h-full max-h-[550px] rounded-3xl animate-in">
                            <Image
                                src={loginBg}
                                alt="Login background"
                                className="h-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        {/* Suspense wrapper added for useSearchParams */}
                        <Suspense fallback={<div>Loading...</div>}>
                            <SearchParamsComponent />
                        </Suspense>
                        <div className="mb-10">
                            <h1 className="mb-2 font-serif text-4xl font-extrabold animate-in">
                                Get Started
                            </h1>
                            <p className="text-sm text-zinc-500 animate-in">
                                HeliumX let's you connect your existing data
                                sources to easily build workflows using LLMs.
                            </p>
                        </div>
                        <AuthFormComponent
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            authState={authState}
                            setAuthState={setAuthState}
                            signIn={signIn}
                            signUp={signUp}
                        />
                    </div>
                </div>
            </Suspense>
        </div>
    );
}

function SearchParamsComponent() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message');
    return message ? (
        <p className="my-4 rounded-xl border border-zinc-300 bg-zinc-100 p-4 text-zinc-700">
            <AlertCircle className="mr-2 inline-flex" /> {message}
        </p>
    ) : null;
}

function AuthFormComponent({
    email,
    setEmail,
    password,
    setPassword,
    authState,
    setAuthState,
    signIn,
    signUp,
}: {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    authState: AuthState;
    setAuthState: (authState: AuthState) => void;
    signIn: () => Promise<void>;
    signUp: () => Promise<void>;
}) {
    const MotionMoveRight = motion(MoveRight);
    const MotionChevronRight = motion(ChevronRight);
    const MotionChevronLeft = motion(ChevronLeft);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [prevIsEmailValid, setPrevIsEmailValid] = useState(false);

    useEffect(() => {
        setIsEmailValid((prev) => {
            setPrevIsEmailValid(prev);
            return isValidEmail(email);
        });
    }, [email]);

    return (
        <>
            <label className="text-md" htmlFor="email">
                Email
            </label>
            <input
                className="mb-6 rounded-xl border bg-zinc-100/70 px-4 py-2 placeholder:text-sm"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <label className="text-md" htmlFor="password">
                Password
            </label>
            <input
                className="mb-6 rounded-xl border bg-zinc-100/70 px-4 py-2 placeholder:text-sm"
                type="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <motion.button
                layout
                type="button"
                onClick={signIn}
                disabled={
                    authState !== AuthState.Idle || !isEmailValid || !password
                }
                className="mb-2 rounded-xl bg-zinc-900 px-4 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:bg-zinc-800"
            >
                <LayoutGroup>
                    <motion.div
                        layoutId="signInButton"
                        className="flex items-center justify-center"
                    >
                        <motion.span layoutId="signInText">
                            {authState === AuthState.SigningIn
                                ? 'Signing In...'
                                : 'Sign In'}
                        </motion.span>

                        {isEmailValid && (
                            <MotionMoveRight
                                layoutId="moveRight"
                                initial={
                                    prevIsEmailValid
                                        ? { opacity: 1, x: 10 }
                                        : { opacity: 0, x: 0 }
                                }
                                animate={{ opacity: 1, x: 10 }}
                                exit={{ opacity: 0, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className="ml-2 inline-flex h-6 w-6"
                            />
                        )}
                    </motion.div>
                </LayoutGroup>
            </motion.button>

            <LayoutGroup>
                <motion.button
                    layoutId="signUpButton"
                    type="button"
                    onClick={signUp}
                    disabled={authState !== AuthState.Idle || !isEmailValid}
                    className="mb-2 flex items-center justify-between rounded-xl border border-foreground/20 px-4 py-2 text-foreground disabled:cursor-not-allowed"
                    whileHover="hover"
                    initial="initial"
                >
                    <MotionChevronRight
                        layoutId="chevronRight"
                        className="mr-2 inline-flex text-zinc-300"
                        variants={{
                            initial: { opacity: 0, x: 0 },
                            hover: { opacity: 1, x: 10 },
                        }}
                        transition={{ duration: 0.3 }}
                    />
                    {authState === AuthState.SigningUp
                        ? 'Signing Up...'
                        : 'Sign Up'}
                    <MotionChevronLeft
                        layoutId="chevronLeft"
                        className="ml-2 inline-flex text-zinc-300"
                        variants={{
                            initial: { opacity: 0, x: 0 },
                            hover: { opacity: 1, x: -10 },
                        }}
                        transition={{ duration: 0.3 }}
                    />
                </motion.button>
            </LayoutGroup>
        </>
    );
}
