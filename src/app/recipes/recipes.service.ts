import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  private recipes: Recipe[] = [
    {
      id: 'r1',
      title: 'Steamed',
      imageUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Momo_nepal.jpg/1200px-Momo_nepal.jpg',
      ingredients: ['Minced meat','wrapper', 'masala' ]
    },
    {
      id: 'r2',
      title: 'Fried',
      imageUrl:'https://i.pinimg.com/originals/f6/98/41/f69841a6b48c3c8621a55a2a33ace35a.jpg',
      ingredients: ['Oil','Momo masala','Fryer' ]
    }
  ]

  getAllRecipes(){
    return [...this.recipes];
  }

  getRecipe(recipeId: string) {
    return {
      ...this.recipes.find(recipe => {
      return recipe.id === recipeId;
    })
  };
  }

  deleteRecipe(recipeId: string){
    this.recipes= this.recipes.filter(recipe =>{
      return recipe.id !== recipeId;
    })
  }

  constructor() { }
}
