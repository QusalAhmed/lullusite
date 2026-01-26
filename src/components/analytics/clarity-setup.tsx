import Clarity from '@microsoft/clarity';

const ClaritySetup = ({projectId}: {projectId: string}) => {
    if(typeof window === 'undefined') {
        return null;
    }

    Clarity.init(projectId);
    Clarity.consentV2();

    return null;
};

export default ClaritySetup;