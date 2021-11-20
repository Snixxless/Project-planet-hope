import Button from "../HTML-Handler/Buttons";
import Input from "../HTML-Handler/Input";
import Col from "../HTML-Handler/Col";
import Row from "../HTML-Handler/Row";

export default class SelectAreaHandler{

    element: HTMLDivElement;

    constructor(){
        this.element = document.createElement('div');
        this.element.id = 'select-area';
        document.getElementById('game').append(this.element);
    }

    displayDebug(): void{
        let button_add: Button = new Button('Add', ['btn', 'btn-primary', 'w-100'], () => {});
        let button_delete: Button = new Button('Delete', ['btn', 'btn-danger', 'w-100'], () => {});
        let input_test: Input = new Input(['w-100'],'testInput');

        let testcol_add: Col = new Col([], [button_add]);
        let testcol_delete: Col = new Col([], [button_delete]);
        let test_input : Col = new Col([],[input_test]);
        

        let testrow: Row = new Row([], [testcol_add, testcol_delete]);
        let testrow2: Row = new Row([],[test_input]);
        this.setView([testrow,testrow2]);
    }

    /**
     * 
     * @param element 
     */
    setView(elements: Row[]){
        this.element.innerHTML = "";
        elements.forEach( row => {
            this.element.append(row.element);
        })
    }

    clearView(){
        this.element.innerHTML = "";
    }

    setInactive(){
        this.element.classList.add('inactive-bottom');
    }

    setActive(){
        this.element.classList.remove('inactive-bottom');
    }

}