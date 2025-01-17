import {TAVCol} from "siyuan";

export class AttributeRow {
    constructor(
        public id: string|null,
        public name: string,
        public type: TAVCol,
        public content: string,
        public icon: string
    ){}
}

export class BuiltInAttributeRow {
    constructor(
        public name: string,
        public content: string,
    ){}
}