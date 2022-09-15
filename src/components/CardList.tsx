import { Box, Grid, GridItem, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

export interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedImageURL, setSelectedImageURL] = useState('')

  function viewImage(url: string) {
    setSelectedImageURL(url)
    onOpen()
  }
  return (
    <>
      <Grid templateColumns='repeat(3, 1fr)' gap="40px">
        {cards.map((cardData) => {
          return (
            <GridItem key={cardData.ts} >
              <Card data={cardData} viewImage={viewImage} />
            </GridItem>
          )
        })}
      </Grid>

      <ModalViewImage isOpen={isOpen} onClose={onClose} imgUrl={selectedImageURL}/>

    </>
  );
}
