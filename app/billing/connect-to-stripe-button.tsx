'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Link2 } from 'lucide-react';

const ConnectToStripeButton = () => {
    const { toast } = useToast();

    return (
        <Button
            variant="default"
            onClick={() => {
                toast({
                    title: 'Connect to Stripe',
                    description:
                        'This is in beta. Please reach out to enable this feature.',
                    duration: 2000,
                });
            }}
        >
            Connect to Stripe <Link2 className="ml-2" />
        </Button>
    );
};

export default ConnectToStripeButton;
