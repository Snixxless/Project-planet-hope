export default class Input{

    id: string;
    type: string;
    cssList: string[];
    isDisabled: boolean;
    placeholder: string;
    element: HTMLInputElement;

    constructor(cssList: string[], id: string, type?: string, placeholder?: string, isDisabled?:boolean){
        this.id = id;
        this.type = type || 'text';
        this.cssList = cssList || [];
        this.placeholder = placeholder || '';
        this.isDisabled = isDisabled || false;
        this.element = this.initElement();
    }

    initElement(): HTMLInputElement{
        let input: HTMLInputElement = document.createElement('input');
        
        input.setAttribute('type', this.type);
        input.setAttribute('placeholder',this.placeholder) 
        
        input.id = this.id;
        input.classList.add('form-control')
        this.cssList.forEach( cssClass => {
            input.classList.add(cssClass);
        });
        
        if(this.isDisabled){
            input.setAttribute('disabled', 'disabled')
        }

        return input;
    }

    toggleDisable(): void{
        this.isDisabled = !this.isDisabled;
        if(this.isDisabled){
            this.element.setAttribute('disabled', 'disabled');
        } else {
            this.element.removeAttribute('disabled');
        }
    }
}

