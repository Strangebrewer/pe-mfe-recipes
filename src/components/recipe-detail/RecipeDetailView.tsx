import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteRecipe } from '../../gql/hooks/recipeHooks';
import type { Recipe } from '../../types/recipe';
import Section from './Section';
import { Button, GhostButton } from '@bka-stuff/pe-mfe-utils';

type Props = {
  recipe: Recipe;
  enterEdit: () => void;
};

const RecipeDetailView: FC<Props> = ({ recipe, enterEdit }) => {
  const navigate = useNavigate();
  const { mutate, isPending } = useDeleteRecipe();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    mutate(recipe.id, {
      onSuccess: () => navigate('/recipes'),
    });
  };

  return (
    <>
      <div className="tw:flex tw:items-start tw:gap-4 tw:mb-6">
        <h1 className="tw:text-2xl tw:font-bold tw:text-[#f0e6ff] tw:flex-1">{recipe.name}</h1>

        <div className="tw:flex tw:items-center tw:gap-2 tw:shrink-0">
          {confirmDelete ? (
            <>
              <span className="tw:text-sm tw:text-[#c4b5fd]">Delete?</span>
              <Button
                onClick={handleDelete}
                text={isPending ? 'Deleting...' : 'Yes'}
                color="red"
                disabled={isPending}
                last
              />
              <Button onClick={() => setConfirmDelete(false)} text="No" color="blue" last />
            </>
          ) : (
            <>
              <GhostButton onClick={enterEdit} text="Edit" color="blue" last />
              <Button onClick={() => setConfirmDelete(true)} text="Delete" color="red" last />
            </>
          )}
        </div>
      </div>

      {recipe.description && (
        <Section label="Description">
          <p className="tw:text-[#f0e6ff]">{recipe.description}</p>
        </Section>
      )}

      {(recipe.prepTime != null || recipe.cookTime != null || recipe.servings != null) && (
        <div className="tw:flex tw:gap-8 tw:mb-6">
          {recipe.prepTime != null && (
            <div>
              <div className="tw:text-xs tw:text-[#c4b5fd] tw:mb-0.5">Prep</div>
              <div className="tw:text-sm tw:font-medium tw:text-[#f0e6ff]">
                {recipe.prepTime} min
              </div>
            </div>
          )}
          {recipe.cookTime != null && (
            <div>
              <div className="tw:text-xs tw:text-[#c4b5fd] tw:mb-0.5">Cook</div>
              <div className="tw:text-sm tw:font-medium tw:text-[#f0e6ff]">
                {recipe.cookTime} min
              </div>
            </div>
          )}
          {recipe.servings != null && (
            <div>
              <div className="tw:text-xs tw:text-[#c4b5fd] tw:mb-0.5">Servings</div>
              <div className="tw:text-sm tw:font-medium tw:text-[#f0e6ff]">{recipe.servings}</div>
            </div>
          )}
        </div>
      )}

      {!!recipe.tags?.length && (
        <Section label="Tags">
          <div className="tw:flex tw:gap-1 tw:flex-wrap">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className="tw:text-sm tw:bg-[rgba(26,15,46,0.8)] tw:text-[#00E5FF] tw:border tw:border-[rgba(0,229,255,0.3)] tw:rounded-full tw:px-3 tw:py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </Section>
      )}

      <Section label="Ingredients">
        <ul className="tw:space-y-1">
          {recipe.ingredients.map((ing, i) => (
            <li key={i} className="tw:text-[#f0e6ff] tw:text-sm tw:flex tw:gap-2">
              <span className="tw:text-[#51CB20] tw:shrink-0">·</span>
              {ing}
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Directions">
        <ol className="tw:space-y-3">
          {recipe.directions.map((step, i) => (
            <li key={i} className="tw:text-[#f0e6ff] tw:text-sm tw:flex tw:gap-3">
              <span className="tw:text-[#00E5FF] tw:font-medium tw:shrink-0 tw:w-5 tw:text-right">
                {i + 1}.
              </span>
              {step}
            </li>
          ))}
        </ol>
      </Section>

      {recipe.macros && (
        <Section label="Macros">
          <p className="tw:text-[#f0e6ff] tw:text-sm tw:whitespace-pre-wrap">{recipe.macros}</p>
        </Section>
      )}

      {recipe.imageUrl && (
        <Section label="Image URL">
          <a
            href={recipe.imageUrl}
            target="_blank"
            rel="noreferrer"
            className="tw:text-[#00E5FF] tw:hover:underline tw:text-sm tw:break-all"
          >
            {recipe.imageUrl}
          </a>
        </Section>
      )}
    </>
  );
};

export default RecipeDetailView;
