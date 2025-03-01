import { Injectable } from '@angular/core';
import { EndpointService } from './endpoint.service';
import { Context } from '../models/context';
import { MapFull, MapSimple, MapType } from '../models/map';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MapService {
    private selectedMapSubject: BehaviorSubject<MapFull | undefined> = new BehaviorSubject<MapFull | undefined>(undefined);
    public selectedMap: Observable<MapFull | undefined> = this.selectedMapSubject.asObservable();
    
    public mapTypeSubject: BehaviorSubject<MapType> = new BehaviorSubject<MapType>(MapType.All);
    public mapType: Observable<MapType> = this.mapTypeSubject.asObservable();

    constructor(
        private endpointService: EndpointService
    ) { }

    public setSelectedMap(map: MapSimple | undefined) {
        if (map == undefined) {
            this.selectedMapSubject.next(undefined);
        } else {
            this.getMap(map.id).subscribe(data => this.selectedMapSubject.next(data));
        }
    }

    public setMapType(type: MapType) {
        if (type != this.mapTypeSubject.value)
            this.mapTypeSubject.next(type);
    }
    // [GET] index.php/maps?repository=:repository
    public getMapList(context: Context) : Observable<MapSimple[] | undefined >{
        return this.endpointService.get<MapSimple[] | undefined>(`maps?repository=${context.repository}`);
    }
    // [GET] index.php/maps/:id?fullMap=true
    public getMap(id: string) : Observable<MapFull | undefined> {
        return this.endpointService.get<any>(`maps/${id}?fullMap=true`).pipe(map(MapFull.fromJson));
    }
} 