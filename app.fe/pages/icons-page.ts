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
        <div class="mb-3">
            <label class="form-label" for="inputGroupSelect01">Frage</label>
            <textarea class="form-control" style="font-family: monospace" rows="1" ka.bind="$scope.query"></textarea>
        </div>
        <button class="btn btn-primary mx-3 mb-3" type="button" ka.on.click="$fn.go()">Go</button>
        
        <div class="row">
            <div class="col-2" ka.for="let icon of icons">
                <div class="card">
                    <div class="card-body">
                        <p ka.if="icon.indexOf('fa') !== -1" class="text-center"><i ka.attr.class="'fa-solid fa fas ' + icon" style="font-size: 100px"></i></p>
                        <p ka.if="icon.indexOf('bi') !== -1" class="text-center"><i ka.attr.class="'bi ' + icon" style="font-size: 100px"></i></p>
                        <p ka.if="icon.indexOf('fi') !== -1" class="text-center"><i ka.attr.class="'fi ' + icon" style="font-size: 100px"></i></p>
                    </div>
                    <div class="card-footer">
                        <p>[[icon]]</p>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css">
    <link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.9.96/css/materialdesignicons.min.css"
          rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.2/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css">
</div>


`

@customElement("icons-page")
@route("icons", "/static/{subscription_id}/icons")
@template(html)
class IconsPage extends KaCustomElement {

    constructor(public route : CurRoute) {
        super();
        let scope = this.init({
            query: "",
            answer: "",
            icons: [],
            $fn: {

                go: async () => {
                    scope.answer = "Bitte warten...";
                    let result = await api_call(API.autocomplete_POST, {type: "iconRequest"}, {query: scope.query});
                    console.log(result);
                    //scope.answer = result.result.trim()
                    scope.icons = result.result;
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
