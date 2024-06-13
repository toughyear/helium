'use client';

import React from 'react';
import SecondaryNavLinks from './SecondaryNavLinks';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrgsStore } from '@/store/useOrgsStore';

function SecondaryNavbar() {
    const { user } = useAuthStore();

    const { activeOrg } = useOrgsStore();
    if (!user) return null;

    return (
        <div className="flex w-full flex-col items-center">
            <div className="w-full max-w-4xl px-3 opacity-0 animate-in">
                <main className="group flex flex-1 flex-col pt-8">
                    <h2 className="mb-2 text-4xl text-zinc-700">
                        Hey{' '}
                        <span className="">{user?.email?.split('@')[0]}</span>{' '}
                        <img
                            className="inline size-10 transition-transform group-hover:rotate-12"
                            src="https://em-content.zobj.net/source/apple/96/victory-hand_270c.png"
                            alt="victory-hand"
                        />
                    </h2>
                    {activeOrg ? (
                        <h3 className="text-2xl text-zinc-500">
                            Welcome Back.
                        </h3>
                    ) : (
                        <h3 className="text-2xl text-zinc-500">
                            Let's get you started!
                        </h3>
                    )}
                    <SecondaryNavLinks />
                </main>
            </div>
        </div>
    );
}

export default SecondaryNavbar;
