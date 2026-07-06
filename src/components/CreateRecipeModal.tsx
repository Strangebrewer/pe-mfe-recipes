import React, { useState } from 'react';
import { useCreateRecipe } from '../gql/hooks/recipeHooks';
import {
  Input,
  Textarea,
  ListInput,
  InputGroup,
  ModalButtons,
  Modal,
  ModalContent,
} from '@bka-stuff/pe-mfe-utils';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateRecipeModal({ onClose, isOpen }: Props) {
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
    <Modal isOpen={isOpen} close={onClose}>
      <ModalContent heading="New Recipe">
        <form onSubmit={handleSubmit} className="tw:flex tw:flex-col tw:gap-4">
          <InputGroup label="Name *">
            <Input name="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </InputGroup>

          <InputGroup label="Description">
            <Textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </InputGroup>

          <div className="tw:grid tw:grid-cols-3 tw:gap-3">
            <InputGroup label="Prep time (min)">
              <Input
                type="number"
                name="prepTime"
                min="0"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
              />
            </InputGroup>
            <InputGroup label="Cook time (min)">
              <Input
                type="number"
                name="cookTime"
                min="0"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
              />
            </InputGroup>
            <InputGroup label="Servings">
              <Input
                type="number"
                name="servings"
                min="0"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
              />
            </InputGroup>
          </div>

          <InputGroup label="Tags">
            <ListInput
              items={tags}
              onChange={setTags}
              placeholder="Type a tag and press Enter"
              full
            />
          </InputGroup>

          <InputGroup label="Ingredients *">
            <ListInput
              items={ingredients}
              onChange={setIngredients}
              placeholder="Type an ingredient and press Enter"
              full
            />
          </InputGroup>

          <InputGroup label="Directions *">
            <ListInput
              items={directions}
              onChange={setDirections}
              placeholder="Type a step and press Enter"
              full
            />
          </InputGroup>

          <InputGroup label="Macros">
            <Textarea
              name="macros"
              value={macros}
              onChange={(e) => setMacros(e.target.value)}
              rows={2}
            />
          </InputGroup>

          <InputGroup label="Image URL">
            <Input name="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </InputGroup>

          {createRecipe.isError && (
            <p className="tw:text-[#e22c5a] tw:text-sm">Failed to create recipe.</p>
          )}

          <ModalButtons
            onClose={onClose}
            confirmText={createRecipe.isPending ? 'Saving...' : 'Create Recipe'}
            isDisabled={createRecipe.isPending || !canSubmit}
          />
        </form>
      </ModalContent>
    </Modal>
  );
}
