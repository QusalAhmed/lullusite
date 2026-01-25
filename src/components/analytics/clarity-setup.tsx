'use client';

import Clarity from '@microsoft/clarity';

const ClaritySetup = ({projectId}: {projectId: string}) => {
    Clarity.init(projectId);
    Clarity.consentV2();

    return null;
};

export default ClaritySetup;