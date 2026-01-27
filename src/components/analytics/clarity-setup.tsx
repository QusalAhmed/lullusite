'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

interface ClaritySetupProps {
    projectId: string;
    enabled?: boolean;
}

const ClaritySetup = ({ projectId, enabled = true }: ClaritySetupProps) => {
    useEffect(() => {
        // Only initialize if enabled and projectId is provided
        if (!enabled || !projectId) {
            return;
        }

        try {
            // Initialize Clarity with the project ID
            Clarity.init(projectId);

            // Configure consent preferences
            // This enables consent V2 which respects user preferences
            Clarity.consentV2();

            // Optional: Set custom user properties for better tracking
            if (typeof window !== 'undefined' && window.location) {
                Clarity.setTag('environment', process.env.NODE_ENV || 'production');
            }
        } catch (error) {
            console.error('Failed to initialize Microsoft Clarity:', error);
        }
    }, [projectId, enabled]);

    return null;
};

export default ClaritySetup;