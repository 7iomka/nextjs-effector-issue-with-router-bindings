import { useUnit } from 'effector-react'
import { $authenticatedUser } from '@app/entities/authenticated-user'
import { Text, Group, Button, createStyles } from '@mantine/core';
import { FileWithPath, IMAGE_MIME_TYPE, Dropzone as MantineDropzone } from '@mantine/dropzone';
import { $isDropzoneDisabled, $maxFileSizeMB, dropRejected, dropTriggered } from './model';
import { useCallback, useRef } from 'react';

const useMediaDropzoneStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    marginBottom: 30,
  },

  dropzone: {
    borderWidth: 1,
    paddingBottom: 50,
  },

  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[7],
  },

  control: {
    position: 'absolute',
    width: 250,
    left: 'calc(50% - 125px)',
    bottom: -20,
  },
}));

export function HomePage() {
  const user = useUnit($authenticatedUser)
  const [onDrop, onReject, maxFileSizeMB, isDisabled] = useUnit([
    dropTriggered,
    dropRejected,
    $maxFileSizeMB,
    $isDropzoneDisabled,
  ])

  const { classes, theme, cx } = useMediaDropzoneStyles();
  const openRefWorking = useRef<() => void>(null);
  const openRef = useRef<() => void>(null);

  const handleDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const files = acceptedFiles.map((file) => {
      return new File([file], file.name, { type: file.type });
    });

    console.log({ files });

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    fetch(`http://localhost:3000/api-v1/storage/multipart-upload?folder=categories`, {
      method: 'POST',
      body: formData,
    })
      .then(async (response) => {
        const res = await response.json();
        console.log({ res });
        // обрабатываем ответ от сервера
      })
      .catch((error) => {
        console.log('error', error);
        // обрабатываем ошибку
      });
  }, []);

  return (
    <section>
      <h2 className="text-lg">Home</h2>
      <pre className="mt-3">User: {JSON.stringify(user, null, 2)}</pre>
      <h2 className="text-lg">Worinkg example</h2>
      <div className={cx(classes.wrapper)}>
        <MantineDropzone
          openRef={openRefWorking}
          multiple
          onDrop={handleDrop}
          onReject={onReject}
          disabled={isDisabled}
          className={classes.dropzone}
          radius="md"
          accept={IMAGE_MIME_TYPE}
          maxSize={maxFileSizeMB * 1024 ** 2}
        >
          <div style={{ pointerEvents: 'none' }}>
            <Group position="center">
              <MantineDropzone.Accept>
                ^
              </MantineDropzone.Accept>
              <MantineDropzone.Reject>
                x
              </MantineDropzone.Reject>
              <MantineDropzone.Idle>
                ^^
              </MantineDropzone.Idle>
            </Group>

            <Text align="center" weight={700} size="xl" mt="md">
              <MantineDropzone.Accept>Перетащите файлы сюда</MantineDropzone.Accept>
              <MantineDropzone.Reject>Файлы до {maxFileSizeMB}мб</MantineDropzone.Reject>
              <MantineDropzone.Idle>Загрузить</MantineDropzone.Idle>
            </Text>
            <Text
              align="center"
              size="md"
              mt="xs"
              color={theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[7]}
            >
              Перетащите файлы сюда. Разерешены только файлы размером до {maxFileSizeMB}мб.
            </Text>
          </div>
        </MantineDropzone>

        <Button
          variant="filled"
          className={classes.control}
          size="md"
          radius="xl"
          onClick={() => openRefWorking.current?.()}
        >
          Выбрать файлы
        </Button>
      </div>

      <h2 className="text-lg mt-20">NOT Worinkg example</h2>
      <div className={cx(classes.wrapper)}>
        <MantineDropzone
          openRef={openRef}
          multiple
          onDrop={onDrop}
          onReject={onReject}
          disabled={isDisabled}
          className={classes.dropzone}
          radius="md"
          accept={IMAGE_MIME_TYPE}
          maxSize={maxFileSizeMB * 1024 ** 2}
        >
          <div style={{ pointerEvents: 'none' }}>
            <Group position="center">
              <MantineDropzone.Accept>
                ^
              </MantineDropzone.Accept>
              <MantineDropzone.Reject>
                x
              </MantineDropzone.Reject>
              <MantineDropzone.Idle>
                ^^
              </MantineDropzone.Idle>
            </Group>

            <Text align="center" weight={700} size="xl" mt="md">
              <MantineDropzone.Accept>Перетащите файлы сюда</MantineDropzone.Accept>
              <MantineDropzone.Reject>Файлы до {maxFileSizeMB}мб</MantineDropzone.Reject>
              <MantineDropzone.Idle>Загрузить</MantineDropzone.Idle>
            </Text>
            <Text
              align="center"
              size="md"
              mt="xs"
              color={theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[7]}
            >
              Перетащите файлы сюда. Разерешены только файлы размером до {maxFileSizeMB}мб.
            </Text>
          </div>
        </MantineDropzone>

        <Button
          variant="filled"
          className={classes.control}
          size="md"
          radius="xl"
          onClick={() => openRef.current?.()}
        >
          Выбрать файлы
        </Button>
      </div>
    </section>
  )
}
