import { authenticatePage } from '@/utils/auth';

import React from 'react';
import ConnectToStripeButton from './connect-to-stripe-button';

async function Billing() {
    await authenticatePage();

    return (
        <div className="flex h-full min-h-48 w-full items-center justify-center">
            <ConnectToStripeButton />
        </div>
    );
}

export default Billing;
