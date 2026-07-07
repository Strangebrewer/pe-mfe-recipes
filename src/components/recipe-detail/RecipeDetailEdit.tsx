import { useUpdateRecipe } from '../../gql/hooks/recipeHooks';
import type { Recipe } from '../../types/recipe';
import { Button, GhostButton, Input, ListInput, Textarea } from '@bka-stuff/pe-mfe-utils';
import Section from './Section';
import { FC } from 'react';

type Props = {
  draft: Recipe | null;
  exitEdit: () => void;
  patch: (fields: Partial<Recipe>) => void;
};

const RecipeDetailEdit: FC<Props> = ({ draft, exitEdit, patch }) => {
  const updateRecipe = useUpdateRecipe();

  const save = () => {
    if (!draft) return;
    updateRecipe.mutate(draft, {
      onSuccess: () => {
        exitEdit();
      },
    });
  };

  return (
    <>
      <div className="tw:flex tw:items-start tw:gap-4 tw:mb-6">
        <Input value={draft?.name ?? ''} onChange={(e) => patch({ name: e.target.value })} full />

        <div className="tw:flex tw:items-center tw:gap-2 tw:shrink-0">
          <GhostButton onClick={exitEdit} color="red" text="Cancel" last />
          <Button
            onClick={save}
            text={updateRecipe.isPending ? 'Saving...' : 'Save'}
            disabled={updateRecipe.isPending}
            color="purple"
            last
          />
        </div>
      </div>

      <Section label="Description">
        <Textarea
          value={draft?.description ?? ''}
          onChange={(e) => patch({ description: e.target.value || undefined })}
          rows={2}
          placeholder="Description"
          full
        />
      </Section>

      <div className="tw:flex tw:justify-between tw:mb-6">
        <div>
          <p className="tw:text-xs tw:text-[#c4b5fd] tw:mb-1">Prep</p>
          <Input
            type="number"
            min="0"
            value={draft?.prepTime?.toString() ?? ''}
            onChange={(e) =>
              patch({ prepTime: e.target.value ? Number(e.target.value) : undefined })
            }
          />
        </div>
        <div>
          <p className="tw:text-xs tw:text-[#c4b5fd] tw:mb-1">Cook</p>
          <Input
            type="number"
            min="0"
            value={draft?.cookTime?.toString() ?? ''}
            onChange={(e) =>
              patch({ cookTime: e.target.value ? Number(e.target.value) : undefined })
            }
          />
        </div>
        <div>
          <p className="tw:text-xs tw:text-[#c4b5fd] tw:mb-1">Servings</p>
          <Input
            type="number"
            min="0"
            value={draft?.servings?.toString() ?? ''}
            onChange={(e) =>
              patch({ servings: e.target.value ? Number(e.target.value) : undefined })
            }
          />
        </div>
      </div>

      <Section label="Tags">
        <ListInput
          items={draft?.tags ?? []}
          onChange={(tags) => patch({ tags })}
          placeholder="Type a tag and press Enter"
        />
      </Section>

      <Section label="Ingredients">
        <ListInput
          items={draft?.ingredients ?? []}
          onChange={(ingredients) => patch({ ingredients })}
          placeholder="Type an ingredient and press Enter"
        />
      </Section>

      <Section label="Directions">
        <ListInput
          items={draft?.directions ?? []}
          onChange={(directions) => patch({ directions })}
          placeholder="Type a step and press Enter"
        />
      </Section>

      <Section label="Macros">
        <Textarea
          value={draft?.macros ?? ''}
          onChange={(e) => patch({ macros: e.target.value || undefined })}
          rows={2}
        />
      </Section>

      <Section label="Image URL">
        <Input
          value={draft?.imageUrl ?? ''}
          onChange={(e) => patch({ imageUrl: e.target.value || undefined })}
        />
      </Section>

      {updateRecipe.isError && (
        <p className="tw:text-[#e22c5a] tw:text-sm tw:mt-2">Failed to save changes.</p>
      )}
    </>
  );
};

export default RecipeDetailEdit;
