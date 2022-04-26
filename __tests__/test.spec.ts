import fastify from 'fastify'
import { plugin as dbPlugin } from '../src/database'
import { routes } from '../src/routes'

describe('GET /popular-recipes', function () {
  /* Run "npm run seed-small-data" before running this test */
  it('return popular recipes from small dataset', async () => {
    // app instance
    const app = fastify({
      ajv: {
        customOptions: {
          removeAdditional: true,
          useDefaults: true,
          nullable: true,
        },
        plugins: [],
      },
    })
    app.register(dbPlugin)
    app.register(routes, { prefix: '/api' })
    process.env.DB_HOST = 'localhost'
    process.env.DB_USERNAME = 'recipest_docker'
    process.env.DB_PASSWORD = 'recipest_docker'
    await app.ready()

    // test route
    const res = await app.inject({
      method: 'GET',
      url: '/api/popular-recipes',
    })

    const recipes = JSON.parse(res.body)
    expect(res.statusCode).toBe(200)
    expect(recipes).toHaveLength(3)
    expect(recipes[0]).toMatchObject({
      id: '3',
      mainIngredient: 'crocodilia',
      averageRating: '9.0',
    })
    expect(recipes[1]).toMatchObject({
      id: '2',
      mainIngredient: 'fish',
      averageRating: '9.0',
    })
    expect(recipes[2]).toMatchObject({
      id: '4',
      mainIngredient: 'rabbit',
      averageRating: '9.5',
    })

    await app.close()
  })
})
