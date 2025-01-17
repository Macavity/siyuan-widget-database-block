interface IResGetNotebookConf {
    box: string;
    conf: NotebookConf;
    name: string;
}

interface IReslsNotebooks {
    notebooks: Notebook[];
}

interface IResUpload {
    errFiles: string[];
    succMap: { [key: string]: string };
}

interface IResdoOperations {
    doOperations: doOperation[];
    undoOperations: doOperation[] | null;
}

interface IResGetBlockKramdown {
    id: BlockId;
    kramdown: string;
}

interface IResGetChildBlock {
    id: BlockId;
    type: BlockType;
    subtype?: BlockSubType;
}

interface IResGetTemplates {
    content: string;
    path: string;
}

interface IResReadDir {
    isDir: boolean;
    isSymlink: boolean;
    name: string;
}

interface IResExportMdContent {
    hPath: string;
    content: string;
}

interface IResBootProgress {
    progress: number;
    details: string;
}

interface IResForwardProxy {
    body: string;
    contentType: string;
    elapsed: number;
    headers: { [key: string]: string };
    status: number;
    url: string;
}

interface IResExportResources {
    path: string;
}

interface AVKey {
    type: TAVCol;
    name: string;
    icon: string;
    id: string;
    options?: {
        name: string;
        color: string;
    };
}

interface AVValue {
    keyID: string;
    id: string;
    blockID: string;
    // eslint-disable-next-line
    type: any;
}

interface AVKeyAndValues {
    key: AVKey;
    values: AVValue[];
}

interface AttributeView {
    keyValues: AVKeyAndValues[];
    blockIDs: string[];
    avID: string;
    avName: string;
}
