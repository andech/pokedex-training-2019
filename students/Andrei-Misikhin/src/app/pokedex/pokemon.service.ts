import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Pokemon } from './pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private pokemonsUrl = 'http://localhost:3000/pokemons';

  constructor(
    private http: HttpClient
  ) { }

  getPokemons(_page: string, _limit: string): Observable<Pokemon[]> {
    let params = { _page, _limit }
    return this.http.get<Pokemon[]>(this.pokemonsUrl, { params })
  }

  getPokemonById(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.pokemonsUrl}/${id}`)
  }

  getPokemonsAmount(): Observable<number> {
    return this.http.get<Pokemon[]>(this.pokemonsUrl).pipe(
      map(pokemons => pokemons.length)
    );
  }
}
