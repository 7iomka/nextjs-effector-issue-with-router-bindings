/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import { http } from './config';

/**
 * @title Glass Backend
 * @version 0.0.1
 * @contact
 *
 * The API for Glass Backend
 */

const routesConfig = http.createRoutesConfig({
  storage: {
    /**
     * No description
     *
     * @tags storage
     * @name UploadMultipartFile
     * @request POST:/api-v1/storage/multipart-upload
     */
    uploadMultipartFile: http.createRoute<
      {
        query: {
          /** Folder where files should be uploaded (start with categories) */
          folder: string;
        };
        data: {
          files?: File[];
        };
      },
      string[]
    >((dto) => ({
      url: `/api/multipart-upload`,
      method: 'POST',
      params: dto.query,
      data: dto.data,
      formData: true,
    })),
  },
});

export { routesConfig };
