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
  mutation CreateRecipe($input: CreateRecipeInput!) {
    createRecipe(input: $input) {
      ${RECIPE_FIELDS}
    }
  }
`;

export const UPDATE_RECIPE = `
  mutation UpdateRecipe($id: String!, $input: UpdateRecipeInput!) {
    updateRecipe(id: $id, input: $input) {
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
