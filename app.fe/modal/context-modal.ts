import {KaCustomModal, template} from "@kasimirjs/embed";
import {textwrap} from "../functions";


const html = `
<div class="modal d-block" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><b>Context [[ context.contextId !== null ? 'bearbeiten' : 'neu anlegen']]</b> <span class="badge bg-primary">[[ context.contextId ]] </span> </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" ka.on.click="$fn.close()" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label">Context-Name</label>
                    <input type="text" class="form-control" ka.bind="context.name">
                </div>
                <textarea class="form-control" style="min-height: 200px; width: 100%" ka.bind="context.prompt"></textarea>
                <div class="mt-3">
                    Platzhalter: %wochentag% %datum%
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" ka.on.click="$fn.close()">Close</button>
            </div>
        </div>
    </div>
</div>
`;

export type Context = {
   contextId: string,
    name: string,
    prompt: string
}

@template(html)
export class ContextModal extends KaCustomModal {

    public async show(context : Context=null): Promise<Context> {
        if (context == null) {
            context = {
                contextId: null,
                name: "",
                prompt: ""
            }
        }
        let scope = this.init({
            context,
            $fn: {
                close: () => this.resolve(null)
            }
        })
        await super.show();
        return context
    }

}
