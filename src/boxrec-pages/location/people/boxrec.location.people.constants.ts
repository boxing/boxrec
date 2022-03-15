import {WeightDivision, WinLossDraw} from "boxrec-requests";
import {BoxrecLocation, Record} from "../../boxrec.constants";
import {BoxrecPageLocationPeopleRow} from "./boxrec.page.location.people.row";

export interface BoxrecPageLocationPeopleOutput {
    numberOfPages: number;
    numberOfPeople: number;
    people: BoxrecPageLocationPeopleRow[];
}

export interface BoxrecPageLocationBoxerRowOutput {
    career: Array<number | null>;
    division: WeightDivision | null;
    id: number;
    last6: WinLossDraw[];
    location: BoxrecLocation;
    miles: number;
    name: string;
    record: Record;
    sex: "male" | "female";
}

export interface BoxrecPageLocationPeopleRowOutput {
    id: number;
    location: BoxrecLocation;
    miles: number;
    name: string;
    sex: "male" | "female";
}
