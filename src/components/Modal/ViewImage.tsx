import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Link,
  ModalCloseButton,
  Image,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'6xl'} >
      <ModalOverlay />
      <ModalContent h='80vh' w="fit-content" bgColor="pGray.800">
        <ModalCloseButton />

        <ModalBody overflow='hidden' p={0}>
          <Image
            h="100%"
            maxH="600px"
            src={imgUrl}
          />
        </ModalBody>

        <ModalFooter justifyContent="flex-start" p={2}>
          <Link fontSize="small" href={imgUrl} isExternal>
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
