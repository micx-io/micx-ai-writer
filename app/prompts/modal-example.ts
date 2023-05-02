import {KaCustomModal, template} from "@kasimirjs/embed";

/**
 * This is a modal example. Whitin the html template all attributes starting with ka. are interpreted as javascript-directives.
 * Whitin the scope you can use the following variables:
 * $scope: The scope object
 * $fn: The functions object
 * $ref: References to other elements (specified by ka.ref="'name'")
 *
 * The following attributes are defined:
 *    ka.on: Register event handlers for the specified events on an element.
 *     ka.use: Can only be used on KaUse elements. Calls the 'use' function on the element with the provided arguments.
 *     ka.scope: Sets the scope for the element. Must be an object.
 *     ka.stop: Stops the execution of further attribute handling.
 *     ka.debug: Logs debug information to the console.
 *     ka.ref: Assigns a reference to the element in the scope. Can be accessed using the provided name or $last.
 *     ka.classlist: Dynamically adds or removes classes based on the boolean values in the provided object.
 *     ka.style: Sets the style property values for the element either directly or using the provided object.
 *     ka.bindarray: Binds an array to an input element and handles changes to update the array accordingly.
 *     ka.bind: Binds a value to an input element and handles changes to update the bound value.
 *     ka.options: Populates a select element with options using the provided object or array.
 *     ka.attr: Sets or removes attributes on an element based on the provided object or directly using the specified attribute name and value.
 *     ka.prop: Sets the properties of an element either directly or using the provided object.
 *
 *  ka.if: Conditionally renders an element based on the provided boolean value.
 *  ka.for: Iterates over an array and renders the element for each item. (Example: ka.for="let item in items" or ka.for="let item of items")
 */

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


export interface DataType {
    // Define data type here
}

@template(html)
export class ClassName extends KaCustomModal {

    public async show(inputData: DataType): Promise<DataType> {
        // Initialize the scope. This is the same as in the template.
        let scope = this.init({
            inputData,
            $fn: {
                close: () => this.resolve(null)
            }
        })
        return super.show();
    }
}


/**
 * Example to call the modal:
 */
let data = await new ClassName().show({});


/**
 * Given this example, create a new class doing the following:
