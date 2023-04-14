import {KaCustomModal, template} from "@kasimirjs/embed";
import {textwrap} from "../functions";


const html = `
<div class="modal d-block" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><b>Preset [[ preset.presetId !== null ? 'bearbeiten' : 'neu anlegen']]</b> <span class="badge bg-primary">[[ preset.presetId ]] </span> </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" ka.on.click="$fn.close()" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label class="form-label">Preset-Name</label>
                    <input type="text" class="form-control" ka.bind="preset.presetName">
                </div>
                <textarea class="form-control" style="min-height: 200px; width: 100%" ka.bind="preset.prompt"></textarea>
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

export type Preset = {
    presetId: string,
    presetName: string,
    prompt: string
}

@template(html)
export class PresetModal extends KaCustomModal {

    public async show(preset : Preset=null): Promise<Preset> {
        if (preset == null) {
            preset = {
                presetId: null,
                presetName: "",
                prompt: ""
            }
        }
        let scope = this.init({
            preset,
            $fn: {
                close: () => this.resolve(null)
            }
        })
        await super.show();
        return preset
    }

}
