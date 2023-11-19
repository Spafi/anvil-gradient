import { Key } from "react";

export default function ColoredText(props: { text: string; isBold: boolean; isItalic: boolean; }) {
    const { text, isBold, isItalic } = props

    const regex = /&#[0-9a-fA-F]{6}(&l)?(&o)?[^&#]*/g;
    const matches = text.match( regex ) || [];
    const fontClasses = isBold && isItalic ? 'font-bold-italic' : isBold ? 'font-bold' : isItalic ? 'font-italic' : 'font-regular'


    return (
            <span className={ 'overflow-scroll' }>
            { matches.map( (segment: string, index: Key) => {
                const color = segment.substring( 1, 8 );
                const content = segment.substring( 8 ).replace( '&l', '' ).replace( '&o', '' );

                return (
                        <span key={ index } style={ { color: color } } className={ fontClasses }>
                        { content }
                    </span>
                );
            } ) }
        </span>
    );
}
