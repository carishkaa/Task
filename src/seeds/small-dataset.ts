import { knex } from 'knex'
import { animal, commerce, company, date, datatype, internet } from 'faker'

const userData = [...Array(5).keys()].map((i) => {
  return {
    id: i + 1,
    email: internet.email(),
  }
})

const recipeData = [
  {
    id: 1,
    name: `The ${commerce.productAdjective()} ${animal[
      'fish'
    ]()} with ${commerce.color()} ${company.bsNoun()}`,
    main_ingredient: 'fish',
    user_id: 1,
    publish_time: datatype.boolean() ? date.past(2) : null,
    create_time: date.past(1),
  },
  {
    id: 2,
    name: `The ${commerce.productAdjective()} ${animal[
      'fish'
    ]()} with ${commerce.color()} ${company.bsNoun()}`,
    main_ingredient: 'fish',
    user_id: 2,
    publish_time: null,
    create_time: '2022-03-21T14:27:00.350Z',
  },
  {
    id: 3,
    name: `The ${commerce.productAdjective()} ${animal[
      'crocodilia'
    ]()} with ${commerce.color()} ${company.bsNoun()}`,
    main_ingredient: 'crocodilia',
    user_id: 3,
    publish_time: null,
    create_time: '2022-03-30T04:28:35.556Z',
  },
  {
    id: 4,
    name: `The ${commerce.productAdjective()} ${animal[
      'rabbit'
    ]()} with ${commerce.color()} ${company.bsNoun()}`,
    main_ingredient: 'rabbit',
    user_id: 3,
    publish_time: '2021-05-22T17:33:11.310Z',
    create_time: date.past(1),
  },
  {
    id: 5,
    name: `The ${commerce.productAdjective()} ${animal[
      'dog'
    ]()} with ${commerce.color()} ${company.bsNoun()}`,
    main_ingredient: 'dog',
    user_id: 4,
    publish_time: datatype.boolean() ? date.past(2) : null,
    create_time: date.past(1),
  },
]

/**
 * test case:
 * user with id=1 doesn't review recipe with fish, doesn't count
 * recipe with id=1 has raiting=4.0, recipe with id=5 has raiting=6.0, other recipes has raiting more than 8.0
 */
const reviewData = [
  {
    user_id: 1,
    recipe_id: 3,
    rating_value: 9,
  },
  {
    user_id: 1,
    recipe_id: 4,
    rating_value: 9,
  },
  {
    user_id: 1,
    recipe_id: 5,
    rating_value: 9,
  },
  {
    user_id: 2,
    recipe_id: 4,
    rating_value: 9,
  },
  {
    user_id: 2,
    recipe_id: 1,
    rating_value: 2,
  },
  {
    user_id: 2,
    recipe_id: 2,
    rating_value: 8,
  },
  {
    user_id: 3,
    recipe_id: 3,
    rating_value: 8,
  },
  {
    user_id: 3,
    recipe_id: 2,
    rating_value: 9,
  },
  {
    user_id: 4,
    recipe_id: 3,
    rating_value: 10,
  },
  {
    user_id: 4,
    recipe_id: 2,
    rating_value: 10,
  },
  {
    user_id: 5,
    recipe_id: 5,
    rating_value: 3,
  },
  {
    user_id: 5,
    recipe_id: 1,
    rating_value: 6,
  },
  {
    user_id: 5,
    recipe_id: 4,
    rating_value: 10,
  },
]

const client = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'recipest_docker',
    password: 'recipest_docker',
  },
})

// delete all records from db and insert new ones
;(async () => {
  await client('users').del()
  await client('recipes').del()
  await client('reviews').del()

  await client('users').insert(userData)
  await client('recipes').insert(recipeData)
  await client('reviews').insert(reviewData, 'id')

  console.log('DONE')
  client.destroy()
})()
