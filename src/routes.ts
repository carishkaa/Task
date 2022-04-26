import { FastifyPluginAsync } from 'fastify'

export const routes: FastifyPluginAsync = async (app) => {
  app.get('/popular-recipes', async () => {
    const popularRecipes = await app.db.raw(
      `
      -- show users' fish reviews count for each review
      WITH revrec AS 
      (
        SELECT rev.id as review_id, rev.recipe_id, rev.rating_value, SUM(CASE WHEN rec.main_ingredient = 'fish' THEN 1 ELSE 0 END) OVER (PARTITION BY rev.user_id) AS user_fish_count
        FROM reviews AS rev 
        INNER JOIN recipes AS rec ON rev.recipe_id = rec.id
      )
  
      SELECT id, name, main_ingredient, publish_time, create_time, average_rating
      FROM (
        -- count average raiting of each recipe
        SELECT recipe_id, ROUND(AVG(rating_value),1) AS average_rating
        FROM revrec 
        WHERE user_fish_count > 0   -- only users with fish reviews
        GROUP BY recipe_id
      ) AS recipe_raiting 
      INNER JOIN recipes as rec ON recipe_raiting.recipe_id = rec.id
      
      WHERE recipe_raiting.average_rating > 8.0
      ORDER BY COALESCE(rec.publish_time, rec.create_time) DESC
      LIMIT 20`
    )

    return popularRecipes.rows
  })
}
