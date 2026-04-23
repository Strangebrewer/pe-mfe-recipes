const RECIPE_FIELDS = `
  id
  name
  description
  ingredients
  directions
  prepTime
  cookTime
  servings
  tags
  imageUrl
  macros
`;

export const GET_RECIPES = `
  query GetRecipes {
    getRecipes {
      ${RECIPE_FIELDS}
    }
  }
`;

export const GET_RECIPE = `
  query GetRecipe($id: String!) {
    getRecipe(id: $id) {
      ${RECIPE_FIELDS}
    }
  }
`;

export const CREATE_RECIPE = `
  mutation CreateRecipe(
    $name: String!
    $ingredients: [String!]!
    $directions: [String!]!
    $description: String
    $prepTime: Float
    $cookTime: Float
    $servings: Float
    $tags: [String!]
    $imageUrl: String
    $macros: String
  ) {
    createRecipe(
      name: $name
      ingredients: $ingredients
      directions: $directions
      description: $description
      prepTime: $prepTime
      cookTime: $cookTime
      servings: $servings
      tags: $tags
      imageUrl: $imageUrl
      macros: $macros
    ) {
      ${RECIPE_FIELDS}
    }
  }
`;

export const UPDATE_RECIPE = `
  mutation UpdateRecipe(
    $id: String!
    $name: String
    $ingredients: [String!]
    $directions: [String!]
    $description: String
    $prepTime: Float
    $cookTime: Float
    $servings: Float
    $tags: [String!]
    $imageUrl: String
    $macros: String
  ) {
    updateRecipe(
      id: $id
      name: $name
      ingredients: $ingredients
      directions: $directions
      description: $description
      prepTime: $prepTime
      cookTime: $cookTime
      servings: $servings
      tags: $tags
      imageUrl: $imageUrl
      macros: $macros
    ) {
      ${RECIPE_FIELDS}
    }
  }
`;

export const DELETE_RECIPE = `
  mutation DeleteRecipe($id: String!) {
    deleteRecipe(id: $id) {
      deletedCount
    }
  }
`;
