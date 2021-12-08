export default class Image{

    element     : HTMLImageElement;
    cssList     : string[];
    source      : string;
    alt         : string;

    constructor(src: string, alt: string, cssList: string[]){
        this.source     = src       || 'https://i.imgur.com/LKxy3SR.png';
        this.cssList    = cssList   || [];
        this.alt        = alt       || 'missing alt'
        this.element    = this.initElement();
    }

    initElement(): HTMLImageElement{
        let img: HTMLImageElement = document.createElement('img');

        img.src = this.source;
        img.setAttribute('alt', this.alt);

        this.cssList.forEach( cssClass => {
            img.classList.add(cssClass);
        })

        return img;
    }
}