import React from 'react';

const DashBoardPage = async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    return (
        <div>
            Dashboard
        </div>
    );
};

export default DashBoardPage;