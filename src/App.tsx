import './App.css'
import 'primereact/resources/themes/arya-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css'
import { PrimeReactProvider } from "primereact/api";
import { useEffect, useRef, useState } from "react";
import { ColorPicker } from "primereact/colorpicker";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import anvil from "../public/images/anvil.png";
import ColoredText from "./ColoredText.tsx";
import { Toast } from "primereact/toast";
import Footer from "./Footer.tsx";
import { Tooltip } from "primereact/tooltip";

export default function App() {

    const randomHex = (size: number) =>
            [ ...Array( size ) ]
                    .map(
                            () => Math.floor( Math.random() * 16 )
                                      .toString( 16 ) )
                    .join( '' );

    const [ startColor, setStartColor ] = useState( randomHex( 6 ) )
    const [ endColor, setEndColor ] = useState( randomHex( 6 ) )
    const [ isBold, setIsBold ] = useState( false )
    const [ isItalic, setIsItalic ] = useState( false )
    const [ input, setInput ] = useState( 'warp spaf' )
    const [ formattedText, setFormattedText ] = useState( '' )

    const toast = useRef( null );


    const gradientStyle = {
        backgroundImage     : `linear-gradient(90deg, #${ startColor }, #${ endColor })`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor : 'transparent',
        backgroundClip      : 'text',
        color               : 'transparent'
    };

    function setInputTrimmed(input: string) {
        const onlyLettersOrNumbers = input.replace( /[^a-zA-Z0-9 ]/g, '' );
        const trimmedInput = onlyLettersOrNumbers.substring( 0, 42 )
        setInput( trimmedInput )
    }

    useEffect( () => {
        let anvilInput = generateAnvilText( input, startColor, endColor, isBold, isItalic )
        if ( ( isItalic || isBold ) && anvilInput.length > 50 ) {
            anvilInput = anvilInput.substring( 0, 50 )
        }

        setFormattedText( anvilInput )
    }, [ input, startColor, endColor, isBold, isItalic ] )


    function hexToRgb(hex: string) {
        const r = parseInt( hex.slice( 0, 2 ), 16 );
        const g = parseInt( hex.slice( 2, 4 ), 16 );
        const b = parseInt( hex.slice( 4, 6 ), 16 );
        return [ r, g, b ];

    }

    function rgbToHex(r: number, g: number, b: number) {
        return "#" + [ r, g, b ].map( x => {
            const hex = x.toString( 16 );
            return hex.length===1 ? '0' + hex : hex;
        } ).join( '' );
    }


    function generateAnvilText(input: string, startColor: string, endColor: string, isBold: boolean, isItalic: boolean): string {
        const maxLength = 50;

        const startRgb = hexToRgb( startColor );
        const endRgb = hexToRgb( endColor );

        let numStops = input.length;
        let result = "";
        let currentLength;

        do {
            result = "";
            const delta = [ ( endRgb[0] - startRgb[0] ) / numStops, ( endRgb[1] - startRgb[1] ) / numStops, ( endRgb[2] - startRgb[2] ) / numStops ];
            const charactersPerColor = Math.ceil( input.length / numStops );

            for ( let i = 0; i < input.length; i += charactersPerColor ) {
                const currentColor = rgbToHex(
                        Math.round( startRgb[0] + delta[0] * ( i / charactersPerColor ) ),
                        Math.round( startRgb[1] + delta[1] * ( i / charactersPerColor ) ),
                        Math.round( startRgb[2] + delta[2] * ( i / charactersPerColor ) )
                );

                const endIndex = Math.min( i + charactersPerColor, input.length );

                let formatCode = '';
                if ( isBold ) {
                    formatCode += '&l';
                }
                if ( isItalic ) {
                    formatCode += '&o';
                }

                const textSegment = input.substring( i, endIndex );
                result += "&" + currentColor + formatCode + textSegment;
            }

            currentLength = result.length;
            numStops--;
        } while ( currentLength > maxLength && numStops > 0 );

        return result;
    }

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText( text )
                 .then( () => {

                     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                     // @ts-expect-error
                     toast.current!.show( {
                                              severity: 'success',
                                              summary : 'Success',
                                              detail  : 'Text copied to clipboard!',
                                              life    : 3000
                                          } );
                 } )
                 .catch( err => {
                     console.error( 'Failed to copy text: ', err );
                     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                     // @ts-expect-error
                     toast.current!.show( {
                                              severity: 'error',
                                              summary : 'Error',
                                              detail  : 'Failed to copy text.',
                                              life    : 3000
                                          } );
                 } );
    }

    function generateRandomColors() {
        setStartColor( randomHex( 6 ) )
        setEndColor( randomHex( 6 ) )
    }


    return (
            <PrimeReactProvider>
                <div className={ 'h-screen' }>
                    <div className={ 'flex flex-column align-items-center justify-content-center' }>


                        <div className='flex align-items-center justify-content-between w-full mb-4 max-w-400px'>
                            <img src={ anvil } alt='Anvil' width='80px'/>
                            <p className='text-2xl font-regular'
                               style={ gradientStyle }>Anvil Gradient Generator</p>
                        </div>
                        <div className={ 'flex flex-column gap-4 w-full max-w-400px' }>
                            <div className={ 'flex align-items-center justify-content-between gap-4' }>
                                <div>
                                    <ColorPicker name={ 'startColor' }
                                                 format="hex"
                                                 value={ startColor }
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-expect-error
                                                 onChange={ (e) => setStartColor( e.value ) }/>
                                    <label className={ 'ml-2' } htmlFor="startColor">Start Color</label>
                                </div>
                                <div>
                                    <i className="bi bi-arrow-clockwise text-2xl cursor-pointer random text-white"
                                       onClick={ () => generateRandomColors() }></i>
                                    <Tooltip target=".random"
                                             position='top'
                                             content={ 'Random colors' }/>
                                </div>
                                <div>
                                    <ColorPicker name={ 'endColor' }
                                                 format="hex"
                                                 value={ endColor }
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-expect-error
                                                 onChange={ (e) => setEndColor( e.target.value ) }/>
                                    <label className={ 'ml-2' } htmlFor="endColor">End Color</label>
                                </div>
                            </div>

                            <div className={ 'flex flex-column' }>
                                <label className={ 'mb-2' } htmlFor="input">Text to color</label>
                                <InputText value={ input }
                                           name={ 'input' }
                                           placeholder={ 'Enter text here' }
                                           onChange={ (e) => setInputTrimmed( e.target.value ) }/>
                                <small className={ 'text-gray-500' }>Input can contain only letters or numbers</small>
                            </div>

                            <div className={ 'flex flex-column gap-2' }>
                                <div>
                                    <Checkbox checked={ isBold }
                                              name={ 'bold' }
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-expect-error
                                              onChange={ e => setIsBold( e.checked ) }/>
                                    <label className={ 'ml-2' } htmlFor="bold">Bold</label>
                                </div>
                                <div>
                                    <Checkbox checked={ isItalic }
                                              name={ 'italic' }
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-expect-error
                                              onChange={ e => setIsItalic( e.checked ) }/>
                                    <label className={ 'ml-2' } htmlFor="italic">Italic</label>
                                </div>
                            </div>

                            <div>
                                <p className={ 'mb-0 pb-0' }>Preview </p>
                                <small className={ 'text-gray-500' }>dark & white background</small>

                                <div className={ 'preview-container p-2 overflow-scroll' }>
                                    <ColoredText text={ formattedText } isBold={ isBold } isItalic={ isItalic }/>
                                </div>
                                <div className={ 'bg-white preview-container p-2 overflow-scroll' }>
                                    <ColoredText text={ formattedText } isBold={ isBold } isItalic={ isItalic }/>
                                </div>
                            </div>

                            <div>
                                <p className={ 'mb-0 pb-0' }>Text to put in anvil</p>
                                <InputTextarea onClick={ () => copyToClipboard( formattedText ) }
                                               name={ 'formattedText' }
                                               rows={ 3 }
                                               value={ formattedText }
                                               tooltip={ 'Click to Copy!' }
                                               tooltipOptions={ {
                                                   position     : 'top',
                                                   mouseTrack   : true,
                                                   mouseTrackTop: 20
                                               } }
                                               className={ 'w-full mt-2 outline-none' }/>
                                <Toast ref={ toast }/>
                            </div>
                        </div>
                    </div>
                    <Footer/>
                </div>

            </PrimeReactProvider>
    )
}
