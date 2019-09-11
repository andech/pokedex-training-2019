import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Pokemon } from '../pokemon';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrls: ['./pokemons.component.css']
})
export class PokemonsComponent implements OnInit {

  DEFAULT_PAGE: string = '1';
  DEFAULT_LIMIT: string = '25';

  pokemons$: Observable<Pokemon[]>;
  page: string;
  limit: string;

  constructor(
    private pokemonService: PokemonService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.pokemons$ = this.getPokemons();
  }

  getPokemons(): Observable<Pokemon[]> {
    return this.route.queryParamMap.pipe(
      switchMap(params => {
        this.page = params.get('page') || this.DEFAULT_PAGE;
        this.limit = params.get('limit') || this.DEFAULT_LIMIT;
        return this.pokemonService.getPokemons(this.page, this.limit);
      })
    )
  }

}
