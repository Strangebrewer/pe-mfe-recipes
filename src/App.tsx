import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useGetRecipes, useCreateRecipe } from './gql/hooks/recipeHooks';
import './index.css';

function RecipeList() {
  const { data: recipes, isPending, isError } = useGetRecipes();
  const createRecipe = useCreateRecipe();

  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [directions, setDirections] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRecipe.mutate({
      name,
      ingredients: ingredients.split('\n').filter(Boolean),
      directions: directions.split('\n').filter(Boolean),
    });
    setName('');
    setIngredients('');
    setDirections('');
  };

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Failed to load recipes.</div>;

  return (
    <div>
      <h1>Recipes</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Ingredients (one per line)</label>
          <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} required />
        </div>
        <div>
          <label>Directions (one per line)</label>
          <textarea value={directions} onChange={(e) => setDirections(e.target.value)} required />
        </div>
        <button type="submit" disabled={createRecipe.isPending}>
          {createRecipe.isPending ? 'Saving...' : 'Add Recipe'}
        </button>
        {createRecipe.isError && <p>Error creating recipe.</p>}
      </form>

      {recipes?.length === 0 && <p>No recipes yet.</p>}
      <ul>
        {recipes?.map((recipe) => (
          <li key={recipe.id}>{recipe.name}</li>
        ))}
      </ul>
    </div>
  );
}

function NotFound() {
  return <div>Not found.</div>;
}

const App: React.FC = () => {
  return (
    <Routes>
      <Route index element={<RecipeList />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
