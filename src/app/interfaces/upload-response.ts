export type TSuccessResponse = {
    ok: true;
    msg: string;
    nameFile: string;
};

export type TErrorResponse = {
    ok: false;
    msg: string;
};

export type TUploadResponse = TSuccessResponse | TErrorResponse;