import { Injectable } from "@angular/core";
import { FormDataService } from "../../services/form-data.service";
import { LocalStorageService } from "../../services/localstorage.service";
import { USER_DATA_STRING } from "../../constants/db.index";

@Injectable()
export class ReviewService{
    constructor(private fds: FormDataService, private ls: LocalStorageService) {}

    getDisplayDatas() {
        const fields = this.fds.fields.flat()
        const userData = this.ls.getItem(USER_DATA_STRING) as {[key: string]: string}
        return fields.reduce((acc : {[key: string]: string}, field) => {
            acc[field.label] = userData[field.key]
            return acc
        },{})
    }
}