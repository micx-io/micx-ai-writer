import {customElement, ka_sleep, KaCustomElement, KaHtmlElement, template} from "@kasimirjs/embed";
import {api_call, href, route, router} from "@kasimirjs/app";
import {currentRoute} from "@kasimirjs/app";
import {CurRoute} from "@kasimirjs/app";
import {API} from "../_routes";
import {Preset, PresetModal} from "../modal/preset-modal";
import {PromptModal} from "../modal/prompt-modal";



// language=html
let html = `
        
    
    
<div class="container-xxl">
    <div class="row">
        <h2>Bitte Thema wählen:</h2>
        <div class="input-group mb-3">
            <label class="input-group-text" for="inputGroupSelect01">Vorlage</label>
            <select class="form-select" ka.on.change="$fn.vorlageWechseln()" ka.options="presets.map((preset) => {return {value: preset.presetId, text: preset.presetName}})" ka.bind="$scope.selectedPresetId">
            </select>
            <button class="btn btn-outline-secondary" ka.on.click="$fn.editPreset()">Edit</button>
            <button class="btn btn-outline-secondary" ka.on.click="$fn.newPreset()">New</button>
        </div>
        <div class="mb-3">
            <label class="form-label" for="inputGroupSelect01">Frage</label>
            <textarea class="form-control" style="font-family: monospace" rows="8" ka.bind="$scope.question"></textarea>
        </div>
         <div class="input-group mb-3">
            <label class="input-group-text" for="inputGroupSelect01">Best Of</label>
            <select class="form-select" value="include" ka.options="[1,2,3]" ka.bind="$scope.best_of">
            </select>
        </div>
        <div class="input-group mb-3">
            <label class="input-group-text" for="inputGroupSelect01">Translate</label>
            <select class="form-select" value="include" ka.options="[0, 1]" ka.bind="$scope.translate">
            </select>
        </div>
        <div class="input-group mb-3">
            <label class="input-group-text" for="inputGroupSelect01">Anzahl Tokens</label>
            <select class="form-select" value="include" ka.options="[25, 50, 150, 250, 500, 750, 1000, 2500, 3500, 5000]" ka.bind="$scope.max_tokens">
            </select>
            <button class="btn btn-outline-secondary" ka.on.click="$fn.go(true)">See prompt</button>
            <button class="btn btn-primary" ka.on.click="$fn.go()">Go</button>
        </div>
        <div class=" mb-3">
            <label class="form-label">Antwort</label>
            <textarea class="form-control" style="font-family: monospace" ka.prop.rows="$fn.getRows()" readonly ka.bind="$scope.answer"></textarea>
        </div>
    </div>
    
</div>
`

const heute = new Date();
const wochentag = new Intl.DateTimeFormat('de-DE', { weekday: 'long' }).format(heute);
const deutschesDatum = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(heute);
const promptMap = {

    // Der aktuelle Wochentag
    "wochentag": wochentag,

    // Datum in form 01.03.2023
    "datum": deutschesDatum,
}


@customElement("index-page")
@route("gallery", "/static/{subscription_id}")
@template(html)
class IndexPage extends KaCustomElement {




    constructor(public route : CurRoute) {
        super();
        let scope = this.init({
            question: "",
            presets: [],
            selectedPresetId: null,
            max_tokens: 3500,
            best_of: 1,
            translate: 0,
            answer: "",
            $fn: {
                reloadPresets: async () => {
                    scope.presets = await api_call(API.preset_list_GET, {});
                },

                newPreset: async () => {
                    let preset = await (new PresetModal()).show(null)
                    await api_call(API.preset_save_POST, {}, preset);
                    await scope.$fn.reloadPresets();
                },

                getSelectedPreset: () : Preset => {
                    return scope.presets.find(p => p.presetId == scope.selectedPresetId)
                },
                editPreset: async () => {
                    let preset = await (new PresetModal()).show(scope.$fn.getSelectedPreset())
                    await api_call(API.preset_save_POST, {}, preset);
                    await scope.$fn.reloadPresets();
                },

                vorlageWechseln: async () => {
                    await ka_sleep(1);
                },
                go: async (dialog : boolean=false) => {

                    let prompt = scope.$fn.getSelectedPreset().prompt
                    prompt = prompt.replace(/%(.+?)%/gim, (match, p1) => {
                        return promptMap[p1] ?? alert("Unbekanntes Prompt: " + p1)
                    });

                    if (dialog) {
                        (new PromptModal()).show(prompt + "\n\n" + scope.question)
                        return;
                    }

                    scope.answer = "Bitte warten...";
                    let result = await api_call(API.text_POST, {}, {
                        prompt: prompt,
                        question: scope.question,
                        max_tokens: scope.max_tokens,
                        best_of: scope.best_of,
                        translate: scope.translate
                    });
                    console.log(result);
                    scope.answer = result.text.trim()
                },
                getRows: () => scope.answer.split("\n").length + 3
            }
        })
        scope.$fn.reloadPresets();
    }

    async connectedCallback(): Promise<void> {


        let subId = currentRoute.route_params["subscription_id"];

        super.connectedCallback();
        this.scope.render();

    }


    // language=html

}
