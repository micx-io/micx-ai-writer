import {KaCustomModal, template} from "@kasimirjs/embed";
import {textwrap} from "../functions";


const html = `
<div class="modal d-block" tabindex="-1">
    <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><b>Text-Export</b> <span class="badge bg-primary">[[ markdown.split(' ').length]] Wörter</span> </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" ka.on.click="$fn.close()" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <textarea style="height: 100%; width: 100%" ka.textContent="markdown"></textarea>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" ka.on.click="$fn.close()">Close</button>
            </div>
        </div>
    </div>
</div>
`;



@template(html)
export class MarkdownModal extends KaCustomModal {

    public async show(markdown){
        let scope = this.init({
            markdown: textwrap(markdown),
            $fn: {
                close: () => this.resolve(null)
            }
        })
        return super.show();
    }

}
