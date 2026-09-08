import { createCustomElement } from "@angular/elements";
import { createApplication } from "@angular/platform-browser";
import { appConfig } from "./app.config";
import { AppComponent } from "./app/app.component";
import { ConstantConfig } from "./app/models/constant-config";

createApplication(appConfig)
.then((app) => {
    const mfeComponent = createCustomElement(AppComponent, {
        injector: app.injector
    });
    customElements.define(ConstantConfig.TAG, mfeComponent);
})
.catch((err) => console.error(err));
