import { EffectParams, attach, combine, createEffect, createEvent, createStore, sample } from 'effector'
import { api } from '../shared/api';
import { FileRejection, FileWithPath } from '@mantine/dropzone';
import { debug } from 'patronum/debug';

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


sample({
  clock: dropTriggered,
  source: $uploadQuery,
  fn: ({ folder }, filesWithPath) => {
    const formData = new FormData();

    filesWithPath.forEach((file) => {
      formData.append('file', file, file.name);
    });

    const files = formData.getAll('file');

    console.log('FILES', files);

    return {
      query: {
        folder,
      },
      data: {
        files,
      },
    } as UploadFxParams;
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