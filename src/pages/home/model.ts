import { EffectParams, attach, combine, createEffect, createEvent, createStore, sample } from 'effector'
import { api } from '@/shared/api';
import { FileRejection, FileWithPath } from '@mantine/dropzone';
import { debug } from 'patronum/debug';
import { ApiRequestConfig } from 'effector-http-api/dist/types';
import { RequireSingleField } from 'effector-http-api/dist/lib/typescript';

export const pageStarted = createEvent()
export const uploadMultipartFileFx = attach({ effect: api.storage.uploadMultipartFile });
export const showNotificationFx = createEffect<any, any>((v) => console.log(v));

// Dropzone
type UploadFxParams = EffectParams<typeof uploadMultipartFileFx>;
export const dropTriggered = createEvent<FileWithPath[]>();
export const dropRejected = createEvent<FileRejection[]>();
export const $uploadQuery = createStore({folder: '/default'});
export const $maxFileSizeMB = createStore(48);
export const $isDropzoneAvailable = createStore(true);
export const $isUploadPending = uploadMultipartFileFx.pending;
export const $isDropzoneDisabled = $isUploadPending;

const isObject = (source: unknown): source is Record<string, unknown> =>
  !!source && typeof source === 'object';

const formatNonBlobToFormDataProperty = (property: unknown) =>
  typeof property === 'object' && property !== null
    ? JSON.stringify(property)
    : `${property}`;

const isNeedFormatToFormData = <T>(
  config: ApiRequestConfig<T>
): config is RequireSingleField<ApiRequestConfig<T>, 'data'> =>
  !!(config.method !== 'GET' && config.formData && isObject(config.data));

const formatToFormData = <T extends Record<string, unknown>>(
  data: T
): FormData =>
  Object.keys(data || {}).reduce((formData, key) => {
    const property = data[key];

    const value =
      property instanceof Blob
        ? property
        : formatNonBlobToFormDataProperty(property);

    formData.append(key, value);

    return formData;
  }, new FormData());

sample({
  clock: dropTriggered,
  source: $uploadQuery,
  fn: ({ folder }, filesWithPath) => {
    const files = filesWithPath.map((file) => {
        return new File([file], file.name, { type: file.type });
    });

    const formData = new FormData();
        files.forEach((file) => {
        formData.append('files', file);
    });

    const result = {
        query: {
          folder,
        },
        data: formData,
      } as UploadFxParams

    const config = {
        url: `/api/multipart-upload`,
        method: 'POST',
        params: result.query,
        data: result.data,
        formData: true,
    }

    // There we have a problem - isNeedFormatToFormData has false positive because it checks only if object!
    if (isNeedFormatToFormData(config)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        const FormattedResultOfFormData = formatToFormData(config.data);
        console.log('FormattedResultOfFormData', FormattedResultOfFormData, 'files', FormattedResultOfFormData.getAll('files'));
        // config.data = formatToFormData(config.data);
    }



    console.log({ isObject: typeof formData === 'object', isFormData: formData instanceof FormData, isOriginalFormData: files instanceof FormData })

    console.log('FILES_IN_MODEL', files);

    return result;
  },
  target: uploadMultipartFileFx,
});

sample({
  clock: dropRejected,
  fn: (e) => {
    let message = 'Не удалось загрузить файл';
    if (e?.[0]?.errors?.[0]?.message?.includes('larger')) {
      message = 'Файл слишком большой';
    }

    return {
      color: 'danger',
      title: 'Ошибка загрузки',
      message,
    } as EffectParams<typeof showNotificationFx>;
  },
  target: showNotificationFx,
});

debug({
    uploadMultipartFileFx,
})