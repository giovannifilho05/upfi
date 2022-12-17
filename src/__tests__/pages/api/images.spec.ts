import { NextApiRequest, NextApiResponse } from 'next';
import handler, { client } from '../../../pages/api/images';

describe('api/images', () => {
  let req, json, res

  beforeAll(() => {
    req = {
      body: {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Duck_wings_outstretched.jpg/1200px-Duck_wings_outstretched.jpg',
        title: 'Duck',
        description: 'Duck duck go'
      }
    }

    json = jest.fn()

    res = {
      status: jest.fn(() => ({
        json
      })),
      json
    }
  })

  it('should be able to post images', async () => {
    req.method = 'POST'

    const spy = jest.spyOn(client, 'query').mockImplementation(async () => { })


    await handler(req as NextApiRequest, res as unknown as NextApiResponse);

    expect(spy).toHaveBeenCalled();
    expect(json.mock.calls[0][0]).toEqual({ success: true });
  })

  it('should not be able to post images', async () => {
    req.method = 'POST'

    const spy = jest.spyOn(client, 'query').mockImplementation(async () => (Promise.reject({
      message: 'Error'
    })))

    await handler(req as NextApiRequest, res as unknown as NextApiResponse);

    expect(spy).toHaveBeenCalled();
    expect(json.mock.calls[0][0]).toMatchObject({ error: `Sorry something Happened! Error` });
  })

  it('should be able to get images', async () => {
    req = {
      ...req,
      method: 'GET',
      query: {}
    }

    const spy = jest.spyOn(client, 'query').mockImplementation(async () => (Promise.resolve({
      data: [{
        ref: { id: 349707186061967434 },
        ts: 1669765611630000,
        data: {
          title: "Rio de Janeiro",
          description: "O Rio de Janeiro é uma grande cidade brasileira...",
          url: "https://i.ibb.co/yBg0qnZ/rio-de-janeiro-capa2019-01.jpg"
        },
      }],
      after: null
    })))

    await handler(req as NextApiRequest, res as unknown as NextApiResponse);

    expect(spy).toHaveBeenCalled()
    expect(json.mock.calls[0][0]).toMatchObject({
      data: [{
        title: "Rio de Janeiro",
        description: "O Rio de Janeiro é uma grande cidade brasileira...",
        url: "https://i.ibb.co/yBg0qnZ/rio-de-janeiro-capa2019-01.jpg",
        ts: 1669765611630000,
        id: 349707186061967434
      }],
      after: null,
    });
  })

  it('should not be able to get images', async () => {
    req.method = 'GET'

    const spy = jest.spyOn(client, 'query').mockImplementation(async () => (Promise.reject({
      message: 'Error'
    })))

    await handler(req as NextApiRequest, res as unknown as NextApiResponse);

    expect(spy).toHaveBeenCalled();
    expect(json.mock.calls[0][0]).toMatchObject({ error: `Sorry something Happened! Error` });
  })
  
  it('should not be allowed', async () => {
    req.method = 'DELETE'

    await handler(req as NextApiRequest, res as unknown as NextApiResponse);

    expect(json.mock.calls[0][0]).toMatchObject({ error: `Method '${req.method}' Not Allowed` });
  })
})