import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RecipeDetail from './components/recipe-detail/RecipeDetail';
import RecipeList from './components/RecipeList';
import './index.css';

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
