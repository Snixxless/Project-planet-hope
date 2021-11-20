export default class Col{

    elements: any[];
    cssList: string[];
    element: HTMLDivElement;

    constructor(cssList: string[] = [], elements: any[] = []){
        this.cssList = cssList || [];
        this.elements = elements || [];
        this.element = this.initElement();
    }

    initElement(): HTMLDivElement{
        let col: HTMLDivElement = document.createElement('div');

        col.classList.add('col');
        this.cssList.forEach( cssClass => {
            col.classList.add(cssClass);
        });

        this.elements.forEach( element => {
            col.append(element.element);
        })

        return col;
    }

}