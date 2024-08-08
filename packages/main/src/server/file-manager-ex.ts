import { RequestOptions } from "../../types";
import { readFileSync } from "fs";
import { FilesRequestUrl, getHeaders, makeServerRequest } from "./request";
import {
  FileMetadata,
  UploadFileResponse,
} from "../../types/server";
import { RpcTask } from "./constants";
import {
  GoogleGenerativeAIRequestInputError,
} from "../errors";

/**
 * @public
 */
export class ExtendedFileManager {
    constructor(
      public apiKey: string,
      private _requestOptions?: RequestOptions,
    ) {}

    async uploadFile(
        buffer: Buffer,
        fileMetadata: FileMetadata,
      ): Promise<UploadFileResponse> {
        const file = buffer;
        const url = new FilesRequestUrl(
          RpcTask.UPLOAD,
          this.apiKey,
          this._requestOptions,
        );
    
        const uploadHeaders = getHeaders(url);
        const boundary = generateBoundary();
        uploadHeaders.append("X-Goog-Upload-Protocol", "multipart");
        uploadHeaders.append(
          "Content-Type",
          `multipart/related; boundary=${boundary}`,
        );
    
        const uploadMetadata = getUploadMetadata(fileMetadata);
    
        // Multipart formatting code taken from @firebase/storage
        const metadataString = JSON.stringify({ file: uploadMetadata });
        const preBlobPart =
          "--" +
          boundary +
          "\r\n" +
          "Content-Type: application/json; charset=utf-8\r\n\r\n" +
          metadataString +
          "\r\n--" +
          boundary +
          "\r\n" +
          "Content-Type: " +
          fileMetadata.mimeType +
          "\r\n\r\n";
        const postBlobPart = "\r\n--" + boundary + "--";
        const blob = new Blob([preBlobPart, file, postBlobPart]);
    
        const response = await makeServerRequest(url, uploadHeaders, blob);
        return response.json();
      }
}


function generateBoundary(): string {
    let str = "";
    for (let i = 0; i < 2; i++) {
      str = str + Math.random().toString().slice(2);
    }
    return str;
}

export function getUploadMetadata(inputMetadata: FileMetadata): FileMetadata {
    if (!inputMetadata.mimeType) {
      throw new GoogleGenerativeAIRequestInputError("Must provide a mimeType.");
    }
    const uploadMetadata: FileMetadata = {
      mimeType: inputMetadata.mimeType,
      displayName: inputMetadata.displayName,
    };
  
    if (inputMetadata.name) {
      uploadMetadata.name = inputMetadata.name.includes("/")
        ? inputMetadata.name
        : `files/${inputMetadata.name}`;
    }
    return uploadMetadata;
  }