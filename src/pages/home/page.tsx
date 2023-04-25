import { useUnit } from 'effector-react'
import { $authenticatedUser } from '@app/entities/authenticated-user'
import { Text, Group, Button, createStyles } from '@mantine/core';
import { IMAGE_MIME_TYPE, Dropzone as MantineDropzone } from '@mantine/dropzone';
import { $isDropzoneDisabled, $maxFileSizeMB, dropRejected, dropTriggered } from './model';
import { useRef } from 'react';

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
    const openRef = useRef<() => void>(null);

  return (
    <section>
      <h2 className="text-lg">Home</h2>
      <pre className="mt-3">User: {JSON.stringify(user, null, 2)}</pre>
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
