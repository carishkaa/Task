import _ from 'lodash'

export const recipeDtoOut = {
  type: 'object',
  required: ['id', 'name', 'mainIngredient'],
  additionalProperties: false,
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    mainIngredient: { type: 'string' },
    publishTime: { type: 'string', nullable: true },
    createTime: { type: 'string', nullable: true },
    averageRating: { type: 'string' },
  },
} as const
