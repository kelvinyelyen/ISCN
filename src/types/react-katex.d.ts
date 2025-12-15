declare module 'react-katex' {
    import * as React from 'react';

    export interface MathProps {
        children?: React.ReactNode;
        math?: string;
        block?: boolean;
        errorColor?: string;
        renderError?: (error: Error | TypeError) => React.ReactNode;
        settings?: any;
        as?: any;
        [key: string]: any;
    }

    export class InlineMath extends React.Component<MathProps> { }
    export class BlockMath extends React.Component<MathProps> { }
}
