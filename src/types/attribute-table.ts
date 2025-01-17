import {AttributeRow} from "@/types/attribute-row";

export class AttributeTable {
    constructor(
        public avId: string,
        public blockIds: string[],
        public avName: string,
        public attributes: AttributeRow[]
    ) {
    }
}