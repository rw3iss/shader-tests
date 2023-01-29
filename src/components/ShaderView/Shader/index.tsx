import Program from 'app/lib/Program';
import { useEffect, useState } from 'react';

const Shader = ({ canvas }) => {
    const [program, setProgram] = useState(undefined);

    useEffect(() => {
        console.log(`Shader`, canvas, program)
        if (canvas.current) {
            setProgram(new Program(canvas.current));
        }
    }, [canvas])

    return undefined;
}

export default Shader;
