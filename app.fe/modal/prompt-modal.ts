import {KaCustomModal, template} from "@kasimirjs/embed";
import {textwrap} from "../functions";


const html = `
<div class="modal d-block" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><b>Akuelles Prompt</b> <span class="badge bg-primary"></span> </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" ka.on.click="$fn.close()" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                
                <p ka.htmlContent='prompt.replaceAll("\\n", "<br>")'></p>
              
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" ka.on.click="$fn.close()">Close</button>
            </div>
        </div>
    </div>
</div>
`;


@template(html)
export class PromptModal extends KaCustomModal {

    public async show(prompt : string="nothing"): Promise<void> {

        let scope = this.init({
            prompt,
            $fn: {
                close: () => this.resolve(null)
            }
        })
        await super.show();
    }

}
