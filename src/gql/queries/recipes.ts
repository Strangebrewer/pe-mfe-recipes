export const GET_RECIPES = `
  query GetRecipes {
    getRecipes {
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
    }
  }
`;
