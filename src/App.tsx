import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useGetRecipes } from './gql/hooks/recipeHooks';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import CreateRecipeModal from './components/CreateRecipeModal';
import './index.css';

function RecipeList() {
  const { data: recipes, isPending, isError } = useGetRecipes();
  const [showModal, setShowModal] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(recipes?.flatMap((r) => r.tags ?? []) ?? [])).sort();

  const filtered = activeTag ? recipes?.filter((r) => r.tags?.includes(activeTag)) : recipes;

  if (isPending) return <div className="tw:p-6 tw:text-gray-500">Loading...</div>;
  if (isError) return <div className="tw:p-6 tw:text-red-500">Failed to load recipes.</div>;

  return (
    <div className="tw:max-w-2xl tw:mx-auto tw:p-6">
      <div className="tw:flex tw:justify-between tw:items-center tw:mb-4">
        <h1 className="tw:text-2xl tw:font-bold tw:text-gray-900">Recipes</h1>
        <button
          onClick={() => setShowModal(true)}
          className="tw:px-4 tw:py-2 tw:text-sm tw:bg-blue-600 tw:text-white tw:rounded tw:hover:bg-blue-700"
        >
          New Recipe
        </button>
      </div>

      {allTags.length > 0 && (
        <div className="tw:flex tw:gap-2 tw:flex-wrap tw:mb-4">
          <button
            onClick={() => setActiveTag(null)}
            className={`tw:text-xs tw:rounded-full tw:px-3 tw:py-1 tw:border tw:transition-colors ${
              !activeTag
                ? 'tw:bg-blue-600 tw:text-white tw:border-blue-600'
                : 'tw:bg-white tw:text-gray-600 tw:border-gray-300 tw:hover:border-blue-400'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`tw:text-xs tw:rounded-full tw:px-3 tw:py-1 tw:border tw:transition-colors ${
                activeTag === tag
                  ? 'tw:bg-blue-600 tw:text-white tw:border-blue-600'
                  : 'tw:bg-white tw:text-gray-600 tw:border-gray-300 tw:hover:border-blue-400'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered?.length === 0 && (
        <p className="tw:text-gray-500 tw:text-sm">
          {activeTag ? `No recipes tagged "${activeTag}".` : 'No recipes yet. Create one!'}
        </p>
      )}

      <div className="tw:flex tw:flex-col tw:gap-3">
        {filtered?.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {showModal && <CreateRecipeModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

const App: React.FC = () => {
  return (
    <Routes>
      <Route index element={<RecipeList />} />
      <Route path=":id" element={<RecipeDetail />} />
      <Route path="*" element={<div className="tw:p-6">Not found.</div>} />
    </Routes>
  );
};

export default App;
