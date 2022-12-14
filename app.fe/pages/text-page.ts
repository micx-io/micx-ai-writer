import {customElement, ka_sleep, KaCustomElement, KaHtmlElement, template} from "@kasimirjs/embed";
import {api_call, href, route, router} from "@kasimirjs/app";
import {currentRoute} from "@kasimirjs/app";
import {CurRoute} from "@kasimirjs/app";
import {API} from "../_routes";
import {MarkdownModal} from "../modal/markdown-modal";
import {kaLocalStorage} from "../functions";

// language=html
let html = `
        
<div class="container-xxl">
    <div class="row">
        <h2>Bitte Thema wählen:</h2>
        <div class="mb-3">
            <label class="form-label" for="inputGroupSelect01">Context</label>
            <textarea class="form-control" style="font-family: monospace" rows="2" ka.bind="$scope.context"></textarea>
        </div>
        <div class="input-group mb-3">
            <label class="input-group-text" for="inputGroupSelect01">Textart</label>
            <input class="form-control" type="text" ka.bind="$scope.art">
            <button class="btn btn-primary" ka.on.click="$fn.loadGliederung()">Go</button>
        </div>
        <hr>
        <div ka.if="gliederung !== null"> 
            <h1 class="mt-3"><input type="text" class="w-100 " ka.bind="$scope.gliederung.titel"></h1>
            <button ka.on.click="$fn.loadArticleLead()">Lead laden</button>
            <button ka.on.click="$fn.loadMetaDescription()">Meta Description</button>
            <button ka.on.click="$fn.loadStockPhotos()">Stockphotos</button>
            <button ka.on.click="$fn.loadAll()">Alles laden</button>
            <p>Schlagworte für Stockfotos: <span ka.if="gliederung.stockphotos !== null" ka.textContent="gliederung.stockphotos"></span></p>
            <p ka.if="gliederung.metaDescription !== null">Meta-Description: <span  ka.textContent="gliederung.metaDescription"></span> ([[gliederung.metaDescription.length]] / 155)</p>
            <p ka.if="gliederung.lead !== null" ka.textContent="gliederung.lead"></p>
            <div ka.for="let curGliederung of gliederung.gliederung">
                <h2 class="mt-3"><input type="text" class="w-100 " ka.bind="curGliederung.titel"></h2>
                <button ka.on.click="$fn.loadQuestions(curGliederung)">Lade Fragen</button>
                <button ka.on.click="$fn.loadAbsatzLead(curGliederung)">Lade Lead</button>
                <p ka.if="curGliederung.lead !== null" ka.textContent="curGliederung.lead"></p>
                <div ka.for="let curQuestion of curGliederung.questions">
                    <div class="input-group mb-3">
                        <label class="input-group-text" for="inputGroupSelect01">Frage:</label>
                        <input class="form-control" type="text" ka.bind="curQuestion.question">
                        <button class="btn btn-primary" ka.on.click="$fn.loadAbsatz(curGliederung, curQuestion)">Absatz</button>
                    </div>
                    <p ka.if="curQuestion.text !== null" ka.textContent="curQuestion.text" class="form-control"></p>
                </div>
                 
                
            </div>
            
        </div>
        <div>
            <button ka.on.click="$fn.getMarkdown()">Markdown anzeigen</button>
        </div>
    </div>
    
</div>


`

@customElement("text-page")
@route("gallery", "/static/{subscription_id}/text")
@template(html)
class TextPage extends KaCustomElement {

    constructor(public route : CurRoute) {
        super();

        let history = kaLocalStorage.get("history", {context: "Schreibe SEO Texte. Benutze Sie statt Du. Kurze Texte.", art: "Blogartikel über Texterstellung im Beruf"});

        let scope = this.init({
            context: history.context,
            art: history.art,
            gliederung: null,

            $fn: {

                loadGliederung: async () => {
                    let result = await api_call(API.generate_gliederung_POST, {}, {art: scope.art, context: scope.context});

                    history.art = scope.art;
                    history.context = scope.context;

                    let gliederung = [];
                    result.gliederung.forEach((e) => gliederung.push({
                        titel: e,
                        lead: null,
                        questions: []
                    }))

                    scope.gliederung = {
                        titel: result.titel,
                        lead: null,
                        stockphotos: null,
                        metaDescription: null,
                        gliederung: gliederung,
                    };

                },

                getMarkdown: async() => {
                    let markdown = "# " + scope.gliederung.titel
                    markdown += "\n\n" + scope.gliederung.lead
                    scope.gliederung.gliederung.forEach((g) => {
                        markdown += "\n\n## " + g.titel;
                        markdown += "\n\n" + g.lead;

                        g.questions.forEach((quest) => {
                            if (quest.text === null)
                                return;
                            markdown += "\n\n" + quest.text;
                        })
                    })
                    await (new MarkdownModal()).show(markdown);
                },

                loadAll: async () => {
                    scope.$fn.loadStockPhotos();
                    scope.$fn.loadArticleLead();
                    scope.$fn.loadMetaDescription();
                    for (let g of scope.gliederung.gliederung) {
                        scope.$fn.loadAbsatzLead(g);
                        await scope.$fn.loadQuestions(g);
                    }
                },
                loadMetaDescription: async() => {
                    let result = await api_call(API.generate_article_metadescription_POST, {}, {
                        art: scope.art, context: scope.context, titel: scope.gliederung.titel
                    })
                    scope.gliederung.metaDescription = result.text;
                    scope.$tpl.render();
                },
                loadStockPhotos: async() => {
                    let result = await api_call(API.generate_article_stockphotos_POST, {}, {
                        art: scope.art, context: scope.context, titel: scope.gliederung.titel
                    })
                    scope.gliederung.stockphotos = result.text;
                    scope.$tpl.render();
                },
                loadArticleLead: async() => {
                    let result = await api_call(API.generate_article_lead_POST, {}, {
                        art: scope.art, context: scope.context, titel: scope.gliederung.titel
                    })
                    scope.gliederung.lead = result.text;
                    scope.$tpl.render();
                },

                loadQuestions: async(gliederung) => {
                    let result = await api_call(API.generate_questions_POST, {}, {
                        art: scope.art, context: scope.context, titel: scope.gliederung.titel, abschnitt: gliederung.titel
                    })
                    result.forEach((e) => gliederung.questions.push({
                       question: e,
                       text: null
                    }));

                    scope.$tpl.render();
                },
                loadAbsatzLead: async(gliederung) => {
                    let result = await api_call(API.generate_absatz_lead_POST, {}, {
                        art: scope.art, context: scope.context, titel: scope.gliederung.titel, abschnitt: gliederung.titel
                    })
                    gliederung.lead = result.text;
                    scope.$tpl.render();
                },
                loadAbsatz: async(gliederung, question) => {
                    let result = await api_call(API.generate_absatz_POST, {}, {
                        art: scope.art, context: scope.context, titel: scope.gliederung.titel, abschnitt: gliederung.titel,
                        question: question.question
                    })
                    question.text = result.text;
                    scope.$tpl.render();
                },
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
