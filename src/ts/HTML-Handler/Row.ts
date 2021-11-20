import Col from './Col'

export default class Row{

    columns: Col[];
    cssList: string[];
    element: HTMLDivElement;

    constructor(cssList: string[] = [], columns: Col[] = []){
        this.cssList = cssList || [];
        this.columns = columns || [];
        this.element = this.initElement();
    }

    initElement(): HTMLDivElement{
        let row: HTMLDivElement = document.createElement('div');

        row.classList.add('row');
        this.cssList.forEach( cssClass => {
            row.classList.add(cssClass);
        });

        this.columns.forEach( column => {
            row.append(column.element);
        })

        return row;
    }

    addColumn(column: Col){
        this.columns.push(column);
        
    }

}