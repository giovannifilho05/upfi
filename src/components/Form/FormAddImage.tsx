import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { FieldError, RegisterOptions, useForm, ValidationValue } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}
interface FormValidationsProps {
  image: RegisterOptions;
  title: RegisterOptions;
  description: RegisterOptions;
}

interface NewImageFormData {
  image: FileList;
  title: string;
  description: string;
}
interface NewImageData {
  title: string;
  description: string;
  url: string;
}

const MAX_SIZE_IMAGE_MB = 10
const MAX_SIZE_IMAGE = MAX_SIZE_IMAGE_MB / Math.pow(2, -20)     //10MB

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (data: NewImageData) => {
      const response = await api.post('api/images', data)

      return response.data.user
    }, {
    onSuccess: () => {
      queryClient.invalidateQueries('images')
    }
  }
  );

  const formValidations: FormValidationsProps = {
    image: {
      required: 'Image is required',
      validate: {
        lessThan10MB: (v) => {
          const [image] = v

          if (image.size > MAX_SIZE_IMAGE) {
            return `O arquivo deve ser menor que ${MAX_SIZE_IMAGE_MB}MB`
          }
          return true
        },

        acceptedFormats: (v) => {
          const [image] = v
          const regEx = /image\/(gif|png|jpeg)/g

          if (!regEx.test(image.type)) {
            return 'Somente são aceitos arquivos PNG, JPEG e GIF'
          }

          return true
        },
      },
    },
    title: {
      required: 'Título obrigatório',
      minLength: {
        value: 2,
        message: 'Mínimo de 2 caracteres'
      },
      maxLength: {
        value: 20,
        message: 'Máximo de 20 caracteres'
      },
    },
    description: {
      required: 'Descrição obrigatória',
      maxLength: {
        value: 65,
        message: 'Máximo de 65 caracteres'
      },
    },
  };

  const onSubmit = async (data: NewImageFormData): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description: 'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        })

        return
      }

      mutation.mutateAsync({
        ...data,
        url: imageUrl
      })

      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })

    } catch (event) {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })

    } finally {
      reset({ image: '', title: null, description: null})
      
      setImageUrl('')
      setLocalImageUrl('')

      closeModal()
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={(errors.image as unknown) as FieldError}

          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={(errors.title as unknown) as FieldError}
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={(errors.description as unknown) as FieldError}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
