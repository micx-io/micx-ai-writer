import {customElement, KaCustomElement, KaHtmlElement, template} from "@kasimirjs/embed";
import {router} from "@kasimirjs/app";


// language=html
let html = `
<div ka.debug="progress">
    <input ka.ref="'upload1'" type="file" multiple>
    <div class="progress" ka.if="progress !== null">
        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-label="Animated striped example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" ka.style.width="progress"></div>
    </div>
</div>`

@customElement("app-file-upload")
@template(html)
export class FileUpload extends KaCustomElement {

    constructor(public uploadCallback: (file: File) => Promise<void>) {
        super();

        let scope = this.init({
            progress: null
        });

    }

    doUpload() {

    }

    connectedCallback(): Promise<void> {
        super.connectedCallback();

        document.addEventListener("paste", async (e: ClipboardEvent) => {
            console.log(JSON.stringify(e.clipboardData.files[0]));


            console.log("paste", e);
            let formData = new FormData();
            formData.append("file", e.clipboardData.files[0]);
        });

        this.scope.render();
        let scope = this.scope;
        scope.$ref.upload1.addEventListener("change", async () => {
            let files = scope.$ref.upload1.files;
            console.log(files);
            scope.progress = "0%";

            for (let index = 0; index < files.length; index++) {
                let file = files[index];
                let formData = new FormData();
                console.log(file);
                formData.append("file", file);
                scope.progress = ((index / files.length) * 100) + "%"

                await this.uploadCallback(file);
            }
            scope.progress = null;
            scope.$ref.upload1.value = "";
        })
        return null
    }


}
