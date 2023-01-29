
import React, { useEffect, useRef } from 'react';
import Shader from './Shader';

function ShaderView() {
    const canvas = useRef();
    console.log(`ShaderView`, canvas)

    useEffect(() => {
        console.log(`canvas`, canvas)
    }, [canvas]);

    return (
        <canvas className="shader-view" ref={canvas}>
            <Shader canvas={canvas} />
        </canvas>
    );
}

export default ShaderView;