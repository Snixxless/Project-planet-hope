export default class VersionDisplay{

    versionNumber   : string;
    element         : HTMLDivElement;

    constructor(version: string){
        this.versionNumber = version || "";
        this.element = this.createHTMLElement();
        this.appendToView();
    }

    createHTMLElement(): HTMLDivElement{
        let versionContainer = document.createElement('div');
        let versionNumber = document.createElement('div');

        versionNumber.innerText = `v${this.versionNumber}`;
        versionNumber.id = "version-number";

        versionContainer.id = "version-display";

        versionContainer.append(versionNumber);

        return versionContainer;
    }

    appendToView(){
        document.querySelector('body').append(this.element);
    }


}