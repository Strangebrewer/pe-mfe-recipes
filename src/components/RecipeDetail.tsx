import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteRecipe, useGetRecipe, useUpdateRecipe } from '../gql/hooks/recipeHooks';
import ListInput from './ListInput';
import type { Recipe } from '../types/recipe';

const inputCls =
  'tw:w-full tw:border tw:border-[#BC13FE] tw:rounded tw:px-3 tw:py-1.5 tw:text-sm tw:bg-[#0d0a14] tw:text-[#f0e6ff] tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-[#BC13FE]';

function Section({
  label,
  show,
  children,
}: {
  label: string;
  show: boolean;
  children: React.ReactNode;
}) {
  if (!show) return null;
  return (
    <div className="tw:mb-6">
      <h2 className="tw:text-xs tw:font-semibold tw:text-[#c4b5fd] tw:uppercase tw:tracking-wide tw:mb-2">
        {label}
      </h2>
      {children}
    </div>
  );
}

function MetaField({
  label,
  display,
  editing,
  inputValue,
  onInputChange,
}: {
  label: string;
  display?: string;
  editing: boolean;
  inputValue: string;
  onInputChange: (v: string) => void;
}) {
  if (!editing && !display) return null;
  return (
    <div>
      <div className="tw:text-xs tw:text-[#c4b5fd] tw:mb-0.5">{label}</div>
      {editing ? (
        <input
          type="number"
          min="0"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          className="tw:border tw:border-[#BC13FE] tw:rounded tw:px-2 tw:py-1 tw:text-sm tw:w-24 tw:bg-[#0d0a14] tw:text-[#f0e6ff] tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-[#BC13FE]"
        />
      ) : (
        <div className="tw:text-sm tw:font-medium tw:text-[#f0e6ff]">{display}</div>
      )}
    </div>
  );
}

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: recipe, isPending, isError } = useGetRecipe(id!);
  const updateRecipe = useUpdateRecipe();
  const deleteRecipe = useDeleteRecipe();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Recipe | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isPending) return <div className="tw:p-6 tw:text-[#c4b5fd]">Loading...</div>;
  if (isError || !recipe) return <div className="tw:p-6 tw:text-[#e22c5a]">Recipe not found.</div>;

  const enterEdit = () => {
    setDraft({ ...recipe });
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(null);
    setEditing(false);
  };

  const save = () => {
    if (!draft) return;
    updateRecipe.mutate(draft, {
      onSuccess: () => {
        setEditing(false);
        setDraft(null);
      },
    });
  };

  const handleDelete = () => {
    deleteRecipe.mutate(recipe.id, {
      onSuccess: () => navigate('/recipes'),
    });
  };

  const patch = (fields: Partial<Recipe>) => setDraft((prev) => ({ ...prev!, ...fields }));

  const d = editing ? draft! : recipe;

  return (
    <div className="tw:max-w-2xl tw:mx-auto tw:px-6 tw:pt-6 tw:pb-16">
      <button
        onClick={() => navigate('/recipes')}
        className="tw:text-sm tw:text-[#00E5FF] tw:hover:underline tw:mb-6 tw:inline-flex tw:items-center tw:gap-1"
      >
        ← Back
      </button>

      {/* Header: name + actions */}
      <div className="tw:flex tw:items-start tw:gap-4 tw:mb-6">
        {editing ? (
          <input
            value={d.name}
            onChange={(e) => patch({ name: e.target.value })}
            className={`${inputCls} tw:text-xl tw:font-bold tw:flex-1`}
          />
        ) : (
          <h1 className="tw:text-2xl tw:font-bold tw:text-[#f0e6ff] tw:flex-1">{d.name}</h1>
        )}

        <div className="tw:flex tw:items-center tw:gap-2 tw:shrink-0">
          {editing ? (
            <>
              <button
                onClick={cancelEdit}
                className="tw:px-3 tw:py-1.5 tw:text-sm tw:border tw:border-[#c4b5fd] tw:text-[#c4b5fd] tw:rounded tw:hover:bg-[rgba(196,181,253,0.1)]"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={updateRecipe.isPending}
                className="tw:px-3 tw:py-1.5 tw:text-sm tw:border tw:border-[#BC13FE] tw:text-[#BC13FE] tw:rounded tw:hover:bg-[#BC13FE] tw:hover:text-white tw:disabled:opacity-50"
              >
                {updateRecipe.isPending ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : confirmDelete ? (
            <>
              <span className="tw:text-sm tw:text-[#c4b5fd]">Delete?</span>
              <button
                onClick={handleDelete}
                disabled={deleteRecipe.isPending}
                className="tw:px-3 tw:py-1.5 tw:text-sm tw:bg-[#e22c5a] tw:text-white tw:rounded tw:hover:bg-[#c01848] tw:disabled:opacity-50"
              >
                {deleteRecipe.isPending ? 'Deleting...' : 'Yes'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="tw:px-3 tw:py-1.5 tw:text-sm tw:border tw:border-[#c4b5fd] tw:text-[#c4b5fd] tw:rounded tw:hover:bg-[rgba(196,181,253,0.1)]"
              >
                No
              </button>
            </>
          ) : (
            <>
              <button
                onClick={enterEdit}
                className="tw:px-3 tw:py-1.5 tw:text-sm tw:border tw:border-[#c4b5fd] tw:text-[#c4b5fd] tw:rounded tw:hover:bg-[rgba(196,181,253,0.1)]"
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="tw:px-3 tw:py-1.5 tw:text-sm tw:border tw:border-[#e22c5a] tw:text-[#e22c5a] tw:rounded tw:hover:bg-[#e22c5a] tw:hover:text-white"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <Section label="Description" show={editing || !!d.description}>
        {editing ? (
          <textarea
            value={d.description ?? ''}
            onChange={(e) => patch({ description: e.target.value || undefined })}
            rows={2}
            className={inputCls}
          />
        ) : (
          <p className="tw:text-[#f0e6ff]">{d.description}</p>
        )}
      </Section>

      {/* Meta: prep / cook / servings */}
      {(editing ||
        d.prepTime != null ||
        d.cookTime != null ||
        d.servings != null) && (
        <div className="tw:flex tw:gap-8 tw:mb-6">
          <MetaField
            label="Prep"
            display={d.prepTime != null ? `${d.prepTime} min` : undefined}
            editing={editing}
            inputValue={d.prepTime?.toString() ?? ''}
            onInputChange={(v) => patch({ prepTime: v ? Number(v) : undefined })}
          />
          <MetaField
            label="Cook"
            display={d.cookTime != null ? `${d.cookTime} min` : undefined}
            editing={editing}
            inputValue={d.cookTime?.toString() ?? ''}
            onInputChange={(v) => patch({ cookTime: v ? Number(v) : undefined })}
          />
          <MetaField
            label="Servings"
            display={d.servings?.toString()}
            editing={editing}
            inputValue={d.servings?.toString() ?? ''}
            onInputChange={(v) => patch({ servings: v ? Number(v) : undefined })}
          />
        </div>
      )}

      {/* Tags */}
      <Section label="Tags" show={editing || !!d.tags?.length}>
        {editing ? (
          <ListInput
            items={d.tags ?? []}
            onChange={(tags) => patch({ tags })}
            placeholder="Type a tag and press Enter"
          />
        ) : (
          <div className="tw:flex tw:gap-1 tw:flex-wrap">
            {d.tags?.map((tag) => (
              <span
                key={tag}
                className="tw:text-sm tw:bg-[rgba(26,15,46,0.8)] tw:text-[#00E5FF] tw:border tw:border-[rgba(0,229,255,0.3)] tw:rounded-full tw:px-3 tw:py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Section>

      {/* Ingredients */}
      <Section label="Ingredients" show>
        {editing ? (
          <ListInput
            items={d.ingredients}
            onChange={(ingredients) => patch({ ingredients })}
            placeholder="Type an ingredient and press Enter"
          />
        ) : (
          <ul className="tw:space-y-1">
            {d.ingredients.map((ing, i) => (
              <li key={i} className="tw:text-[#f0e6ff] tw:text-sm tw:flex tw:gap-2">
                <span className="tw:text-[#51CB20] tw:shrink-0">·</span>
                {ing}
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Directions */}
      <Section label="Directions" show>
        {editing ? (
          <ListInput
            items={d.directions}
            onChange={(directions) => patch({ directions })}
            placeholder="Type a step and press Enter"
          />
        ) : (
          <ol className="tw:space-y-3">
            {d.directions.map((step, i) => (
              <li key={i} className="tw:text-[#f0e6ff] tw:text-sm tw:flex tw:gap-3">
                <span className="tw:text-[#00E5FF] tw:font-medium tw:shrink-0 tw:w-5 tw:text-right">
                  {i + 1}.
                </span>
                {step}
              </li>
            ))}
          </ol>
        )}
      </Section>

      {/* Macros */}
      <Section label="Macros" show={editing || !!d.macros}>
        {editing ? (
          <textarea
            value={d.macros ?? ''}
            onChange={(e) => patch({ macros: e.target.value || undefined })}
            rows={2}
            className={inputCls}
          />
        ) : (
          <p className="tw:text-[#f0e6ff] tw:text-sm tw:whitespace-pre-wrap">{d.macros}</p>
        )}
      </Section>

      {/* Image URL */}
      <Section label="Image URL" show={editing || !!d.imageUrl}>
        {editing ? (
          <input
            value={d.imageUrl ?? ''}
            onChange={(e) => patch({ imageUrl: e.target.value || undefined })}
            className={inputCls}
          />
        ) : (
          <a
            href={d.imageUrl}
            target="_blank"
            rel="noreferrer"
            className="tw:text-[#00E5FF] tw:hover:underline tw:text-sm tw:break-all"
          >
            {d.imageUrl}
          </a>
        )}
      </Section>

      {updateRecipe.isError && (
        <p className="tw:text-[#e22c5a] tw:text-sm tw:mt-2">Failed to save changes.</p>
      )}
    </div>
  );
}
