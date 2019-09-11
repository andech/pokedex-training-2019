import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, Subject } from 'rxjs';

import { PaginationParams } from '../paginationParams';
import { PokemonService } from '../pokemon.service';
import { map, takeUntil  } from 'rxjs/operators';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();

  DEFAULT_PAGE: number = 1;
  DEFAULT_LIMIT: number = 25;

  pokemonsAmount$: Observable<number>;
  paginationParams$: Observable<PaginationParams>;

  firstPage: { page: number } = { page: 1 };
  lastPage: { page: number, limit: number };
  middlePages: { page: number, limit: number }[] = [];

  constructor(
    private pokemonService: PokemonService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.paginationParams$ = this.getPaginationParams();
    this.pokemonsAmount$ = this.pokemonService.getPokemonsAmount();
    this.calculatePages();
  }

  getPaginationParams(): Observable<PaginationParams> {
    return this.route.queryParamMap.pipe(
      map(params => ({
          page: +params.get('page') || this.DEFAULT_PAGE,
          limit: +params.get('limit') || this.DEFAULT_LIMIT
        })
      )
    );
  }

  calculatePages(): void {
    combineLatest(this.paginationParams$, this.pokemonsAmount$)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(([paginationParams, pokemonsAmount]) => {

        let { page: currentPage, limit } = paginationParams; 

        this.lastPage = { page: Math.floor(pokemonsAmount / limit) - 1, limit };

        if (currentPage < 3) {
          this.middlePages = [];
          for (let page = 1; page < 6; page++) {
            this.middlePages.push({ page, limit })
          }
        }

        if (currentPage >= 3 && currentPage <= this.lastPage.page - 3) {
          this.middlePages = [];
          for (let page = -2; page < 3; page++) {
            this.middlePages.push({ page: currentPage + page, limit })
          }
        }

        if (currentPage > this.lastPage.page - 3) {
          this.middlePages = [];
          for (let page = -4; page < 1; page++) {
            this.middlePages.push({ page: this.lastPage.page + page, limit })
          }
        }
      });
  }  

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}