import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gqlRequest } from '../../utils/graphqlClient';
import { CREATE_RECIPE, GET_RECIPES } from '../queries/recipes';
import type { Recipe } from '../../types/recipe';

export const useGetRecipes = () => {
  return useQuery({
    queryKey: ['get-recipes'],
    queryFn: () => gqlRequest(GET_RECIPES)
      .then((data) => data.getRecipes),
  });
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: Omit<Recipe, 'id'>) =>
      gqlRequest<{ createRecipe: Recipe }>(CREATE_RECIPE, variables)
        .then((data) => data.createRecipe),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['get-recipes'] }),
  });
};
