import React, { useState } from 'react';
import ListInput from './ListInput';
import { useCreateRecipe } from '../gql/hooks/recipeHooks';

type Props = {
  onClose: () => void;
};

const inputCls =
  'tw:w-full tw:border tw:border-[#BC13FE] tw:rounded tw:px-3 tw:py-1.5 tw:text-sm tw:bg-[#0d0a14] tw:text-[#f0e6ff] tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-[#BC13FE]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="tw:flex tw:flex-col tw:gap-1">
      <label className="tw:text-sm tw:font-medium tw:text-[#c4b5fd]">{label}</label>
      {children}
    </div>
  );
}

export default function CreateRecipeModal({ onClose }: Props) {
  const createRecipe = useCreateRecipe();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [directions, setDirections] = useState<string[]>([]);
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [macros, setMacros] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRecipe.mutate(
      {
        name,
        ingredients,
        directions,
        description: description || undefined,
        prepTime: prepTime ? Number(prepTime) : undefined,
        cookTime: cookTime ? Number(cookTime) : undefined,
        servings: servings ? Number(servings) : undefined,
        tags: tags.length ? tags : undefined,
        macros: macros || undefined,
        imageUrl: imageUrl || undefined,
      },
      { onSuccess: onClose },
    );
  };

  const canSubmit = !!name && ingredients.length > 0 && directions.length > 0;

  return (
    <div className="tw:fixed tw:inset-0 tw:bg-[rgba(13,10,20,0.85)] tw:flex tw:items-center tw:justify-center tw:z-50">
      <div className="tw:bg-[#1a0f2e] tw:rounded-lg tw:shadow-xl tw:border tw:border-[#BC13FE] tw:w-full tw:max-w-2xl tw:max-h-[90vh] tw:overflow-y-auto tw:p-6">
        <div className="tw:flex tw:justify-between tw:items-center tw:mb-5">
          <h2 className="tw:text-xl tw:font-semibold tw:text-[#f0e6ff]">New Recipe</h2>
          <button
            onClick={onClose}
            className="tw:text-[#c4b5fd] tw:hover:text-[#f0e6ff] tw:text-lg tw:leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="tw:flex tw:flex-col tw:gap-4">
          <Field label="Name *">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputCls}
            />
          </Field>

          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={inputCls}
            />
          </Field>

          <div className="tw:grid tw:grid-cols-3 tw:gap-3">
            <Field label="Prep time (min)">
              <input
                type="number"
                min="0"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Cook time (min)">
              <input
                type="number"
                min="0"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Servings">
              <input
                type="number"
                min="0"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Tags">
            <ListInput
              items={tags}
              onChange={setTags}
              placeholder="Type a tag and press Enter"
            />
          </Field>

          <Field label="Ingredients *">
            <ListInput
              items={ingredients}
              onChange={setIngredients}
              placeholder="Type an ingredient and press Enter"
            />
          </Field>

          <Field label="Directions *">
            <ListInput
              items={directions}
              onChange={setDirections}
              placeholder="Type a step and press Enter"
            />
          </Field>

          <Field label="Macros">
            <textarea
              value={macros}
              onChange={(e) => setMacros(e.target.value)}
              rows={2}
              className={inputCls}
            />
          </Field>

          <Field label="Image URL">
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={inputCls}
            />
          </Field>

          {createRecipe.isError && (
            <p className="tw:text-[#e22c5a] tw:text-sm">Failed to create recipe.</p>
          )}

          <div className="tw:flex tw:justify-end tw:gap-3 tw:pt-2 tw:border-t tw:border-[rgba(188,19,254,0.2)]">
            <button
              type="button"
              onClick={onClose}
              className="tw:px-4 tw:py-2 tw:text-sm tw:border tw:border-[#c4b5fd] tw:text-[#c4b5fd] tw:rounded tw:hover:bg-[rgba(196,181,253,0.1)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createRecipe.isPending || !canSubmit}
              className="tw:px-4 tw:py-2 tw:text-sm tw:border tw:border-[#BC13FE] tw:text-[#BC13FE] tw:rounded tw:hover:bg-[#BC13FE] tw:hover:text-white tw:disabled:opacity-50 tw:disabled:cursor-not-allowed"
            >
              {createRecipe.isPending ? 'Saving...' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
