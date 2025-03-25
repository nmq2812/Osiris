import { EntityPropertySchema } from "./EntityProperty";
import { TitleLink } from "./TitleLink";

export abstract class Configs {
    static managerPath: string;
    static resourceUrl: string;
    static resourceKey: string;
    static createTitle: string;
    static updateTitle: string;
    static manageTitle: string;
    static manageTitleLinks: TitleLink[];
    protected static _rawProperties: EntityPropertySchema;
    static properties: EntityPropertySchema;
    static initialCreateUpdateFormValues: object;
    static createUpdateFormSchema: object;
}
