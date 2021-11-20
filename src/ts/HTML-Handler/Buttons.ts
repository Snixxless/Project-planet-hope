export default class Button{

    text: string;
    cssList: string[];
    callback: () => void;
    isDisabled: boolean;
    element: HTMLButtonElement;

    constructor(text: string, cssList: string[], callback: () => void, isDisabled?: boolean){
        this.text= text;
        this.cssList = cssList || [];
        this.callback= callback;
        this.isDisabled = isDisabled || false;
        this.element = this.initElement();
    }

    initElement(): HTMLButtonElement{
        let button: HTMLButtonElement = document.createElement('button');
        button.innerHTML = this.text;

        this.cssList.forEach( cssClass => {
            button.classList.add(cssClass);
        });

        if(this.isDisabled){
            button.setAttribute('disabled', 'disabled')
        }

        button.addEventListener('click', this.callback);

        return button;
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