import {customElement, ka_sleep, KaCustomElement, KaHtmlElement, template} from "@kasimirjs/embed";
import {api_call, href, route, router} from "@kasimirjs/app";
import {currentRoute} from "@kasimirjs/app";
import {CurRoute} from "@kasimirjs/app";
import {API} from "../_routes";
import {FileUpload} from "../elements/file-upload";

// language=html
let html = `
        
<div class="container-xxl">
    <div class="row">
        <h2>Scan Invoices</h2>
        <div class="mb-3">
            <div ka.become="elements.fileupload"></div>
        </div>
        
        <table class="table">
            <thead>
                    <th ka.for="let name of fields">[[name]]</th>
                    
            </thead>
            <tbody ka.for="let line of result">
               
                <tr >
                    <td ka.for="let key of fields">[[ line[key] ?? "--" ]]</td>

                </tr>
                <tr class="border-0">
                    <td ka.attr.colspan="fields.length">[[ line["description"] ?? "--" ]]</td>
                </tr>
             
               
            </tbody>
            
        </table>
    </div>
    
</div>


`

@customElement("invoice-page")
@route("gallery", "/static/{subscription_id}/invoice")
@template(html)
class TextPage extends KaCustomElement {

    constructor(public route : CurRoute) {
        super();


        let scope = this.init({
            fields: ["filename", "senderName", "senderVatNumber", "invoiceNumber", "customerNumber", "invoiceDate", "invoiceTotal",
                "invoiceNet", "invoiceVat", "invoiceVatPercentage", "invoiceCurrency", "classification"],

            result: [],

            elements: {
                fileupload: new FileUpload(async(file : File) => {
                    let curResult = {filename: file.name};
                    scope.result.push(curResult);
                    scope.render();

                    let formData = new FormData();
                    formData.append("file", file);
                    let ret = await fetch(
                        API.invoice_upload_POST.split("@")[1].replace("{subscription_id}",  currentRoute.route_params["subscription_id"]),
                        {
                            method: "POST",
                            body: formData
                        })

                    let json = null;
                    try {
                        json = await ret.json();
                        if (json.success !== true)
                            throw "error";
                    } catch (e) {
                        console.log(e);
                        return;
                    }

                    Object.keys(json.text).forEach(key => curResult[key] = json.text[key]);
                    scope.render();
                })
            },
            $fn: {


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
