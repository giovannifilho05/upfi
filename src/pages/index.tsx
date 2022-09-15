import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { Card, CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

async function fetchImages({ pageParam = null }) {
  const response = await api.get('/api/images', {
    params: {
      after: pageParam
    }
  })

  return response.data
}

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: (response) => {
      return response.after
    },
    cacheTime: 20000000000
  });

  console.log(data)

  const formattedData: Card[] = useMemo(() => {
    if (!data) return

    const { pages } = data

    return pages
      .map(page => page.data)
      .flat()
  }, [data]);


  if (isLoading) {
    return <Loading />
  } else if (isError) {
    return <Error />
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {
          hasNextPage && (
            <Button
              mt={6}
              onClick={() => { fetchNextPage() }}
            >
              {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
            </Button>)
        }
      </Box>
    </>
  );
}
