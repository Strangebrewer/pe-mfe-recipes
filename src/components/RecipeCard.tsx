import { useNavigate } from 'react-router-dom';
import type { Recipe } from '../types/recipe';

type Props = {
  recipe: Recipe;
};

export default function RecipeCard({ recipe }: Props) {
  const navigate = useNavigate();

  const totalTime =
    recipe.prepTime != null && recipe.cookTime != null
      ? recipe.prepTime + recipe.cookTime
      : null;

  return (
    <div
      onClick={() => navigate(recipe.id)}
      className="tw:border tw:border-gray-200 tw:rounded-lg tw:p-4 tw:cursor-pointer tw:hover:border-blue-300 tw:hover:bg-blue-50 tw:transition-colors"
    >
      <div className="tw:flex tw:items-start tw:justify-between tw:gap-4">
        <div className="tw:flex-1 tw:min-w-0">
          <h3 className="tw:font-medium tw:text-gray-900">{recipe.name}</h3>
          {recipe.description && (
            <p className="tw:text-sm tw:text-gray-500 tw:mt-0.5 tw:line-clamp-2">
              {recipe.description}
            </p>
          )}
        </div>

        <div className="tw:flex tw:flex-col tw:items-end tw:gap-1 tw:shrink-0 tw:text-xs tw:text-gray-500">
          {totalTime != null && <span>{totalTime} min</span>}
          {totalTime == null && recipe.prepTime != null && (
            <span>Prep {recipe.prepTime} min</span>
          )}
          {totalTime == null && recipe.cookTime != null && (
            <span>Cook {recipe.cookTime} min</span>
          )}
          {recipe.servings != null && <span>{recipe.servings} servings</span>}
        </div>
      </div>

      {recipe.tags?.length ? (
        <div className="tw:flex tw:gap-1 tw:mt-2 tw:flex-wrap">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="tw:text-xs tw:bg-gray-100 tw:text-gray-600 tw:rounded-full tw:px-2 tw:py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
