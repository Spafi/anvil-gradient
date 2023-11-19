import { Key } from "react";

export default function ColoredText({ text }) {

    const regex = /&#[0-9a-fA-F]{6}[^&#]*/g;
    const matches = text.match( regex ) || [];

    return (
            <span className={ 'overflow-scroll' }>
            { matches.map( (segment: string, index: Key) => {
                const color = segment.substring( 1, 8 );
                const content = segment.substring( 8 );

                return (
                        <span key={ index } style={ { color: color } } className='font-regular'>
                        { content }
                    </span>
                );
            } ) }
        </span>
    );
}
