import {
    createHttp
} from 'effector-http-api'
import axios from 'axios';

const instance = axios.create()
const http = createHttp(instance);

const routesConfig = http.createRoutesConfig({
    storage: {
        /**
         * No description
         *
         * @tags storage
         * @name UploadMultipartFile
         * @request POST:/api-v1/storage/multipart-upload
         */
        uploadMultipartFile: http.createRoute<{
            query: {
                /** Folder where files should be uploaded (start with categories) */
                folder: string;
            };
            data: {
                files ? : File[];
            };
        }, string[]>
        ((dto) => ({
            url: `/api/multipart-upload`,
            method: 'POST',
            params: dto.query,
            data: dto.data,
            formData: true,
        })),
    },
});

const api = routesConfig.build();

export {
    api
}