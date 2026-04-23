import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gqlRequest } from '../../utils/graphqlClient';
import { CREATE_RECIPE, DELETE_RECIPE, GET_RECIPE, GET_RECIPES, UPDATE_RECIPE } from '../queries/recipes';
import type { Recipe } from '../../types/recipe';

export const useGetRecipes = () => {
  return useQuery({
    queryKey: ['get-recipes'],
    queryFn: () => gqlRequest<{ getRecipes: Recipe[] }>(GET_RECIPES).then((data) => data.getRecipes),
  });
};

export const useGetRecipe = (id: string) => {
  return useQuery({
    queryKey: ['get-recipe', id],
    queryFn: () => gqlRequest<{ getRecipe: Recipe }>(GET_RECIPE, { id }).then((data) => data.getRecipe),
    enabled: !!id,
  });
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: Omit<Recipe, 'id'>) =>
      gqlRequest<{ createRecipe: Recipe }>(CREATE_RECIPE, variables).then((data) => data.createRecipe),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['get-recipes'] }),
  });
};

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: Partial<Recipe> & { id: string }) =>
      gqlRequest<{ updateRecipe: Recipe }>(UPDATE_RECIPE, variables).then((data) => data.updateRecipe),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['get-recipes'] });
      queryClient.setQueryData(['get-recipe', data.id], data);
    },
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      gqlRequest<{ deleteRecipe: { deletedCount: number } }>(DELETE_RECIPE, { id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['get-recipes'] }),
  });
};
