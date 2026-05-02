import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useGetRecipes } from './gql/hooks/recipeHooks';
import RecipeCard from './components/RecipeCard';
import RecipeDetail from './components/RecipeDetail';
import CreateRecipeModal from './components/CreateRecipeModal';
import { Button } from '@bka-stuff/pe-mfe-utils';
import './index.css';

function RecipeList() {
  const { data: recipes, isPending, isError } = useGetRecipes();
  const [showModal, setShowModal] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(recipes?.flatMap((r) => r.tags ?? []) ?? [])).sort();

  const filtered = activeTag ? recipes?.filter((r) => r.tags?.includes(activeTag)) : recipes;

  if (isPending) return <div className="tw:p-6 tw:text-[#c4b5fd]">Loading...</div>;
  if (isError) return <div className="tw:p-6 tw:text-[#e22c5a]">Failed to load recipes.</div>;

  return (
    <div className="tw:max-w-2xl tw:mx-auto tw:p-6">
      <div className="tw:flex tw:justify-between tw:items-center tw:mb-4">
        <h1 className="tw:text-2xl tw:font-bold tw:text-[#f0e6ff]">Recipes</h1>
        <Button last text="New Recipe" variant='blue' onClick={() => setShowModal(true)} />
      </div>

      {allTags.length > 0 && (
        <div className="tw:flex tw:gap-2 tw:flex-wrap tw:mb-4">
          <button
            onClick={() => setActiveTag(null)}
            className={`tw:text-xs tw:rounded-full tw:px-3 tw:py-1 tw:border tw:transition-colors ${!activeTag
                ? 'tw:bg-[#00E5FF] tw:text-[#0d0a14] tw:border-[#00E5FF]'
                : 'tw:bg-transparent tw:text-[#00E5FF] tw:border-[#00E5FF] tw:hover:bg-[#00E5FF] tw:hover:text-[#0d0a14]'
              }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`tw:text-xs tw:rounded-full tw:px-3 tw:py-1 tw:border tw:transition-colors ${activeTag === tag
                  ? 'tw:bg-[#BC13FE] tw:text-white tw:border-[#BC13FE]'
                  : 'tw:bg-transparent tw:text-[#c4b5fd] tw:border-[#BC13FE] tw:hover:border-[#BC13FE] tw:hover:text-[#f0e6ff]'
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered?.length === 0 && (
        <p className="tw:text-[#c4b5fd] tw:text-sm">
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
