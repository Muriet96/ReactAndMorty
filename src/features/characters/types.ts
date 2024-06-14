/**
 * Character status as returned by the API.
 * Possible values: 'Alive', 'Dead', 'unknown', but can be any string.
 */
export type CharacterStatus = 'Alive' | 'Dead' | 'unknown' | string;

/**
 * Character gender as returned by the API.
 * Possible values: 'Female', 'Male', 'Genderless', 'unknown', but can be any string.
 */
export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown' | string;

export interface CharacterLocation {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: CharacterGender;
  origin: CharacterLocation;
  location: CharacterLocation;
  image: string;
  episode: string[];
  url: string;
  created: string;
}