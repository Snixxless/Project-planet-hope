export default class DisplayHandler{

    containerElement: HTMLElement;
    imageArea: HTMLDivElement;
    displayArea: HTMLDivElement; 

    /**
     * Handles Image Area and Text Area
     */
    constructor(){

        this.imageArea = document.createElement('div');
        this.imageArea.id ="picture-area";

        this.displayArea = document.createElement('div');
        this.displayArea.id = "display-area";

        this.containerElement = document.getElementById('displays');
        this.containerElement.append(this.imageArea);
        this.containerElement.append(this.displayArea);
    }

    /**
     * Adds new Text to the TextArea
     * @param text Text that will be displayed inside textarea
     */
    async displayText(text: string): Promise<void>{

        this.displayArea.innerHTML = '';

        let textArray: string[] = [];
        textArray = text.split('');

        let index = 0;
        while(textArray.length > index){
            await this.waitForMS(10);
            this.displayArea.innerHTML += textArray[index];
            index++;
        }
    }

    /**
     * Waits for given milliseconds
     * @param ms time in milliseconds
     */
    async waitForMS(ms: number){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}