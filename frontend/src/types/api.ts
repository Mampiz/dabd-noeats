// Define an interface for each meal's details
export interface Meal {
	idMeal: string;
	strMeal: string;
	strDrinkAlternate: null | string;
	strCategory: string;
	strArea: string;
	strInstructions: string;
	strMealThumb: string;
	strTags: null | string;
	strYoutube: string;
	strIngredient1: string;
	strIngredient2: string;
	// Include all other ingredients up to strIngredient20
	strIngredient20?: string;
	strMeasure1: string;
	strMeasure2: string;
	// Include all other measures up to strMeasure20
	strMeasure20?: string;
	strSource: null | string;
	strImageSource: null | string;
	strCreativeCommonsConfirmed: null | string;
	dateModified: null | string;
}

// Define an interface for the entire response containing all meals
export interface MealsResponse {
	meals: Meal[];
}

// You can also define utility functions here to work with these types, like fetching data from the API, parsing, etc.

export interface User {
	id: number;
	telefon: string;
	correu: string;
	adreca: string;
}

// Define an interface for the entire response containing all meals
export interface UsersResponse {
	users: User[];
}
