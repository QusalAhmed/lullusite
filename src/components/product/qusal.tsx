import React, {memo} from 'react';

const Qusal = memo(function Greeting() {
    console.log('Qusal component rendered');
    return <h1>Hello</h1>;
});

export default Qusal;