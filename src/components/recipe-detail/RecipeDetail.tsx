import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetRecipe } from '../../gql/hooks/recipeHooks';
import type { Recipe } from '../../types/recipe';
import RecipeDetailEdit from './RecipeDetailEdit';
import RecipeDetailView from './RecipeDetailView';

const RecipeDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: recipe, isPending, isError } = useGetRecipe(id!);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Recipe | null>(null);

  if (isPending) return <div className="tw:p-6 tw:text-[#c4b5fd]">Loading...</div>;
  if (isError || !recipe) return <div className="tw:p-6 tw:text-[#e22c5a]">Recipe not found.</div>;

  const patch = (fields: Partial<Recipe>) => setDraft((prev) => ({ ...prev!, ...fields }));

  const exitEdit = () => {
    setDraft(null);
    setEditing(false);
  };

  const enterEdit = () => {
    setDraft({ ...recipe });
    setEditing(true);
  };

  return (
    <div className="tw:max-w-2xl tw:mx-auto tw:px-6 tw:pt-6 tw:pb-16">
      <button
        onClick={() => navigate('/recipes')}
        className="tw:text-sm tw:text-[#00E5FF] tw:hover:underline tw:mb-6 tw:inline-flex tw:items-center tw:gap-1"
      >
        ← Back
      </button>

      {editing ? (
        <RecipeDetailEdit draft={draft} exitEdit={exitEdit} patch={patch} />
      ) : (
        <RecipeDetailView enterEdit={enterEdit} recipe={recipe} />
      )}
    </div>
  );
};

export default RecipeDetail;
