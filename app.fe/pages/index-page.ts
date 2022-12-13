import {customElement, ka_sleep, KaCustomElement, KaHtmlElement, template} from "@kasimirjs/embed";
import {api_call, href, route, router} from "@kasimirjs/app";
import {currentRoute} from "@kasimirjs/app";
import {CurRoute} from "@kasimirjs/app";
import {API} from "../_routes";

// language=html
let html = `
        
<div class="container-xxl">
    <div class="row">
        <h2>Bitte Thema wählen:</h2>
        <div class="input-group mb-3">
            <label class="input-group-text" for="inputGroupSelect01">Vorlage</label>
            <select class="form-select" ka.on.change="$fn.vorlageWechseln()" ka.options="vorlagen" ka.bind="$scope.vorlage">
            </select>
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
            <label class="input-group-text" for="inputGroupSelect01">Anzahl Tokens</label>
            <select class="form-select" value="include" ka.options="[25, 50, 150, 250, 500, 750, 1000, 2500, 5000]" ka.bind="$scope.max_tokens">
            </select>
            <button class="btn btn-primary" ka.on.click="$fn.go()">Go</button>
        </div>
        <div class=" mb-3">
            <label class="form-label">Antwort</label>
            <textarea class="form-control" style="font-family: monospace" ka.prop.rows="$fn.getRows()" readonly ka.bind="$scope.answer"></textarea>
        </div>
    </div>
    
</div>


`

@customElement("index-page")
@route("gallery", "/static/{subscription_id}")
@template(html)
class IndexPage extends KaCustomElement {

    constructor(public route : CurRoute) {
        super();
        let scope = this.init({
            question: "",
            vorlagen: [
                "Schreibe einen Werbetext über ",
                "Schreibe einen SEO Text für die Schlagworte ",
                "Schreibe einen Werbetext warum XXX so wichtig ist."
            ],
            vorlage: "",
            max_tokens: 50,
            best_of: 1,
            answer: "",
            $fn: {
                vorlageWechseln: async () => {
                    await ka_sleep(1);
                    scope.question = scope.vorlage
                },
                go: async () => {
                    scope.answer = "Bitte warten...";
                    let result = await api_call(API.text_POST, {}, {question: scope.question, max_tokens: scope.max_tokens, best_of: scope.best_of});
                    console.log(result);
                    scope.answer = result.text.trim()
                },
                getRows: () => scope.answer.split("\n").length + 3
            }
        })
    }

    async connectedCallback(): Promise<void> {


        let subId = currentRoute.route_params["subscription_id"];

        super.connectedCallback();
        this.scope.render();

    }


    // language=html

}
